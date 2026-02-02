const cardDeck = [
    { id: 1, name: "Apple", icon: "🍎" },
    { id: 2, name: "Banana", icon: "🍌" },
    { id: 3, name: "Orange", icon: "🍊" },
    { id: 4, name: "Water melon", icon: "🍉" },
    { id: 5, name: "Greep", icon: "🍇" },
    { id: 8, name: "Finic", icon: "🌴" },
    { id: 9, name: "Olive", icon: "🫒" },
    { id: 10, name: "Prune", icon: "🍐" },
    { id: 11, name: "Peach", icon: "🍑" },
    { id: 12, name: "Ananas", icon: "🍍" },
    { id: 13, name: "Mango", icon: "🥭" },
    { id: 14, name: "Cherry", icon: "🍒" },
    { id: 15, name: "Strawberry", icon: "🍓" },
    { id: 16, name: "Lemon", icon: "🍋" },
    { id: 17, name: "Kiwi", icon: "🥝" },
    { id: 18, name: "Melon", icon: "🍈" }
];

const PIC_SHOW_TIME_IN_SEC = 2 * 1000;
const board = document.querySelector(".board");
const cards = [];
let isFirstPlayer = true;
let visibleCardController = 0;

function newGame() {
    initCardDeck();

    cards.forEach((currentCard) => {
        const cardElement = document.createElement("div");
        cardElement.className += "card";
        cardElement.innerHTML = `<i>${currentCard.icon}</i>
                             <p>${currentCard.name}</p>`;

        cardElement.addEventListener("click", (ev) => {
            if (currentCard.isVisible) {
                return;
            }

            if (visibleCardController % 2 === 0) {
                visualisation(currentCard, ev);
                return;
            } else {
                visualisation(currentCard, ev);                
                setTimeout(processTwoVisibleCards, PIC_SHOW_TIME_IN_SEC);
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
        firstVisibleCard.ofPlayer = 1;
        secondVisibleCard.ofPlayer = 1;
    } else {
        firstVisibleCard.ofPlayer = 2;
        secondVisibleCard.ofPlayer = 2;
    }

    showFruitOfPlayers(firstVisibleCard);
    secondVisibleCard.elem.classList.add("complete");
    firstVisibleCard.elem.classList.add("complete");
}

function visualisation(currentCard, ev) {
    currentCard.isVisible = true;
    ev.target.classList.add("isVisible");
    visibleCardController++;
}

function showFruitOfPlayers(fruit) {
    const div = document.createElement("div");
    div.className = "fruit";
    div.innerHTML = fruit.icon;

    if (fruit.ofPlayer === 1) {
        document.querySelector(".player1").appendChild(div);
    } else if (fruit.ofPlayer === 2) {
        document.querySelector(".player2").appendChild(div);
    }
}

function processTwoVisibleCards() {
    const visibleCards = cards.filter((x) => x.isVisible);
    const firstVisibleCard = visibleCards[0];
    const secondVisibleCard = visibleCards[1];

    //invisible on data side
    firstVisibleCard.isVisible = false;
    secondVisibleCard.isVisible = false;

    //invisible on HTML side
    firstVisibleCard.elem.classList.remove("isVisible");
    secondVisibleCard.elem.classList.remove("isVisible");

    if (firstVisibleCard.id === secondVisibleCard.id) {
        matching(firstVisibleCard, secondVisibleCard);
    } else {
        isFirstPlayer = !isFirstPlayer;
    }
}

newGame();

window.addEventListener("mousedown", (ev) => ev.preventDefault());
