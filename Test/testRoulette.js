const utility = require('../utility.js')
const roulette = require('../roulette.js')

let numberOfParticipants = 7 // number of participants in the event
let numberOfChannels = 100 // number of available channels in the server
let minGroupSize = 3 // the minimum number of people that can be in a group
let maxGroupSize = 5 // the maximum number of people that can be in a group

let participants = genParticipants(numberOfParticipants)
let channels = genChannels(numberOfChannels)
let participantsShuffled = shuffleParticipants(participants)
let channelsShuffled = shuffleChannels(channels)
let numberOfGroups = genOptimalGroups(participantsShuffled.length, minGroupSize, maxGroupSize);
let groups = makeGroups(numberOfGroups, participantsShuffled, channelsShuffled);
displayGroups(groups)

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

// function shuffleChannels(channels) {
//     let channelsShuffled = [];

//     while (channels.length > 0) {
//         let randNum = utility.genRandNum(0,channels.length-1); // get a random channel from non-shuffled array
//         channelsShuffled.push(channels[randNum]); // add channel to the shuffled array
//         channels.splice(randNum, 1); // remove channel from non-shuffled array
//     }

//     return channelsShuffled;
// }

// function shuffleParticipants(members) {
//     let membersShuffled = [];

//     while (members.length > 0) {
//         let randNum = utility.genRandNum(0,members.length-1); // get a random member from non-shuffled array
//         membersShuffled.push(members[randNum]); // add member to the shuffled array
//         members.splice(randNum, 1); // remove member from non-shuffled array
//     }

//     return membersShuffled;
// }

//Generate the optimal amount of groups based on participants
function genOptimalGroups(participants, minGroupSize, maxGroupSize) {
	let minGroups = Math.ceil(participants/maxGroupSize)
	let maxGroups = Math.floor(participants/minGroupSize)
	let difference = maxGroups - minGroups
	
	let optimalGroups = minGroups + Math.ceil(difference/2)
	
	console.log("Number of groups: " + optimalGroups)
	return optimalGroups;
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

function displayGroups(groups) {
	groups.forEach(group => {
		group.forEach(item => console.log(item))
		console.log("")
	})
}