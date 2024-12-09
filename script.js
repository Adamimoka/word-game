wordList = ['cat', 'dog', 'bird', 'fish', 'elephant', 'giraffe', 'zebra', 'lion', 'tiger', 'bear'];
let usedWords = [];

let word = "";

document.addEventListener('keydown', function(event) {
    keyPressed(event.key);
});

function keyPressed(letter) {
  //  word
    if (letter.length === 1 && letter.match(/[a-z]/i)) {
        word += letter;
    }
    else if (letter == "Backspace") {
        word = word.slice(0, -1);
    }
    else if (letter === "Enter" || letter === " ") {
        console.log('Word:', word);
        word = "";
    }
    else {
        console.log('Invalid key:', letter);
    }
    document.getElementById('word').innerText = word;
}

function checkWord() {
    if (wordList.includes(word)) {
        usedWords.push(word);

        
    }
}