const Discord = require('discord.js');
const config = require('./hiddenConfig.json');
const utility = require('./utility.js');
const bot = new Discord.Client();

const PREFIX = 'pr ';
const TIME = 10000 // how often the members will be assigned to new channels (time in milliseconds)
const CATEGORY_ID = '798244656974004226'

let started = false; // a roulette has been started

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
            msg.channel.send("This bot is working.");
            break;

        case 'start' :
            startRoulette(msg);
            break;

        case 'stop' :
            stopRoulette(msg);
            break;

        default :
            msg.channel.send(`"${args[0]}" is an invalid command.`);

    }   
});

function startRoulette(msg) {
    if (started) return msg.channel.send("Party roulette has already been started. Stop the party roulette with command 'pr stop' before starting a new one.");
    executeRoulette(msg);
    changeChannelsInterval = setInterval(() => executeRoulette(msg), TIME);
    started = true;
    msg.channel.send("Party roulette has been started.")
}

function stopRoulette(msg) {
    if (!started) return msg.channel.send("Party roulette has not been started. Start a roulette with command 'pr start'.");
    clearInterval(changeChannelsInterval); 
    started = false;
    msg.channel.send("Party roulette has been stopped.")
}

// get all members in the server. 
// Filter: ignore bots and members that aren't connected to a voice channel.
function getMembers(msg) {
    let members = msg.guild.members.filter(member => !member.user.bot && member.voiceChannel); 
    return members.array();
}

// get all the channels in the server.
// Filter: only get voice channels in the specified category
function getChannels(msg) {
    let channels = msg.guild.channels.filter(channel => channel.parentID == CATEGORY_ID && channel.type == 'voice');
    return channels.array();
}

function shuffleMembers(members) {
    let membersShuffled = [];

    while (members.length > 0) {
        let randNum = utility.genRandNum(0,members.length-1); // get a random member from non-shuffled array
        membersShuffled.push(members[randNum]); // add member to the shuffled array
        members.splice(randNum, 1); // remove member from non-shuffled array
    }

    return membersShuffled;
}

function shuffleChannels(channels) {
    let channelsShuffled = [];

    while (channels.length > 0) {
        let randNum = utility.genRandNum(0,channels.length-1); // get a random channel from non-shuffled array
        channelsShuffled.push(channels[randNum]); // add channel to the shuffled array
        channels.splice(randNum, 1); // remove channel from non-shuffled array
    }

    return channelsShuffled;
}

function executeRoulette(msg) {
    console.log("\nExecute roulette")

    members = getMembers(msg);
    channels = getChannels(msg);
    membersShuffled = shuffleMembers(members);
    channelsShuffled = shuffleChannels(channels);

    let channelCounter = 0;

    // assign members to channels
    for (let member of membersShuffled) {

        let channel = channelsShuffled[channelCounter];

        console.log("Assigning member: " + member.displayName + " to channel: " + channel.name);

        member.setVoiceChannel(channel.id)
            .catch(err => console.log(err));
        channelCounter++;
    }
}
