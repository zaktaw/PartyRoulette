const Discord = require('discord.js');
const config = require('./hiddenConfig.json');

const bot = new Discord.Client();
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

        case 'start' :
            changeChannelsInterval = setInterval(() => changeChannels(msg), 5000);
            break;

        default :
            msg.channel.send(`"${args[0]}" is an invalid command`);

    }   
});

function getMembers(msg) {
    let members = msg.guild.members.filter(member => !member.user.bot && member.voiceChannel); // get all members in the server. Filter: ignore bots and members that aren't connected to a voice channel
    return members;
}

function changeChannels(msg) {
    console.log("Changing channels...")
    members = getMembers(msg);
    for (let [snowflake, guildMember] of members) {
        guildMember.setVoiceChannel('809803149266255902');
    }
}