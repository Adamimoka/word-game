const wordList = new Set();
const commonWordList = new Set();

fetch('https://raw.githubusercontent.com/Adamimoka/word-game/refs/heads/main/words/words_alpha.txt')
    .then(response => response.text())
    .then(text => {
        const words = text.split('\n');
        words.forEach(word => wordList.add(word.trim()));
    })
    .catch(error => console.error('Error loading word list:', error));
fetch('https://raw.githubusercontent.com/Adamimoka/word-game/refs/heads/main/words/extra_words.txt')
    .then(response => response.text())
    .then(text => {
        const words = text.split('\n');
        words.forEach(word => wordList.add(word.trim()));
    })
    .catch(error => console.error('Error loading word list:', error));
fetch('https://raw.githubusercontent.com/Adamimoka/word-game/refs/heads/main/words/common_words.txt')
    .then(response => response.text())
    .then(text => {
        const words = text.split('\n');
        words.forEach(word => commonWordList.add(word.trim()));
    })
    .catch(error => console.error('Error loading word list:', error));

const usedWords = new Set([]);

let PromptList = []
PromptList = generatePromptList();
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
        if (problemMessage == '') {
            problemMessage = '-';
        }
        document.getElementById('problem').innerText = problemMessage;
        document.getElementById('problem').style.opacity = problemOpacity;
        document.getElementById('problem').style.color = problemColor;
    }
}, 20);

function generatePromptList() {
    let unRandomizedPromptList = [
        ['t','a','o','i','n','s','h','r','d','l'],
        ['th', 'he', 'in', 'er', 'an', 're', 'nd', 'on', 'en', 'at'],
        ['k', 'j', 'x', 'q', 'z', 'it', 'is', 'hi', 'es', 'ng'],
        ['ing', 'ent', 'ion', 'ter', 'ich', 'tion', 'ould', 'ight', 'ough', 'ment']];
    let PromptList;
    PromptList = getRandomElements(unRandomizedPromptList[0], 10);
    PromptList = PromptList.concat(getRandomElements(unRandomizedPromptList[1], 10));
    PromptList = PromptList.concat(getRandomElements(unRandomizedPromptList[2], 10));
    PromptList = PromptList.concat(getRandomElements(unRandomizedPromptList[3], 10));
    return PromptList;
}   

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
        problemOpacity = 2;
        problemColor = 'red';
        return;
    }

    if (!typedWord.includes(wordPrompt)) { // Incorrect prompt
        problemMessage = `'${typedWord}' does not have the prompt '${wordPrompt}'!`;
        problemOpacity = 2;
        problemColor = 'red';
        return;
    }

    if (typedWord.length < 3) { // Word too short
        problemMessage = `'${typedWord}' is too short! (3 letters minimum)`;
        problemOpacity = 2;
        problemColor = 'red';
        return;
    }
    
    if (usedWords.has(typedWord)) { // Word already used
        problemMessage = `'${typedWord}' has already been used!`;
        problemOpacity = 2;
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

    wordPrompt = PromptList[score % PromptList.length];
    document.getElementById('prompt').innerText = wordPrompt;
}

function updateTime() {
    timer = Math.max(Math.min(11 * .97 ** score, 10), 2);
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
    document.getElementById('gameOverText').innerText = '';

    document.getElementById("wordInput").setAttribute('maxlength', '99'); 

    playing = true;
}

function gameOver() {
    playing = false;
    document.getElementById("wordInput").blur();

    const potentialWords = (wordList.difference(commonWordList)).difference(usedWords);
    const potentialCommonWords = commonWordList.difference(usedWords);
    
    for (let word of potentialWords) {
        if (word.length < 3) {
            potentialWords.delete(word);
        }
        if (!word.includes(wordPrompt)) {
            potentialWords.delete(word);
        }
    }
    for (let word of potentialCommonWords) {
        if (word.length < 3) {
            potentialCommonWords.delete(word);
        }
        if (!word.startsWith(wordPrompt)) {
            potentialCommonWords.delete(word);
        }
    }
    
    let randomPotentialCommonWords = getRandomElements(potentialCommonWords, 3);
    let randomPotentialWords = getRandomElements(potentialWords, 3 - randomPotentialCommonWords.length);
    let randomFinalPotentialWords = randomPotentialCommonWords.concat(randomPotentialWords);

    document.getElementById('timer').innerText = 'Out of time';
    document.getElementById('gameOverText').innerText = `Game Over.\nYour score was ${score}.\nYou got out on the prompt '${wordPrompt}'.\nYou could have used: ${randomFinalPotentialWords.join(', ')}.\nSelect the textbox and press Enter to play again.`;

    document.getElementById("wordInput").setAttribute('maxlength', '0'); 
}

function getRandomElements(arr, numElements) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numElements);
}