const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('music')
        .setDescription('Control music playback')
        .addSubcommand(subcommand =>
            subcommand
                .setName('play')
                .setDescription('Play a song')
                .addStringOption(option =>
                    option.setName('query')
                        .setDescription('The song name or URL')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('stop')
                .setDescription('Stop the music and clear the queue'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('skip')
                .setDescription('Skip the current track')),

    async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand();
        const query = interaction.options.getString('query');
        const { channel } = interaction.member.voice;

        if (!channel) {
            return interaction.reply({ content: 'You need to be in a voice channel to use this command!', ephemeral: true });
        }

        const player = client.manager.players.get(interaction.guild.id) || client.manager.create({
            guild: interaction.guild.id,
            voiceChannel: channel.id,
            textChannel: interaction.channel.id,
        });

        if (subcommand === 'play') {
            player.connect();

            const searchResult = await client.manager.search(query, interaction.user);
            if (searchResult.loadType === 'NO_MATCHES') {
                return interaction.reply({ content: 'No results found!', ephemeral: true });
            }

            player.queue.add(searchResult.tracks[0]);
            if (!player.playing && !player.paused && !player.queue.size) player.play();

            interaction.reply(`Added **${searchResult.tracks[0].title}** to the queue!`);
        } else if (subcommand === 'stop') {
            if (!player) return interaction.reply({ content: 'No music is being played.', ephemeral: true });
            player.destroy();
            interaction.reply('Stopped the music and cleared the queue!');
        } else if (subcommand === 'skip') {
            if (!player || !player.queue.current) return interaction.reply({ content: 'No song to skip.', ephemeral: true });
            player.stop();
            interaction.reply('Skipped the current song!');
        }
    },
};
