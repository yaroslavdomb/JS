const cardDeck = [
    { id: 1, name: "Apple", icon: "🍎" },
    { id: 2, name: "Banana", icon: "🍌" },
    { id: 3, name: "Orange", icon: "🍊" },
    { id: 4, name: "Watermelon", icon: "🍉" },
    { id: 5, name: "Grapes", icon: "🍇" },
    { id: 8, name: "Finic", icon: "🌴" },
    { id: 9, name: "Olive", icon: "🫒" },
    { id: 10, name: "Pear", icon: "🍐" },
    { id: 11, name: "Peach", icon: "🍑" },
    { id: 12, name: "Ananas", icon: "🍍" },
    { id: 13, name: "Mango", icon: "🥭" },
    { id: 14, name: "Cherry", icon: "🍒" },
    { id: 15, name: "Strawberry", icon: "🍓" },
    { id: 16, name: "Lemon", icon: "🍋" },
    { id: 17, name: "Kiwi", icon: "🥝" },
    { id: 18, name: "Melon", icon: "🍈" }
];

const domElem = {
    p1: document.getElementsByClassName("player1")[0],
    p1Header: document.getElementsByClassName("player1")[0].querySelector("header"),
    p2: document.getElementsByClassName("player2")[0],
    p2Header: document.getElementsByClassName("player2")[0].querySelector("header")
};

const board = document.querySelector(".board");
const cards = [];
const MATCH_TIME_MILISEC = 800;
const NO_MATCH_TIME_MILISEC = 2000;

let isFirstPlayer = true;

/*
Changed on click on some card
If it's currently 
    Even => No cards visible
    Odd => There is exactly 1 visible card 
*/
let visabilityCardsController = 0;

/*
Block clicking once 2 cards opened
Will be released at the end of processing
*/
let isClickAllowed = true;

function newGame() {
    initCardDeck();
    initPlayers();

    cards.forEach((currentCard) => {
        const cardElement = document.createElement("div");
        cardElement.className += "card";
        cardElement.innerHTML = `<i>${currentCard.icon}</i>
                             <p>${currentCard.name}</p>`;

        cardElement.addEventListener("click", (ev) => {
            if (currentCard.isVisible) {
                return;
            }

            if (isClickAllowed) {
                if (visabilityCardsController % 2 === 0) {
                    cardVisualisation(currentCard, ev);
                    return;
                } else {
                    isClickAllowed = false;
                    cardVisualisation(currentCard, ev);
                    processTwoVisibleCards();
                }
            }
        });

        currentCard.elem = cardElement;
        board.appendChild(cardElement);
    });
}

/*
 * 1) set twice each element into the deck
 * 2) shuffle deck with primitive algotithm
 */
function initCardDeck() {
    cardDeck.forEach((f) => {
        cards.push({ ...f }, { ...f });
    });

    cards.sort(() => Math.random() - 0.5);
}

function matching(firstVisibleCard, secondVisibleCard) {
    if (isFirstPlayer) {
        firstVisibleCard.owner = 1;
        secondVisibleCard.owner = 1;
    } else {
        firstVisibleCard.owner = 2;
        secondVisibleCard.owner = 2;
    }

    // Cause of pairing match there is no diff
    // which card pic we going to show - it's the same
    showWinCardPicture(firstVisibleCard);
    secondVisibleCard.elem.classList.add("complete");
    firstVisibleCard.elem.classList.add("complete");
}

function cardVisualisation(currentCard, ev) {
    currentCard.isVisible = true;
    ev.target.classList.add("isVisible");
    visabilityCardsController++;
}

function showWinCardPicture(winCard) {
    const div = document.createElement("div");
    div.className = "winCard";
    div.innerHTML = winCard.icon;

    if (winCard.owner === 1) {
        document.querySelector(".player1").appendChild(div);
    } else if (winCard.owner === 2) {
        document.querySelector(".player2").appendChild(div);
    }
}

function processTwoVisibleCards() {
    const visibleCards = cards.filter((card) => card.isVisible);
    const firstVisibleCard = visibleCards[0];
    const secondVisibleCard = visibleCards[1];
    let pauseGameTime;

    if (firstVisibleCard.id === secondVisibleCard.id) {
        matching(firstVisibleCard, secondVisibleCard);
        pauseGameTime = MATCH_TIME_MILISEC;
    } else {
        pauseGameTime = NO_MATCH_TIME_MILISEC;
        isFirstPlayer = !isFirstPlayer;
    }

    setTimeout(() => {
        hideCards(firstVisibleCard, secondVisibleCard);
        setPlayerDesign();
    }, pauseGameTime);
}

function hideCards(firstVisibleCard, secondVisibleCard) {
    //invisible on data side
    firstVisibleCard.isVisible = false;
    secondVisibleCard.isVisible = false;

    //invisible on HTML side
    firstVisibleCard.elem.classList.remove("isVisible");
    secondVisibleCard.elem.classList.remove("isVisible");

    isClickAllowed = true;
}

function initPlayers() {
    domElem.p1.classList.add("active");
    domElem.p2.classList.add("notActive");
}

function setPlayerDesign() {
    domElem.p1.classList.toggle("active");
    domElem.p1.classList.toggle("notActive");
    domElem.p2.classList.toggle("notActive");
    domElem.p2.classList.toggle("active");
}

newGame();

window.addEventListener("mousedown", (ev) => ev.preventDefault());
