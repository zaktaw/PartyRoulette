const utility = require('../utility.js')
const roulette = require('../roulette.js')

let numberOfParticipants = 100 // number of participants in the event
let numberOfChannels = 30 // number of available channels in the server
let minGroupSize = 3 // the minimum number of people that can be in a group
let maxGroupSize = 5 // the maximum number of people that can be in a group

executeRoulette();

// generate test participants
function genParticipants(numberOfParticipants) {

	let participants = Array()

	for (let i=0; i<numberOfParticipants; i++) {
		let participant = `Participant ${i+1}`
		participants.push(participant)
	}		

	return participants
}

// generate test channels
function genChannels(numberOfChannels) {

	let channels = Array()

	for (let i=0; i<numberOfChannels; i++) {
		let channel = `Channel ${i+1}`
		channels.push(channel)
	}		

	return channels
}

function makeGroups(numberOfGroups, participants, channels) {

	let groups = Array()

	// fill every group with the minimum number of participants
	for (let i=0; i<numberOfGroups; i++) {

		let group = [channels[i]] // initialize a group with an array containing the group's voice channel
		groups.push(group)

		// add participants to groups
		for (let j=0; j<minGroupSize; j++) { 
			let participant = participants.pop()
			groups[i][j+1] = participant // j+1 since first item is reserved for the voice channel
		}
		
	}

	// place the rest of the particpants in random groups that are not full
	while (participants.length > 0) {
		let participant = participants.pop()
		
		// get a random group that isn't full
		let group = groups[utility.genRandNum(0, groups.length-1)]
		while (group.length - 1 >= maxGroupSize) { 
			group = groups[utility.genRandNum(0, groups.length-1)] 
		}

		group.push(participant)
	}

	return groups;
}

function executeRoulette(msg) {

    // rouletteID++;
    // console.log("\nRoulette " + rouletteID + ":");

    let members = genParticipants(numberOfParticipants);
    let channels = genChannels(numberOfChannels);
    let membersShuffled = roulette.shuffleMembers(members);
    let channelsShuffled = roulette.shuffleChannels(channels);
    let numberOfGroups = roulette.genOptimalGroups(membersShuffled.length)

    let groups = makeGroups(numberOfGroups, membersShuffled, channelsShuffled);
    // groups = makeCorrections(groups);
   

    setVoiceChannels(groups);
}

function setVoiceChannels(groups) {
    for (let i=0; i<groups.length; i++) {
        let channel = groups[i][0];
        console.log(`\nGroup: ${channel}`)
        for (let j=1; j<groups[i].length; j++) { // j=1 to only iterate through the members and not the channel
            let member = groups[i][j];
            console.log(`Member: ${member}`)
            // member.voice.setChannel(channel.id)
        }

    }
}