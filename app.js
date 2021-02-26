import {gameRequest, requestLeaderboard} from "./fetch.js";

let result_p = document.getElementById('result');
let computer_p = document.getElementById('computerChoice');
let gameMode = 'lokal';
let playerScore = 0;
let leaderBoard = {};
let keyArray = [];
let playerName = '';
const backToRanking = document.getElementById('backToRanking');
const startButton = document.getElementById('startButton');
const switchMode = document.getElementById('changeMode');
let historyTable = document.getElementsByClassName('historyTable')[0];
let historyTableText = document.getElementById('historyTable');
let leaderBoardTable = document.getElementsByClassName('leaderBoard')[0];
let leaderBoardText = document.getElementById("leaderBoard");
let pageOne = document.querySelector('.one');
let pageTwo = document.querySelector('.two');
let nameOutput = document.getElementById('action');
let changeModeText = document.getElementById('changeMode');
let computerChoice = document.getElementById('computerChoice');
let updateServerHistoryTable = document.getElementsByClassName('historyTable')[0];
let resultText = document.getElementById('result');
let onlineLeaderBoardText = document.getElementById('leaderBoard');
let onlineLeaderBoardTable = document.getElementsByClassName('leaderBoard')[0];
let playerChoice = '';
let optionsDiv = document.getElementById('choices');



function getComputerChoice() {
    const choices = ['Schere', 'Stein', 'Papier', 'Brunnen', 'Streichholz'];
    const randomNumber = Math.floor(Math.random() * 5);
    return choices[randomNumber];
}


function win(userChoice, computerChoice) {
    computer_p.innerHTML = 'Compuer wählt: ' + computerChoice;
    result_p.innerHTML = 'Gewonnen';
    playerScore++;
}


function lose(userChoice, computerChoice) {
    computer_p.innerHTML = 'Compuer wählt: ' + computerChoice;
    result_p.innerHTML = 'Verloren';
}


function draw(userChoice, computerChoice) {
    computer_p.innerHTML = 'Compuer wählt: ' + computerChoice;
    result_p.innerHTML = 'Unentschieden';
}


function updateHistory(user, computer) {
    let newRow = historyTable.insertRow(0);

    let cell1 = newRow.insertCell(0);
    let cell2 = newRow.insertCell(1);
    let cell3 = newRow.insertCell(2);

    cell1.innerHTML = result_p.innerHTML;
    cell2.innerHTML = user;
    cell3.innerHTML = computer;
}


function resultLookup(playerChoice, computerChoice) {
    let lookup = {
        //Stein
        "SteinStein" : "Unentschieden",
        "SteinSchere" : "Gewonnen",
        "SteinPapier" : "Verloren",
        "SteinBrunnen" : "Verloren",
        "SteinStreichholz" : "Gewonnen",
        //Schere
        "SchereStein" : "Verloren",
        "SchereSchere" : "Unentschieden",
        "ScherePapier" : "Gewonnen",
        "SchereBrunnen" : "Verloren",
        "SchereStreichholz" : "Gewonnen",
        //Papier
        "PapierStein" : "Gewonnen",
        "PapierSchere" : "Verloren",
        "PapierPapier" : "Unentschieden",
        "PapierBrunnen" : "Gewonnen",
        "PapierStreichholz" : "Verloren",
        //Brunnen
        "BrunnenStein" : "Gewonnen",
        "BrunnenSchere" : "Gewonnen",
        "BrunnenPapier" : "Verloren",
        "BrunnenBrunnen" : "Unentschieden",
        "BrunnenStreichholz" : "Verloren",
        //Streichholz
        "StreichholzStein" : "Verloren",
        "StreichholzSchere" : "Verloren",
        "StreichholzPapier" : "Gewonnen",
        "StreichholzBrunnen" : "Gewonnen",
        "StreichholzStreichholz" : "Unentschieden"
    };

  //  playerChoice = userChoice;
    if (gameMode === 'server') {
        startServerMatch(playerName, playerChoice);
        timer();
    } else {
        if (lookup[playerChoice + computerChoice] === "Gewonnen") {
            win(playerChoice, computerChoice);
            timer();
            updateHistory(playerChoice, computerChoice);
        } else if (lookup[playerChoice + computerChoice] === "Verloren") {
            lose(playerChoice, computerChoice);
            timer();
            updateHistory(playerChoice, computerChoice);
        } else {
            draw(playerChoice, computerChoice);
            timer();
            updateHistory(playerChoice, computerChoice);
        }
    }
}


function timer() {
    document.getElementById('schere').disabled = true;
    document.getElementById('stein').disabled = true;
    document.getElementById('papier').disabled = true;
    document.getElementById('brunnen').disabled = true;
    document.getElementById('streichholz').disabled = true;

    document.getElementById('timerCountdown').innerHTML = 'Bitte 3 sek warten!';
    setTimeout(function () {
        document.getElementById('timerCountdown').innerHTML = 'Bitte 2 sek warten!'
    },1000);
    setTimeout(function () {
        document.getElementById('timerCountdown').innerHTML = 'Bitte 1 sek warten!'
    },2000);
    setTimeout(function () {
        document.getElementById('timerCountdown').innerHTML = 'Bereit'
    },3000);

    setTimeout(function () {
        computer_p.innerHTML = 'Computer';
        document.getElementById('schere').disabled = false;
        document.getElementById('stein').disabled = false;
        document.getElementById('papier').disabled = false;
        document.getElementById('brunnen').disabled = false;
        document.getElementById('streichholz').disabled = false;
    }, 3000);
}


function updateLeaderBoard() {
    if (leaderBoard[playerName] === undefined) {
        leaderBoard[playerName] = playerScore;
        keyArray.push(playerName);
    } else {
        if (leaderBoard[playerName] < playerScore) {
            leaderBoard[playerName] = playerScore;
        }
    }
}


function sortingLeaderBoard() {
    leaderBoardText.innerHTML = '';
    keyArray.sort(compare);

    let max = 10;
    let rank = 0;
    let lastScore = 50000;
    let bufferScore = 0;

    if (max > keyArray.length) {
        max = keyArray.length;
    }

    for (let i=0; i < max; i++) {
        if (lastScore === leaderBoard[keyArray[i]]) {
            bufferScore++;
        } else {
            if (bufferScore === 0) {
                lastScore = leaderBoard[keyArray[i]];
                bufferScore = 0;
                rank++;
            } else {
                lastScore = leaderBoard[keyArray[i]];
                rank = rank + bufferScore + 1;
                bufferScore = 0;
            }
        }

        let newRow = leaderBoardTable.insertRow(-1);

        let cell1 = newRow.insertCell(0);
        let cell2 = newRow.insertCell(1);
        let cell3 = newRow.insertCell(2);

        cell1.innerHTML = rank.toString();
        cell2.innerHTML = keyArray[i];
        cell3.innerHTML = leaderBoard[keyArray[i]];
    }

    let newRow = leaderBoardTable.insertRow(0);

    let cell1 = newRow.insertCell(0);
    let cell2 = newRow.insertCell(1);
    let cell3 = newRow.insertCell(2);

    cell1.innerHTML = "Rang";
    cell2.innerHTML = "Name";
    cell3.innerHTML = "Siege";
}


function compare(a, b) {
    let scoreA = leaderBoard[a];
    let scoreB = leaderBoard[b];
    return scoreB - scoreA;
}


function startServerMatch(playerName, userChoice) {
    gameRequest(playerName, userChoice, result => {
        computerChoice.innerHTML = result['choice'];

        let currentResult;

        let newRow = updateServerHistoryTable.insertRow(0);

        let cell1 = newRow.insertCell(0);
        let cell2 = newRow.insertCell(1);
        let cell3 = newRow.insertCell(2);

        if (result['win'] === undefined) {
            currentResult = 'Unentschieden'
        } else if (result['win']) {
            currentResult = 'Gewonnen';
        } else {
            currentResult = 'Verloren';
        }

        cell1.innerHTML = currentResult;
        cell2.innerHTML = playerChoice;
        cell3.innerHTML = result['choice'];

        resultText.innerHTML = currentResult;

    });


}


function onlineLeaderBoard() {
    requestLeaderboard(dataStructure => {
            let i = 0;
            let rankingArray = [];
            let rank = 0;
            let lastScore = 50000;
            let bufferScore = 0;

            let max = 10;



            for (let c in dataStructure) {
                let userData = dataStructure[Object.keys(dataStructure)[i]];

                rankingArray.push(userData['user']);

                i++;
            }

            if (max > i) {
                max = i;
            }

            rankingArray.sort(function (a, b) {
                return dataStructure[b]['win'] - dataStructure[a]['win'];
            });

            onlineLeaderBoardText.innerHTML = '';

            for (let i = 0; i < max; i++) {
                let userData = dataStructure[rankingArray[i]];

                if (lastScore === userData['win']) {
                    bufferScore++;
                } else {
                    if (bufferScore === 0) {
                        lastScore = userData['win'];
                        bufferScore = 0;
                        rank++;
                    } else {
                        lastScore = userData['win'];
                        rank = rank + bufferScore + 1;
                        bufferScore = 0;
                    }
                }

                let newRow = onlineLeaderBoardTable.insertRow(-1);

                let cell1 = newRow.insertCell(0);
                let cell2 = newRow.insertCell(1);
                let cell3 = newRow.insertCell(2);

                cell1.innerHTML = rank.toString();
                cell2.innerHTML = userData['user'];
                cell3.innerHTML = userData['win'];
            }
        })
}


startButton.addEventListener('click', () => {
        pageOne.classList.add('fadeOut');
        pageTwo.classList.add('fadeIn');
        playerName = document.getElementById('playerName').value;
        nameOutput.innerHTML = playerName + ', wähle deine Hand!';
    });


backToRanking.addEventListener('click', () => {
        pageOne.classList.remove('fadeOut');
        pageTwo.classList.remove('fadeIn');
        historyTableText.innerHTML = ' ';

        if (gameMode === 'lokal') {
            updateLeaderBoard();
            sortingLeaderBoard();

            playerScore = 0;
        } else if (gameMode === 'server') {
            onlineLeaderBoard();
        }
    });


switchMode.addEventListener('click', () => {
        if (gameMode === 'lokal') {
            changeModeText.innerHTML = 'Wechsel zu Lokal';
            gameMode = 'server';
            onlineLeaderBoard();
        } else {
            changeModeText.innerHTML = 'Wechsel zu Server';
            gameMode = 'lokal';
            sortingLeaderBoard();
        }
    });


optionsDiv.addEventListener('click', function (event) {
    if (event.target.classList.contains('schere')) {
        playerChoice = 'Schere';
    } else if (event.target.classList.contains('stein')) {
        playerChoice = 'Stein';
    } else if (event.target.classList.contains('papier')) {
        playerChoice = 'Papier';
    } else if (event.target.classList.contains('brunnen')) {
        playerChoice = 'Brunnen';
    } else if (event.target.classList.contains('streichholz')) {
        playerChoice = 'Streichholz'
    }
    resultLookup(playerChoice, getComputerChoice());
})















