const btn = document.querySelector("#btn");
const out = document.querySelector("#output");

const btnPrime = document.querySelector("#btnPrime");
const outPrime = document.querySelector("#outputPrime");


function isInputValid (num) {
    
    if (isNaN(num) || num <= 0) {
        return false;
    }

    return true;
}

btn.addEventListener ("click", function() {
    const myNumber = Number(document.querySelector("#input").value);
    let arr = "1";
    if (isInputValid (myNumber)) {
        for (let i = 2 ; i < myNumber ; i++) {
            if (myNumber % i === 0) {
                arr += "," + i;
            }
        }
    }
    arr += "," + myNumber;
    out.innerText = arr;
});


