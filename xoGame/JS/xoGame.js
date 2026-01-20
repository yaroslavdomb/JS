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
let sortedPlayerScoreMap;
let isFirstPlayerTurn = true;
let winCombination = [];
let winnerData = {};
let gameStarted = false;
let p1Name = "";
let p2Name = "";
let p1Sign = "";
let p2Sign = "";
let isScoreVisible = false;
let isSortedByName = false;
let isSortedByScore = false;

document.getElementById("sortNames").hidden = true;
document.getElementById("sortScores").hidden = true;

const grid = document.querySelector(".playBoard");
grid.addEventListener("click", function (event) {
    if (!gameStarted || winCombination.length !== 0 || event.target.innerText !== "") {
        return;
    }

    const possibleWinSign = isFirstPlayerTurn ? p1Sign : p2Sign;
    event.target.innerText = possibleWinSign;
    event.target.classList.add(isFirstPlayerTurn ? "takenByO" : "takenByX");

    if (isGameFinished(possibleWinSign)) {
        return;
    } else {
        isFirstPlayerTurn = !isFirstPlayerTurn;
        showTurnOfPlayer();
    }
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
        currentCell.className = "cell";
    }
    winCombination = [];
    gameStarted = false;
    isFirstPlayerTurn = true;
    const p1 = document.getElementById("player1Name");
    p1.value = "";
    const s1 = document.getElementById("player1Sign");
    s1.value = "X";
    const p2 = document.getElementById("player2Name");
    p2.value = "";
    const s2 = document.getElementById("player2Sign");
    s2.value = "O";
    unfreezePlayerOptions();
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
        freezePlayerOptions();
        gameStarted = true;
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
        isSortedByName = false;
    }
    p1Sign = document.getElementById("player1Sign").value;

    //Second player
    p2Name = document.getElementById("player2Name").value;
    if (p2Name === null || p2Name === undefined || p2Name.trim() === "") {
        alert("Please provide player-2 name!");
        return false;
    }

    if (!playerScoreMap.has(p2Name)) {
        playerScoreMap.set(p2Name, { name: p2Name, score: 0 });
        isSortedByName = false;
    }
    p2Sign = document.getElementById("player2Sign").value;

    return true;
}

function unfreezePlayerOptions() {
    document.querySelectorAll(".playersOptions input, .playersOptions button").forEach((el) => (el.disabled = false));
}

function freezePlayerOptions() {
    document.querySelectorAll(".playersOptions input, .playersOptions button").forEach((el) => (el.disabled = true));
}

function updateWinnerScore() {
    //update original table
    playerScoreMap.get(winnerData.name).score += 1;

    //refresh sorted map
    if (isSortedByScore) {
        sortedPlayerScoreMap = sortByScoreMap();
    }
}

function updateDrawScore() {
    //update original table
    playerScoreMap.get(p1Name).score += 0.5;
    playerScoreMap.get(p2Name).score += 0.5;

    //refresh sorted map
    if (isSortedByScore) {
        sortedPlayerScoreMap = sortByScoreMap();
    }
}

const showScoresBtn = document.getElementById("showScores");
showScoresBtn.addEventListener("click", function () {
    const out = document.getElementById("scoreListOutput");
    const sortByNameOpt = document.getElementById("sortNames");
    const sortByScoreOpt = document.getElementById("sortScores");

    isScoreVisible = !isScoreVisible;
    if (isScoreVisible) {
        showScoresBtn.innerText = "Hide scores";
        let isTableCreated = createScoreTable();
        if (isTableCreated) {
            sortByNameOpt.hidden = false;
            sortByScoreOpt.hidden = false;
            out.hidden = false;
        }
    } else {
        showScoresBtn.innerText = "Show scores";
        sortByNameOpt.hidden = true;
        sortByScoreOpt.hidden = true;
        out.innerHTML = "";
        out.hidden = true;
    }
});

function createScoreTable() {
    const out = document.getElementById("scoreListOutput");
    const table = document.createElement("table");
    table.border = "1";
    let scoreDataMap = isSortedByName || isSortedByScore ? sortedPlayerScoreMap : playerScoreMap;

    //create headers from map
    const headerRow = document.createElement("tr");
    const firstObject = scoreDataMap.values().next().value;
    if (firstObject === null || firstObject === undefined) {
        console.log("Score table is empty");
        return false;
    }
    const fieldNames = Object.keys(firstObject);
    fieldNames.forEach((element) => {
        const th = document.createElement("th");
        th.innerText = element;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    //fill the data
    scoreDataMap.forEach((val, key) => {
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

    return true;
}

function refreshScoreTable() {
    const out = document.getElementById("scoreListOutput");
    out.innerHTML = "";
    createScoreTable();
}

const sortNamesBtn = document.getElementById("sortNames");
sortNamesBtn.addEventListener("click", function () {
    sortedPlayerScoreMap = new Map([...playerScoreMap.entries()].sort((a, b) => a[0].localeCompare(b[0])));
    isSortedByName = true;
    isSortedByScore = false;
    refreshScoreTable();
});

const sortScoreBtn = document.getElementById("sortScores");
sortScoreBtn.addEventListener("click", function () {
    sortedPlayerScoreMap = sortByScoreMap();
    isSortedByName = false;
    isSortedByScore = true;
    refreshScoreTable();
});

function sortByScoreMap() {
    return new Map([...playerScoreMap.entries()].sort((a, b) => b[1].score - a[1].score));
}

const clearPlayerListBtn = document.getElementById("clearPlayerList");
clearPlayerListBtn.addEventListener("click", function () {
    if (isSortedByName || isSortedByScore) {
        sortedPlayerScoreMap.clear();
    }
    playerScoreMap.clear();
    const out = document.getElementById("scoreListOutput");
    out.innerHTML = "";
    isSortedByName = false;
    isSortedByScore = false;
});

function showTurnOfPlayer() {
    const nextName = document.getElementById("nextTurnPlayerName");
    const nextSign = document.getElementById("nextTurnPlayerSign");

    if (isFirstPlayerTurn) {
        nextName.innerText = p1Name;
        nextSign.innerText = p1Sign;
    } else {
        nextName.innerText = p2Name;
        nextSign.innerText = p2Sign;
    }
}

function clearNextTurnFields() {
    const nextName = document.getElementById("nextTurnPlayerName");
    const nextSign = document.getElementById("nextTurnPlayerSign");
    nextName.innerText = "";
    nextSign.innerText = "";
}

function isGameFinished(possibleWinSign) {
    if (isGameFinishedDueToWin(possibleWinSign)) {
        populateWinnerData();
        markWinCombination();
        showWinMessage();
        updateWinnerScore();
        clearNextTurnFields();
        unfreezePlayerOptions();
        if (isScoreVisible) {
            refreshScoreTable();
        }
        return true;
    } else if (!isAnyEmptyCellOnGameboard()) {
        updateDrawScore();
        showDrawMessage();
        clearNextTurnFields();
        unfreezePlayerOptions();
        if (isScoreVisible) {
            refreshScoreTable();
        }
        return true;
    }

    return false;
}
