const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const { version } = require('../package.json'); // Assuming this script is in a subdirectory.

module.exports = {
	data: new SlashCommandBuilder()
		.setName('developers')
		.setDescription('Developer related commands')
		.addSubcommand(subcommand =>
			subcommand
				.setName('servers')
				.setDescription('Check the bot servers'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('eval')
				.setDescription('Run a piece of code and get the result')
				.addStringOption(option => option.setName('code').setDescription('Code to execute')))
		.addSubcommand(subcommand =>
			subcommand
				.setName('fetch')
				.setDescription('Fetch the latest release from a GitHub repository')),

	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();
		const developers_id = "1186215000482779157"; // Your ID

		// Subcommand: Servers
		if (subcommand === 'servers') {
			const embed = new EmbedBuilder()
				.setTitle('Bot Servers')
				.setColor(0x00FF00)
				.setDescription(`This bot is currently active in ${interaction.client.guilds.cache.size} servers.`)
				.setTimestamp();
			await interaction.reply({ embeds: [embed] });

		// Subcommand: Eval
		} else if (subcommand === 'eval') {
			if (interaction.user.id !== developers_id) {
				return interaction.reply({ content: 'You are not authorized to use this command.', ephemeral: true });
			}

			try {
				const code = interaction.options.getString('code');
				const evaled = eval(code); // CAUTION: Use this only if you trust the users.
				const cleaned = typeof evaled === 'string' ? evaled : require('util').inspect(evaled);
				await interaction.reply(`\`\`\`js\n${cleaned}\n\`\`\``);
			} catch (error) {
				await interaction.reply(`\`ERROR\` \`\`\`js\n${error}\n\`\`\``);
			}

		// Subcommand: Fetch
		} else if (subcommand === 'fetch') {
			try {
				const apiUrl = `https://api.github.com/repos/JTDMedia/JTDBot/releases/latest`;
				const response = await fetch(apiUrl);

				if (!response.ok) {
					return interaction.reply({ content: `Failed to fetch release data: ${response.statusText}`, ephemeral: true });
				}

				const releaseData = await response.json();
				const latestVersion = releaseData.tag_name;
				const zipUrl = releaseData.zipball_url;

				if (latestVersion > version) {
					// Download the new release
					const res = await fetch(zipUrl);
					const dest = path.join(__dirname, '../', `JTDBot-latest.zip`);

					const fileStream = fs.createWriteStream(dest);
					await new Promise((resolve, reject) => {
						res.body.pipe(fileStream);
						res.body.on('error', reject);
						fileStream.on('finish', resolve);
					});

					await interaction.reply(`New version \`${latestVersion}\` downloaded to \`${dest}\`.`);
				} else {
					await interaction.reply(`You are already using the latest version (\`${version}\`).`);
				}
			} catch (error) {
				console.error(error);
				await interaction.reply({ content: `An error occurred while fetching the latest release: ${error.message}`, ephemeral: true });
			}
		}
	},
};
