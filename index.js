const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require("./hiddenConfig.json");
const PREFIX = 'pr ';

bot.on('ready', () => {
    console.log("Bot is online!");
}); 

bot.login(config.token);

bot.on('message', (msg) => {
    
    let args = msg.content.substring(PREFIX.length).split(" ");

    // Prevent spam from bot
    if (msg.author.bot) return; // stops bot from replying to itself
    if (!msg.guild) return; // bot will only reply if message is sent in the guild (server)
    if (!msg.content.startsWith(PREFIX)) return; // bot will only reply if the message starts with the specified prefix

    // Only admins can use the bot
    if (!msg.member.hasPermission('ADMINISTRATOR')) {
        msg.channel.send("You have to be an administrator to use this bot");
        return;
    }

    // Handle arguments given
    switch (args[0].toLowerCase()) {

        case 'test' :
            msg.channel.send("This bot is working");
            break;

        default :
            msg.channel.send(`"${args[0]}" is an invalid command`);

    }   
});