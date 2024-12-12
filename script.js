const wordList = new Set(['cat', 'dog', 'bird', 'fish', 'elephant', 'giraffe', 'zebra', 'lion', 'tiger', 'bear']); // testing for now, will open a massive file later
const commonWordList = new Set(['this file should contain a smaller number of common words, maybe the top 1000 most common english words']);
const usedWords = new Set([]);

let PromptList = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
let wordPrompt = '';

let problemMessage = '';
let problemOpacity = 0;
let problemColor = 'red';

let score = 0;
let timer = 10;
let playing = false;

window.onload = function() {
    document.getElementById("wordInput").focus();
}

setInterval(function() {
    if (playing) {
        timer -= 0.02;
        document.getElementById('timer').innerText = timer.toFixed(2);
        if (timer <= 0) {
            gameOver();
        }
        problemOpacity = Math.max(problemOpacity - 0.02, 0);
        document.getElementById('problem').innerText = problemMessage;
        document.getElementById('problem').style.opacity = problemOpacity;
        document.getElementById('problem').style.color = problemColor;
    }
}, 20);

function checkWord() {
    if (!playing) {
        startGame();
        return;
    }
    typedWord = document.getElementById('wordInput').value;
    typedWord = typedWord.toLowerCase();
    typedWord = typedWord.replace(/[^a-z]/g, ''); // Remove all non-alphabet characters

    if (!wordList.has(typedWord)) { // Not a real word
        problemMessage = `'${typedWord}' is not a word!`;
        problemOpacity = 1;
        problemColor = 'red';
        return;
    }

    if (!typedWord.includes(wordPrompt)) { // Incorrect prompt
        problemMessage = `'${typedWord}' does not have the prompt '${wordPrompt}'!`;
        problemOpacity = 1;
        problemColor = 'red';
        return;
    }

    if (usedWords.has(typedWord)) { // Word already used
        problemMessage = `'${typedWord}' has already been used!`;
        problemOpacity = 1;
        problemColor = 'red';
        return;
    }

    scorePoint();
}

function scorePoint() {
    score++;
    updateTime();
    usedWords.add(typedWord);

    document.getElementById('score').innerText = score;
    document.getElementById('timer').innerText = timer.toFixed(2);
    document.getElementById('wordInput').value = '';

    let promptIndex = Math.floor(Math.random() * PromptList.length);
    wordPrompt = PromptList[promptIndex];
    document.getElementById('prompt').innerText = wordPrompt;
}

function updateTime() {
    timer = Math.max(10.5 * 0.94 ** score, 0.5);
}

function startGame() {
    usedWords.clear();

    wordPrompt = 'e';

    score = 0;
    timer = 10;
    playing = true;

    document.getElementById('score').innerText = score;
    document.getElementById('timer').innerText = timer.toFixed(2);
    document.getElementById('prompt').innerText = wordPrompt;
    document.getElementById('wordInput').value = '';
    
    playing = true;
}

function gameOver() {
    playing = false;
    const potentialWords = (wordList.difference(commonWordList)).difference(usedWords);
    const potentialCommonWords = commonWordList.difference(usedWords);
    
    function getRandomElements(arr, numElements) {
        const shuffled = [...arr].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, numElements);
      }
    
    let randomPotentialCommonWords = getRandomElements(potentialCommonWords, 3);
    let randomPotentialWords = getRandomElements(potentialWords, 3 - randomPotentialCommonWords.length);
    let randomFinalPotentialWords = randomPotentialCommonWords.concat(randomPotentialWords);

    document.getElementById('timer').innerText = 'Out of time';
    document.getElementById('gameOverText').innerText = `Game Over.\nYour score was ${score}.\nYou got out on the prompt '${wordPrompt}'.\nYou could have used: ${randomFinalPotentialWords.join(', ')}.\nPress Enter to play again.`;
}

