const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require("./hiddenConfig.json");
const PREFIX = 'pr ';

bot.on('ready', () => {
    console.log("Bot is online!");
}); 

bot.login(config.token);