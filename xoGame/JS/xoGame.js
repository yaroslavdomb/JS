const possibleWinStates = [
    [0,1,2],[3,4,5],[6,7,8],    //horizontal
    [0,3,6],[1,4,7],[2,5,8],    //vertical
    [0,4,8],[2,4,6]             //diagonals
];

const SYGN_X = "X";
const SYGN_O = "O";
const BOARD_SIZE = 9;
let isTurnToPlayO;
let winCombination = [];
let gameStarted = false;

const grid = document.querySelector(".playBoard");

for (let i = 0 ; i < BOARD_SIZE ; i++) {
    
    const divElement = document.createElement("div");
    divElement.className = "cell";

    divElement.addEventListener("click", function() {

        if (!gameStarted) {
            hideInitial();
            isTurnToPlayO = document.querySelector("#startPlayWith").value === SYGN_O;
            gameStarted = true;
        }        

        if (winCombination.length !== 0 || this.innerText !== "") {
            return;
        }
        
        const possibleWinSygn = isTurnToPlayO ? SYGN_O : SYGN_X;
        this.innerText = possibleWinSygn;
        this.classList.add(isTurnToPlayO ? "takenByO" : "takenByX");
        
        if (isGameFinished(possibleWinSygn)) {
            markWinCombination();            
            showWinMessage(possibleWinSygn);
            showOptions();
        }

        isTurnToPlayO = !isTurnToPlayO;
    });

    grid.appendChild(divElement);
}

function isGameFinished(possibleWinSygn) {
    
    const allCellsArr = document.querySelectorAll(".cell");
    for (const currentState of possibleWinStates) {
        if (currentState.every(i => allCellsArr[i].innerText === possibleWinSygn)) {
            winCombination = currentState;            
            return true;
        }
    }
    return false;
}

function markWinCombination() {
    const allCellsArr = document.querySelectorAll(".cell");
    winCombination.forEach(i => {
        allCellsArr[i].classList.add("winner");
    });
}

const clearBtn = document.getElementById("clearBtn");
clearBtn.addEventListener("click", function(){
    const allCellsArr = document.querySelectorAll(".cell");
    for (const currentCell of allCellsArr) {
        currentCell.innerText = "";
        currentCell.classList = "cell";        
    }
    winCombination = [];
    gameStarted = false;
    showOptions();
});

function hideInitial () {
    const initialDiv = document.querySelector("#initial");
    initialDiv.hidden = true;
}

function showWinMessage(possibleWinSygn) {
    setTimeout(() => { alert (possibleWinSygn + " WINS");}, 0);
}

function showOptions() {
    //show first step selection
    const initialDiv = document.querySelector("#initial");
    initialDiv.hidden = false;

    //show clear button
    const clearBtn = document.getElementById("clearBtn");
    clearBtn.hidden = false;
}