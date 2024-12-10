let wordList = ['cat', 'dog', 'bird', 'fish', 'elephant', 'giraffe', 'zebra', 'lion', 'tiger', 'bear']; // testing for now, will open a massive file later
let usedWords = [];
let PromptList = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
let wordPrompt = '';

let typedWord = '';
let score = 0;
let timeToGuess = 10;
let wordsLeftWithThisTimeAmount = 5; // Counts down the number of words left until the time amount is reduced
let timer = 10;
let playing = false;

setInterval(function() {
    if (playing) {
        timer -= 0.02;
        document.getElementById('timer').innerText = timer.toFixed(2);
        if (timer <= 0) {
            gameOver();
        }
    }
}, 20);

document.addEventListener('keydown', function(event) {
    if (playing) {
        typeWord(event.key);
    }
    else if (event.key === 'Enter') {
        startGame();
    }
});

function typeWord(letter) {
    if (letter.length === 1 && letter.match(/[a-z]/i)) {
        typedWord += letter;
    }
    else if (letter == 'Backspace') {
        typedWord = typedWord.slice(0, -1);
    }
    else if (letter === 'Enter' || letter === ' ') {
        console.log('Word:', typedWord);
        checkWord();
    }
    else {
        console.log('Invalid key:', letter);
    }
    document.getElementById('typedWord').innerText = typedWord;
}

function checkWord() {
    if (wordList.includes(typedWord) && !usedWords.includes(typedWord)) { // Available typedWord
        usedWords.push(typedWord);
        score++;
        document.getElementById('score').innerText = score;
        updateTime();
        promptIndex = Math.floor(Math.random() * PromptList.length);
        wordPrompt = PromptList[promptIndex];
        
    }
    else if (usedWords.includes(typedWord)) { // Already used typedWord
        alert('You already used that word!');
    }
    else { // Incorrect typedWord
        alert('That is not a word!');
    }
}

function updateTime() {
    if (wordsLeftWithThisTimeAmount > 0) {
        wordsLeftWithThisTimeAmount--;
    }
    else {
        if (timeToGuess > 4) {
            timeToGuess--;
        }
        else if (timeToGuess > 2) {
            timeToGuess -= 0.5;
        }
        else if (timeToGuess > 1) {
            timeToGuess -= 0.2;
        }
        else if (timeToGuess > 0.5) {
            timeToGuess -= 0.1;
        }
        // else {
        //     timeToGuess = 0.5;
        // }
        wordsLeftWithThisTimeAmount = 5;
    }
    timer = timeToGuess;
}

function startGame() {
    usedWords = [];
    typedWord = '';
    wordPrompt = 'e';
    score = 0;
    timeToGuess = 10;
    wordsLeftWithThisTimeAmount = 5;
    timer = 10;

    document.getElementById('typedWord').innerText = typedWord;
    document.getElementById('score').innerText = score;
    document.getElementById('timer').innerText = timer;
    
    playing = true;
}

function gameOver() {
    playing = false;
    console.log('Game Over');
    let potentialWords = wordList.filter(word => !usedWords.includes(word)); // <-- verify this works
    
    function getRandomElements(arr, numElements) {
        const shuffled = [...arr].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, numElements);
      }
    
    let randomPotentialWords = getRandomElements(potentialWords, 3);

    document.getElementById('gameOverText').innerText = `Game Over. Your score was ${score}. You got out on the prompt: ${typedWord}. You could have used: ${randomPotentialWords.join(', ')}. Press Enter to play again.`;
}