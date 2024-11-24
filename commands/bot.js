const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { version: discordJsVersion } = require('discord.js');
const { version: nodeVersion } = process;
const { version: botVersion } = require('../package.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bot')
		.setDescription('Bot related commands')
		.addSubcommand(subcommand =>
			subcommand
				.setName('ping')
				.setDescription('Show detailed info about the bot ping'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('info')
				.setDescription('Show some info about the bot itself'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('credits')
				.setDescription('Show the bot credits')), // DO NOT REMOVE THIS COMMAND, THIS CONTAINS THE COPYRIGHT INFO!!

	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();

		if (subcommand === 'ping') {
			const embed = new EmbedBuilder()
				.setTitle('Ping Information')
				.setColor(0x00FF00)
				.addFields(
					{ name: 'Websocket Ping', value: `${interaction.client.ws.ping}ms`, inline: true },
					{ name: 'Discord.js Version', value: discordJsVersion, inline: true },
					{ name: 'Node.js Version', value: nodeVersion, inline: true },
					{ name: 'Bot Version', value: botVersion, inline: true },
				)
				.setTimestamp();
			await interaction.reply({ embeds: [embed] });

		} else if (subcommand === 'info') {
			const embed = new EmbedBuilder()
				.setTitle('Bot Information')
				.setColor(0x0099FF)
				.setDescription('Here is some info about this bot:')
				.addFields(
					{ name: 'Bot name', value: interaction.client.user.username, inline: true },
					{ name: 'Bot ID', value: interaction.client.user.id, inline: true },
                    { name: 'Bot owner:', value: "JTDMedia", inline: true },
				)
				.setTimestamp();
			await interaction.reply({ embeds: [embed] });

		} else if (subcommand === 'credits') {
			const embed = new EmbedBuilder()
				.setTitle('Credits')
				.setColor(0xFFA500)
				.setDescription('This discord bot was created by JustTheDev media')
				.addFields(
					{ name: 'GitHub Repo', value: '[JTDBot Repo](https://github.com/JTDmedia/JTDBot)', inline: false },
				)
				.setTimestamp();
			await interaction.reply({ embeds: [embed] });
		}
	},
};
