const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { version: discordJsVersion } = require('discord.js');
const { version: nodeVersion } = process;
const { version: botVersion } = require('../package.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('amogus')
		.setDescription('Among us related commands')
		.addSubcommand(subcommand =>
			subcommand
				.setName('impostor')
				.setDescription('Turn into impostor'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('crewmate')
				.setDescription('Turn into crewmate')),

	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();

		if (subcommand === 'impostor') {
			const embed = new EmbedBuilder()
				.setTitle(`${interaction.user.tag} IS AN IMPOSTOR! RUN!!`)
				.setColor(0x00FF00)
				.setTimestamp();
			await interaction.reply({ embeds: [embed] });

		} else if (subcommand === 'crewmate') {
			const embed = new EmbedBuilder()
				.setTitle(`${interaction.user.tag} is a crewmate, run from the IMPOSTOR!!`)
				.setColor(0x0099FF)
				.setTimestamp();
			await interaction.reply({ embeds: [embed] });

		}
	},
};
