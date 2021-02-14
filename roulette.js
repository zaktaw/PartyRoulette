const utility = require('./utility.js');
const config = require('./hiddenConfig.json');

const CATEGORY_ID = config.categoryID;
let time = config.defaultTime; // how often the members will be assigned to new channels (time in milliseconds).
let minGroupSize = config.defaultMinGroupSize; // the preferred minimum number of members that will be assigned to each channel. 
let maxGroupSize = config.defaultMaxGroupSize; // the preferred maximum number of members that will be assigned to each channel.
let rouletteID = 0; // tracks how many roulettes that have been executed for logging purposes
let started = false; // a roulette has been started.


function startRoulette(msg) {
    if (started) return msg.channel.send("Party roulette has already been started. Stop the party roulette with command 'pr stop' before starting a new one.");
    executeRoulette(msg);
    changeChannelsInterval = setInterval(() => executeRoulette(msg), time);
    started = true;
    msg.channel.send("Party roulette has been started.")
}

function stopRoulette(msg) {
    if (!started) return msg.channel.send("Party roulette has not been started. Start a roulette with command 'pr start'.");
    clearInterval(changeChannelsInterval); 
    started = false;
    rouletteID = 0;
    msg.channel.send("Party roulette has been stopped.")
}

// get all members in the server. 
// Filter: ignore bots and only include users that are connected to a voice channel.
function getMembers(msg) {
    let members = msg.guild.members.cache.filter(member => !member.user.bot && member.voice.channel).array();
    return members;
}

// get all the channels in the server.
// Filter: only get voice channels in the specified category
function getChannels(msg) {
    let channels = msg.guild.channels.cache.filter(channel => channel.parentID == CATEGORY_ID && channel.type == 'voice').array();
    return channels;
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
    rouletteID++;
    console.log("\nRoulette " + rouletteID + ":");

    members = getMembers(msg);
    channels = getChannels(msg);
    membersShuffled = shuffleMembers(members);
    channelsShuffled = shuffleChannels(channels);

    let channelCounter = 0;
    let groupMemberCounter = 0;
    let groupSize = utility.genRandNum(minGroupSize, maxGroupSize); 
    let groups = [[channelsShuffled[channelCounter]]]; // 2D array of groups: first value in each array is always the voice channel for the group and the rest of values are the members

    console.log("\Group " + (channelCounter+1) + ", size: " + groupSize);

    // decide where to put members
    for (let i=0; i<membersShuffled.length; i++) {

        let channel = channelsShuffled[channelCounter];
        let member = membersShuffled[i];

        console.log("  Member: " + member.displayName + " => " + channel.name);

        groups[channelCounter][groupMemberCounter+1] = member;
        groupMemberCounter++;

        // prepare a new group when a group has been filled
        if (groupMemberCounter == groupSize) {
            channelCounter++;
            groups.push([channelsShuffled[channelCounter]]);
            groupSize = utility.genRandNum(minGroupSize, maxGroupSize); 
            groupMemberCounter = 0;
            if (channelCounter == channelsShuffled.length) channelCounter = 0; // go back to the first channel if there aren't any left

            console.log("Group " + (channelCounter+1) + ", size: " + groupSize);
        }
    }

    // check if the last group has too few members and if so move them to other groups
    // only do this if other groups exists
    let lastGroup = groups[groups.length-1];
    if (lastGroup.length-1 < minGroupSize && groups.length > 1) { // subtract 1 to not count the channel
 
        while (lastGroup.length > 1) {
            let member = lastGroup.pop(); // remove member from group
            
            // find the group with the fewest members to assign the members more evenly
            let smallestGroup = groups[0]; 
            for (let i=0; i<groups.length-1; i++) { // length-1 to not include the last group
                if (groups[i].length < smallestGroup.length) smallestGroup = groups[i];
            }

            console.log('Correction: ' + member.displayName + ' => ' + smallestGroup[0].name);
            smallestGroup.push(member); // add member to the smallest group
        }

        groups.pop(); // delete the last group
    }

    // Set voice channels
    for (let i=0; i<groups.length; i++) {
        for (let j=1; j<groups[i].length; j++) { // j=1 to only iterate through the members and not the channel
            let member = groups[i][j];
            let channel = groups[i][0];
            member.voice.setChannel(channel.id)
                .catch(err => console.log(err));
        }
    }
}

module.exports = {
    startRoulette,
    stopRoulette,
    getMembers,
    getChannels,
    shuffleMembers,
    shuffleChannels,
    executeRoulette
}