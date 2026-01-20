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
const cellsArr = [];
const playerScoreMap = new Map();
const gameState = {
    winCombination: [],
    winnerData: null,
    firstPlayerTurn: true,
    started: false,
    p1Name: null,
    p2Name: null,
    p1Sign: null,
    p2Sign: null,
    isScoreVisible: false,
    isSortedByName: false,
    isSortedByScore: false,
    failureCounter: 3
};

let sortedPlayerScoreMap;

document.getElementById("sortNames").hidden = true;
document.getElementById("sortScores").hidden = true;

const grid = document.querySelector(".playBoard");
grid.addEventListener("click", function (event) {
    if (!gameState.started || gameState.winCombination.length !== 0 || event.target.innerText !== "") {
        return;
    }

    const possibleWinSign = gameState.firstPlayerTurn ? gameState.p1Sign : gameState.p2Sign;
    event.target.innerText = possibleWinSign;
    event.target.classList.add(gameState.firstPlayerTurn ? "takenByO" : "takenByX");

    if (isGameFinished(possibleWinSign)) {
        return;
    } else {
        gameState.firstPlayerTurn = !gameState.firstPlayerTurn;
        showTurnOfPlayer();
    }
});

for (let i = 0; i < BOARD_SIZE; i++) {
    const divElement = document.createElement("div");
    divElement.className = "cell";
    cellsArr[i] = divElement;
    grid.appendChild(divElement);
}

function isGameFinishedDueToWin(possibleWinSign) {
    for (const currentState of possibleWinStates) {
        if (currentState.every((i) => cellsArr[i].innerText === possibleWinSign)) {
            gameState.winCombination = currentState;
            return true;
        }
    }
    return false;
}

function populateWinnerData() {
    gameState.winnerData = {};
    if (gameState.firstPlayerTurn) {
        gameState.winnerData.name = gameState.p1Name;
        gameState.winnerData.sign = gameState.p1Sign;
    } else {
        gameState.winnerData.name = gameState.p2Name;
        gameState.winnerData.sign = gameState.p2Sign;
    }
}

//no empty space to set a new values
function isAnyEmptyCellOnGameboard() {
    return cellsArr.some((element) => element.innerText === "");
}

function showDrawMessage() {
    setTimeout(() => {
        alert("Friendship WON!!!");
    }, 0);
}

function markWinCombination() {
    gameState.winCombination.forEach((i) => {
        cellsArr[i].classList.add("winner");
    });
}

const clearBoardBtn = document.getElementById("clearBoardBtn");
clearBoardBtn.addEventListener("click", function () {
    for (const currentCell of cellsArr) {
        currentCell.innerText = "";
        currentCell.className = "cell";
    }
    gameState.winCombination = [];
    gameState.started = false;
    gameState.firstPlayerTurn = 0;
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
function showWinMessage() {
    setTimeout(() => {
        alert(gameState.winnerData.name + " WON with " + gameState.winnerData.sign + "!!!");
    }, 0);
}

const game = document.getElementById("startGame");
game.addEventListener("click", function () {
    const regOK = registration();
    if (regOK) {
        freezePlayerOptions();
        gameState.started = true;
    }
});

function registration() {
    //First player
    gameState.p1Name = document.getElementById("player1Name").value;
    if (gameState.p1Name === null || gameState.p1Name === undefined || gameState.p1Name.trim() === "") {
        alert("Please provide player-1 name!");
        return false;
    }

    if (!playerScoreMap.has(gameState.p1Name)) {
        playerScoreMap.set(gameState.p1Name, { name: gameState.p1Name, score: 0 });
        gameState.isSortedByName = false;
    }
    gameState.p1Sign = document.getElementById("player1Sign").value;

    //Second player
    gameState.p2Name = document.getElementById("player2Name").value;
    if (gameState.p2Name === null || gameState.p2Name === undefined || gameState.p2Name.trim() === "") {
        alert("Please provide player-2 name!");
        return false;
    }

    if (!playerScoreMap.has(gameState.p2Name)) {
        playerScoreMap.set(gameState.p2Name, { name: gameState.p2Name, score: 0 });
        gameState.isSortedByName = false;
    }
    gameState.p2Sign = document.getElementById("player2Sign").value;

    if (gameState.p1Sign === gameState.p2Sign ) {
        alert("No-no-no, you can't play with the same sign!!!");
        return false;
    }        
    
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
    playerScoreMap.get(gameState.winnerData.name).score += 1;

    //refresh sorted map
    if (gameState.isSortedByScore) {
        sortedPlayerScoreMap = sortByScoreMap();
    }
}

function updateDrawScore() {
    //update original table
    playerScoreMap.get(gameState.p1Name).score += 0.5;
    playerScoreMap.get(gameState.p2Name).score += 0.5;

    //refresh sorted map
    if (gameState.isSortedByScore) {
        sortedPlayerScoreMap = sortByScoreMap();
    }
}

const showScoresBtn = document.getElementById("showScores");
showScoresBtn.addEventListener("click", function () {
    const out = document.getElementById("scoreListOutput");
    const sortByNameOpt = document.getElementById("sortNames");
    const sortByScoreOpt = document.getElementById("sortScores");

    gameState.isScoreVisible = !gameState.isScoreVisible;
    if (gameState.isScoreVisible) {
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
    let scoreDataMap = gameState.isSortedByName || gameState.isSortedByScore ? sortedPlayerScoreMap : playerScoreMap;

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
    gameState.isSortedByName = true;
    gameState.isSortedByScore = false;
    refreshScoreTable();
});

const sortScoreBtn = document.getElementById("sortScores");
sortScoreBtn.addEventListener("click", function () {
    sortedPlayerScoreMap = sortByScoreMap();
    gameState.isSortedByName = false;
    gameState.isSortedByScore = true;
    refreshScoreTable();
});

function sortByScoreMap() {
    return new Map([...playerScoreMap.entries()].sort((a, b) => b[1].score - a[1].score));
}

const clearPlayerListBtn = document.getElementById("clearPlayerList");
clearPlayerListBtn.addEventListener("click", function () {
    if (gameState.isSortedByName || gameState.isSortedByScore) {
        sortedPlayerScoreMap.clear();
    }
    playerScoreMap.clear();
    const out = document.getElementById("scoreListOutput");
    out.innerHTML = "";
    gameState.isSortedByName = false;
    gameState.isSortedByScore = false;
});

function showTurnOfPlayer() {
    const nextName = document.getElementById("nextTurnPlayerName");
    const nextSign = document.getElementById("nextTurnPlayerSign");

    if (gameState.firstPlayerTurn) {
        nextName.innerText = gameState.p1Name;
        nextSign.innerText = gameState.p1Sign;
    } else {
        nextName.innerText = gameState.p2Name;
        nextSign.innerText = gameState.p2Sign;
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
        if (gameState.isScoreVisible) {
            refreshScoreTable();
        }
        return true;
    } else if (!isAnyEmptyCellOnGameboard()) {
        updateDrawScore();
        showDrawMessage();
        clearNextTurnFields();
        unfreezePlayerOptions();
        if (gameState.isScoreVisible) {
            refreshScoreTable();
        }
        return true;
    }

    return false;
}

function printData() {
    console.log("player_1_name = " + gameState.p1Name);
    console.log("player_1_sign = " + gameState.p1Sign);
    console.log("winner combination = " + gameState.winCombination);
    console.log("firstPlayerTurn = " + gameState.firstPlayerTurn);
    console.log("started = " + gameState.started);
}
