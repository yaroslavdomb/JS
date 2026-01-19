const possibleWinStates = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], //horizontal
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], //vertical
    [0, 4, 8],
    [2, 4, 6], //diagonals
];

const BOARD_SIZE = 9;
const playerScoreMap = new Map();
let isFirstPlayerTurn = true;
let winCombination = [];
let winnerData = {};
let gameStarted = false;
let p1Name = "";
let p2Name = "";
let p1Sign = "";
let p2Sign = "";

const grid = document.querySelector(".playBoard");
grid.addEventListener("click", function (event) {
    if (!gameStarted) {
        gameStarted = true;
    }

    if (winCombination.length !== 0 || event.target.innerText !== "") {
        return;
    }

    const possibleWinSign = isFirstPlayerTurn ? p1Sign : p2Sign;
    event.target.innerText = possibleWinSign;
    event.target.classList.add(isFirstPlayerTurn ? "takenByO" : "takenByX");

    if (isGameFinishedDueToWin(possibleWinSign)) {
        populateWinnerData();
        markWinCombination();
        showWinMessage();
        updateWinnerScore();
        if (isScoreVisible) {
            refreshScoreTable();
        }
    } else if (!isAnyEmptyCellOnGameboard()) {
        updateDrawScore();
        showDrawMessage();
        if (isScoreVisible) {
            refreshScoreTable();
        }
    }

    isFirstPlayerTurn = !isFirstPlayerTurn;
});

for (let i = 0; i < BOARD_SIZE; i++) {
    const divElement = document.createElement("div");
    divElement.className = "cell";
    grid.appendChild(divElement);
}

function isGameFinishedDueToWin(possibleWinSign) {
    const allCellsArr = document.querySelectorAll(".cell");
    for (const currentState of possibleWinStates) {
        if (currentState.every((i) => allCellsArr[i].innerText === possibleWinSign)) {
            winCombination = currentState;
            return true;
        }
    }
    return false;
}

function populateWinnerData() {
    if (isFirstPlayerTurn) {
        winnerData.name = p1Name;
        winnerData.sign = p1Sign;
    } else {
        winnerData.name = p2Name;
        winnerData.sign = p2Sign;
    }
}

//no empty space to set a new values
function isAnyEmptyCellOnGameboard() {
    const allCells = document.querySelectorAll(".cell");
    for (let i = 0; i < allCells.length; i++) {
        if (allCells[i].innerText === "") {
            return true;
        }
    }

    return false;
}

function showDrawMessage() {
    setTimeout(() => {
        alert("Friendship WON!!!");
    }, 0);
}

function markWinCombination() {
    const allCellsArr = document.querySelectorAll(".cell");
    winCombination.forEach((i) => {
        allCellsArr[i].classList.add("winner");
    });
}

const clearBoardBtn = document.getElementById("clearBoardBtn");
clearBoardBtn.addEventListener("click", function () {
    const allCellsArr = document.querySelectorAll(".cell");
    for (const currentCell of allCellsArr) {
        currentCell.innerText = "";
        currentCell.classList = "cell";
    }
    winCombination = [];
    gameStarted = false;
    const p1 = document.getElementById("player1Name");
    p1.value = "";
    const s1 = document.getElementById("player1Sign");
    s1.value = "X";
    const p2 = document.getElementById("player2Name");
    p2.value = "";
    const s2 = document.getElementById("player2Sign");
    s2.value = "O";
    showPlayerOptions();
});

/*
Need to set timeout as last turn blocked by alert message
Adding timeout trick allow to DOM to finish page rendering
*/
function showWinMessage(possibleWinSign) {
    setTimeout(() => {
        alert(winnerData.name + " WON with " + winnerData.sign + "!!!");
    }, 0);
}

const game = document.getElementById("startGame");
game.addEventListener("click", function () {
    const regOK = registration();
    if (regOK) {
        hidePlayerOptions();
    }
});

function registration() {
    //First player
    p1Name = document.getElementById("player1Name").value;
    if (p1Name === null || p1Name === undefined || p1Name.trim() === "") {
        alert("Please provide player-1 name!");
        return false;
    }

    if (!playerScoreMap.has(p1Name)) {
        playerScoreMap.set(p1Name, { name: p1Name, score: 0 });
    }
    p1Sign = document.getElementById("player1Sign").value;
    console.log(p1Name + " will play with " + p1Sign);

    //Second player
    p2Name = document.getElementById("player2Name").value;
    if (p2Name === null || p2Name === undefined || p2Name.trim() === "") {
        alert("Please provide player-2 name!");
        return false;
    }

    if (!playerScoreMap.has(p2Name)) {
        playerScoreMap.set(p2Name, { name: p2Name, score: 0 });
    }
    p2Sign = document.getElementById("player2Sign").value;
    console.log(p2Name + " will play with " + p2Sign);

    return true;
}

function showPlayerOptions() {
    const pOptions = document.querySelector(".playersOptions");
    pOptions.hidden = false;
}

function hidePlayerOptions() {
    const pOptions = document.querySelector(".playersOptions");
    pOptions.hidden = true;
}

function updateWinnerScore() {
    playerScoreMap.get(winnerData.name).score += 1;
}

function updateDrawScore() {
    playerScoreMap.get(p1Name).score += 0.5;
    playerScoreMap.get(p2Name).score += 0.5;
}

let isScoreVisible = false;
const showScoresBtn = document.getElementById("showScores");
showScoresBtn.addEventListener("click", function () {
    const out = document.getElementById("scoreListOutput");
    isScoreVisible = !isScoreVisible;

    if (isScoreVisible) {
        showScoresBtn.innerText = "Hide score";
        createScoreTable();
        out.hidden = false;
    } else {
        showScoresBtn.innerText = "Show score";
        out.innerHTML = "";
        out.hidden = true;
    }
});

function createScoreTable() {
    const out = document.getElementById("scoreListOutput");
    const table = document.createElement("table");
    table.border = "1";
    //create headers from map
    const headerRow = document.createElement("tr");
    const firstObject = playerScoreMap.values().next().value;
    const fieldNames = Object.keys(firstObject);
    fieldNames.forEach((element) => {
        const th = document.createElement("th");
        th.innerText = element;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    //fill the data
    playerScoreMap.forEach((val, key) => {
        const row = document.createElement("tr");

        const tdKey = document.createElement("td");
        tdKey.innerText = key;
        row.appendChild(tdKey);

        const tdValue = document.createElement("td");
        tdValue.innerText = val.score;
        row.appendChild(tdValue);

        table.appendChild(row);
    });
    out.appendChild(table);
}

function refreshScoreTable() {
    const out = document.getElementById("scoreListOutput");
    out.innerHTML = "";
    createScoreTable();
}
