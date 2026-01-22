// const charArr = ["a","b","c","d","e"];

// function createSentence() {
//     const wordArray = new Array(Math.round(Math.random()*51)+1);
//     for (let i = 0 ; i < wordArray.length ; i++) {
//         wordArray[i] = new Array(Math.round(Math.random()*51)+1);
//         for (let j = 0 ; j < wordArray[i].length ; j++) {
//             wordArray[i][j] = charArr[Math.floor(Math.random() * charArr.length)];
//         }
//         wordArray[i] = wordArray[i].join("");
//     }

//     return wordArray;
// }

// console.log(createSentence().join(" "));


const charArr = ["a","b","c","d","e"];

function createSentence() {
    const wordArray = new Array(Math.round(Math.random()*51)+1);
    for (let i = 0 ; i < wordArray.length ; i++) {
        let word = "";
        const wordLength = new Array(Math.round(Math.random()*51)+1);
        for (let j = 0 ; j < wordLength ; j++) {
            word += charArr[Math.floor(Math.random() * charArr.length)];
        }
        wordArray[i] = word;
        
    }

    return wordArray;
}

console.log(createSentence().join(" "));
