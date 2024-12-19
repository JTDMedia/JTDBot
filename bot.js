const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, REST, Routes, ActivityType } = require('discord.js');
const { Manager } = require('erela.js'); // Erela.js toevoegen
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
    ],
});

client.commands = new Collection();

// Erela.js configureren
client.manager = new Manager({
    nodes: [
        {
            host: process.env.LAVALINK_HOST,
            port: parseInt(process.env.LAVALINK_PORT, 10),
            password: process.env.LAVALINK_PASSWORD,
            secure: process.env.LAVALINK_SECURE === 'true', // Controleer of secure true is
        },
    ],
    send(id, payload) {
        const guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
    },
});

// Events voor Erela.js
client.manager.on('nodeConnect', node => console.log(`Node "${node.options.identifier}" connected.`));
client.manager.on('nodeError', (node, error) => console.error(`Node "${node.options.identifier}" error: ${error.message}`));
client.manager.on('trackStart', (player, track) => {
    const channel = client.channels.cache.get(player.textChannel);
    if (channel) channel.send(`Now playing: **${track.title}**`);
});
client.manager.on('queueEnd', player => {
    const channel = client.channels.cache.get(player.textChannel);
    if (channel) channel.send('Queue has ended.');
    player.destroy();
});

// Commands laden
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    client.manager.init(client.user.id); // Erela.js manager initialiseren
    client.user.setActivity(process.env.STATUS, { type: ActivityType.Watching });
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction, client);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log(`Started refreshing ${client.commands.size} application (/) commands.`);

        const data = await rest.put(
            Routes.applicationCommands(process.env.DISCORD_ID),
            { body: client.commands.map(cmd => cmd.data.toJSON()) },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();

client.login(process.env.DISCORD_TOKEN);
