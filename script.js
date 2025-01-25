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

let onHowToPlay = false;

let PromptList = []
PromptList = generatePromptList();
let wordPrompt = '';

let problemMessage = 'Out of Time!';
let problemOpacity = 0;
let problemColor = 'red';

let score = 0;
let wordCount = 0;
let timer = 10;
let playing = false;

let timerContext;

window.onload = function() {
    document.getElementById("wordInput").focus();
}

setInterval(function() {
    if (playing) {
        timer -= 0.02;
        document.getElementById('timerText').innerText = timer.toFixed(2);

        if (timer <= 0) {
            gameOver();
        }
        else {
            problemOpacity = Math.max(problemOpacity - 0.02, 0);
            document.getElementById('problem').innerText = problemMessage;
            document.getElementById('problem').style.opacity = problemOpacity;
            document.getElementById('problem').style.color = problemColor;

            const redValue = timer <= 2.4 ? Math.min(255, Math.floor((3 - timer) * 85)) : 51;
            document.getElementById('timerText').style.color = `rgb(${redValue}, 51, 51)`;
        }
    }
}, 20);

function generatePromptList() {
    let unRandomizedPromptList = [
        ['t','a','o','i','n','s','h','r','d','l'],
        ['th', 'he', 'in', 'er', 'an', 're', 'nd', 'on', 'en', 'at'],
        ['k', 'j', 'x', 'q', 'z', 'it', 'is', 'hi', 'es', 'ng'],
        ['ing', 'ent', 'ion', 'ter', 'ich', 'tion', 'ould', 'ight', 'ough', 'ment']];
    let PromptList;
    PromptList = getRandomElements(unRandomizedPromptList[0], 10, null);
    PromptList = PromptList.concat(getRandomElements(unRandomizedPromptList[1], 10, null));
    PromptList = PromptList.concat(getRandomElements(unRandomizedPromptList[2], 10, null));
    PromptList = PromptList.concat(getRandomElements(unRandomizedPromptList[3], 10, null));
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

    problemMessage = 'Out of Time!';
    problemOpacity = 0;

    scorePoint();
}

function startGameButton() {
    if (!playing) {
        document.getElementById('PregameContainer').style.display = 'none';
        document.getElementById('gameContainer').style.display = 'block';
        startGame();
        return;
    }
}

function toggleHowToPlay() {
    onHowToPlay = !onHowToPlay;
    if (onHowToPlay) {
        document.getElementById('PregameContainer').style.display = 'none';
        document.getElementById('howToPlayContainer').style.display = 'block';
    } else {
        document.getElementById('PregameContainer').style.display = 'block';
        document.getElementById('howToPlayContainer').style.display = 'none';
    }
}

function scorePoint() {
    score += typedWord.length;
    wordCount++;
    updateTime();
    usedWords.add(typedWord);

    document.getElementById('score').innerText = score;
    document.getElementById('timerText').innerText = timer.toFixed(2);
    document.getElementById('wordInput').value = '';

    wordPrompt = PromptList[wordCount % PromptList.length];
    document.getElementById('prompt').innerText = wordPrompt;
}

function updateTime() {
    timer = Math.max(Math.min(11 * .97 ** wordCount, 10), 1);
}

function startGame() {
    usedWords.clear();
    
    wordPrompt = 'e';

    score = 0;
    wordCount = 0;
    timer = 10;
    playing = true;

    document.getElementById('score').innerText = score;
    document.getElementById('timerText').innerText = timer.toFixed(2);
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
    
    let randomPotentialCommonWords = getRandomElements(potentialCommonWords, 5, ['<u>', '</u>']);
    let randomPotentialWords = getRandomElements(potentialWords, 5 - randomPotentialCommonWords.length, ['<u>', '</u>']);
    let randomFinalPotentialWords = randomPotentialCommonWords.concat(randomPotentialWords);

    document.getElementById('timerText').innerText = '0.00';
    document.getElementById('gameOverText').innerHTML = `<p>Game Over.<br><br>You could have used: ${randomFinalPotentialWords.join(', ')}.<br><br>Select the textbox and press Enter to play again.</p>`;

    document.getElementById("wordInput").setAttribute('maxlength', '0'); 

    document.getElementById('problem').style.opacity = 1;
}

function getRandomElements(arr, numElements, surroundWith) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    elements = shuffled.slice(0, numElements);
    if (surroundWith) {
        elements = elements.map(element => surroundWith[0] + element + surroundWith[1]);
    }
    return elements;
}