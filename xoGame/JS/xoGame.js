const possibleWinStates = [
    [0,1,2],[3,4,5],[6,7,8],    //horizontal
    [0,3,6],[1,4,7],[2,5,8],    //vertical
    [0,4,8],[2,4,6]             //diagonals
];

const SYGN_X = "X";
const SYGN_O = "O";
const BOARD_SIZE = 9;
let isTurnToPlayO = true;
let winCombination = [];

const grid = document.querySelector(".playBoard");
for (let i = 0 ; i < BOARD_SIZE ; i++) {
    const divElement = document.createElement("div");
    divElement.addEventListener("click", function(event) {

        if (event.target.innerText !== "") {
            return;
        }

        if (isTurnToPlayO) {
            event.target.innerText = SYGN_O;
            event.target.classList.add("takenByO");      
        } else {
            event.target.innerText = SYGN_X;
            event.target.classList.add("takenByX");
        }
        
        isTurnToPlayO = !isTurnToPlayO;
        if (isGameFinished()) {
            markWinCombination();
        }
    });

    divElement.className = "cell";
    grid.appendChild(divElement);
}

function isGameFinished() {
    
    const possibleWinSygn = isTurnToPlayO ? SYGN_X : SYGN_O;
    const allCellsArr = document.querySelectorAll(".cell");
    for (const currentState of possibleWinStates) {
        if (currentState.every(i => allCellsArr[i].innerText === possibleWinSygn)) {
            winCombination = currentState;
            alert (possibleWinSygn + " WINS");
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
});