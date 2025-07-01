// Max Cohn
const A_ASCII = 65;
const LAST_ASCII = A_ASCII + 26;

const quantities = {
    'A' : 9, 'B' : 2,
    'C' : 2, 'D' : 4,
    'E' : 12, 'F' : 2,
    'G' : 3, 'H' : 2,
    'I' : 9, 'J' : 1,
    'K' : 1, 'L' : 4,
    'M' : 2, 'N' : 6,
    'O' : 8, 'P' : 2,
    'Q' : 1, 'R' : 6,
    'S' : 4, 'T' : 6,
    'U' : 4, 'V' : 2,
    'W' : 2, 'X' : 1,
    'Y' : 2, 'Z' : 1,
    ' ' : 2,
}
let letterBag = [];
// Fill the letter bag
for (let currentLetter = A_ASCII; currentLetter < LAST_ASCII; currentLetter++) {
    const numOfThatLetter = quantities[String.fromCharCode(currentLetter)];
    for (let i = 0; i < numOfThatLetter; i++)
        letterBag.push(String.fromCharCode(currentLetter));
}
// add the blanks to the bag
for (let i = 0; i < quantities[' ']; i++) {
    letterBag.push(' ');
}

function main() {
    let hand = newHand();
    console.log('Your hand is ' + hand);
}

function pickNewLetter() {
    const indexOfLetter = Math.floor(Math.random() * letterBag.length);
    const letter = letterBag[indexOfLetter];
    letterBag.splice(indexOfLetter, 1);
    
    return letter;
}

function newHand() {
    let hand = [];
    for (let i = 0; i < 7; i++)
        hand.push(pickNewLetter());
    return hand;
}

main();
