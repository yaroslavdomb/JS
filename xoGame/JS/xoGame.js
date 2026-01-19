const possibleWinStates = [
    [0,1,2],[3,4,5],[6,7,8]     //horizontal
    [0,3,6],[1,4,7],[2,5,8],    //vertical
    [0,4,8],[2,4,6]             //diagonals
];

const SYGN_X = "X";
const SYGN_O = "O";
let isTurnToPlayO = true;

const grid = document.querySelector(".playBoard");
for (let i = 0 ; i < 9 ; i++) {
    const divElement = document.createElement("div");
    divElement.addEventListener("click", function(event) {

        if (event.target.innerText !== "") {
            return;
        }

        if (isTurnToPlayO) {
            event.target.innerText = SYGN_O;
        } else {
            event.target.innerText = SYGN_X;
        }
        isTurnToPlayO = !isTurnToPlayO;

    });

    divElement.className = "cell";
    grid.appendChild(divElement);
}