const Discord = require('discord.js');
const chalk = require('chalk');
require('dotenv').config();
const { version } = require('./package.json');
const axios = require('axios');

// Check if is up to date
axios.get('https://api.github.com/repos/JTDMedia/JTDBot/releases/latest').then(res => {
    if (res.data.tag_name !== version) {
        console.log(chalk.red.bgYellow(`Your bot is not up to date! Please update to the latest version!`, version + ' -> ' + res.data.tag_name));
    }
}).catch(err => {
    console.log(chalk.red.bgYellow(`Failed to check if bot is up to date!`));
});

const webhookConfig = {
    id: process.env.WEBHOOK_ID,
    token: process.env.WEBHOOK_TOKEN,
};

console.clear();
console.log(chalk.blue(chalk.bold(`System`)), (chalk.white(`>>`)), (chalk.green(`Starting up...`)));
console.log(`\u001b[0m`);
console.log(chalk.red(`© JTDMedia | 2024 - ${new Date().getFullYear()}`));
console.log(chalk.red(`All rights reserved`));
console.log(`\u001b[0m`);
console.log(`\u001b[0m`);
console.log(chalk.blue(chalk.bold(`System`)), (chalk.white(`>>`)), chalk.red(`Running JTDBot version ${version}`));
console.log(`\u001b[0m`);

const manager = new Discord.ShardingManager('./bot.js', {
    totalShards: 'auto',
    token: process.env.DISCORD_TOKEN,
    respawn: true
});

manager.on('shardCreate', shard => {
    let embed = new Discord.EmbedBuilder()
        .setTitle(`🆙・Launching shard`)
        .setDescription(`A shard has just been launched`)
        .setFields([
            {
                name: "🆔┆ID",
                value: `${shard.id + 1}/${manager.totalShards}`,
                inline: true
            },
            {
                name: `📃┆State`,
                value: `Starting up...`,
                inline: true
            }
        ])
        .setColor('BLUE');

    const webhook = new Discord.WebhookClient({
        id: webhookConfig.id,
        token: webhookConfig.token
    });

    webhook.send({
        username: 'JTDBot - Logs',
        embeds: [embed],
    });

    console.log(chalk.blue(chalk.bold(`System`)), (chalk.white(`>>`)), (chalk.green(`Starting`)), chalk.red(`Shard #${shard.id + 1}`), (chalk.white(`...`)));
    console.log(`\u001b[0m`);

    shard.on("death", (process) => {
        const embed = new Discord.EmbedBuilder()
            .setTitle(`🚨・Closing shard ${shard.id + 1}/${manager.totalShards} unexpectedly`)
            .setFields([
                {
                    name: "🆔┆ID",
                    value: `${shard.id + 1}/${manager.totalShards}`,
                },
            ])
            .setColor('RED');

        webhook.send({
            username: 'JTDBot - Logs',
            embeds: [embed]
        });

        if (process.exitCode === null) {
            const embed = new Discord.EmbedBuilder()
                .setTitle(`🚨・Shard ${shard.id + 1}/${manager.totalShards} exited with NULL error code!`)
                .setFields([
                    {
                        name: "PID",
                        value: `\`${process.pid}\``,
                    },
                    {
                        name: "Exit code",
                        value: `\`${process.exitCode}\``,
                    }
                ])
                .setColor('RED');

            webhook.send({
                username: 'JTDBot - Logs',
                embeds: [embed]
            });
        }
    });

    shard.on("shardDisconnect", (event) => {
        const embed = new Discord.EmbedBuilder()
            .setTitle(`🚨・Shard ${shard.id + 1}/${manager.totalShards} disconnected`)
            .setDescription("Dumping socket close event...")
            .setColor('ORANGE');

        webhook.send({
            username: 'JTDBot - Logs',
            embeds: [embed],
        });
    });

    shard.on("shardReconnecting", () => {
        const embed = new Discord.EmbedBuilder()
            .setTitle(`🚨・Reconnecting shard ${shard.id + 1}/${manager.totalShards}`)
            .setColor('YELLOW');

        webhook.send({
            username: 'JTDBot - Logs',
            embeds: [embed],
        });
    });
});

manager.spawn();

const webhook = new Discord.WebhookClient({
    id: webhookConfig.id,
    token: webhookConfig.token
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
    if (error) if (error.length > 950) error = error.slice(0, 950) + '... view console for details';
    if (error.stack) if (error.stack.length > 950) error.stack = error.stack.slice(0, 950) + '... view console for details';
    if (!error.stack) return;
    
    const embed = new Discord.EmbedBuilder()
        .setTitle(`🚨・Unhandled promise rejection`)
        .addFields([
            {
                name: "Error",
                value: error ? Discord.codeBlock(error) : "No error",
            },
            {
                name: "Stack error",
                value: error.stack ? Discord.codeBlock(error.stack) : "No stack error",
            }
        ]);

    webhook.send({
        username: 'JTDBot - Logs',
        embeds: [embed],
    }).catch(() => {
        console.log('Error sending unhandled promise rejection to webhook');
        console.log(error);
    });
});

process.on('warning', warn => {
    console.warn("Warning:", warn);
    const embed = new Discord.EmbedBuilder()
        .setTitle(`🚨・New warning found`)
        .addFields([
            {
                name: `Warn`,
                value: `\`\`\`${warn}\`\`\``,
            },
        ]);

    webhook.send({
        username: 'JTDBot - Logs',
        embeds: [embed],
    }).catch(() => {
        console.log('Error sending warning to webhook');
        console.log(warn);
    });
});
