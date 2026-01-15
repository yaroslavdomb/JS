const btnPrime = document.querySelector("#btnPrime");
const outPrime = document.querySelector("#outputPrime");

function isInputValid (num) {
    
    if (isNaN(num) || num <= 0) {
        return false;
    }

    return true;
}

btnPrime.addEventListener ("click", function() {
    const myNumber = Number(document.querySelector("#input"));
    if (isInputValid (myNumber)) {
        let arr = "";
        let temp = myNumber;
        for (let i = 2 ; i <= temp ; i++) {
            if (temp % i === 0) {
                while (temp % i === 0) {
                    temp /= i;
                }
                if (arr.trim() === "") {
                    arr += i; 
                } else {
                    arr += "," + i;
                }                
            }
        }
    }
    
    //it's a prime number
    if (arr.trim() === "") {
        arr += "1," + myNumber;
    }

    outPrime.innerText = arr;
});