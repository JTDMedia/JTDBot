const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('meter')
		.setDescription('Meter related commands')
		.addSubcommand(subcommand =>
			subcommand
				.setName('simprate')
				.setDescription('How much simp are you?'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('gayrate')
				.setDescription('How much gay are you?'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('epicgamerrate')
				.setDescription('How much epic gamer are you?')),

	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();
        const percent = Math.random()*100
		const gamer = percent/5
		if (subcommand === 'simprate') {
			const embed = new EmbedBuilder()
				.setTitle('Simp rate')
				.setColor(0x00FF00)
                .setDescription(`You are ${percent}% simp!`)
				.setTimestamp();
			await interaction.reply({ embeds: [embed] });

		} else if (subcommand === 'gayrate') {
			const embed = new EmbedBuilder()
				.setTitle('Gay rate')
				.setColor(0x0099FF)
				.setDescription(`You are ${percent}% gay!`)
				.setTimestamp();
			await interaction.reply({ embeds: [embed] });

		} else if (subcommand === 'epicgamerrate') {
			const embed = new EmbedBuilder()
				.setTitle('Epic gamer rate')
				.setColor(0xFFA500)
				.setDescription(`You are ${gamer}% epic gamer!`)
				.setTimestamp();
			await interaction.reply({ embeds: [embed] });
		}
	},
};
