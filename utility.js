//Generate a random number between lower bound and upper bound (including lower and upper bound)
function genRandNum(lowerBound, upperBound) {
    return Math.floor(Math.random() * (upperBound - lowerBound + 1)) + lowerBound;
}

module.exports = {
    genRandNum
}