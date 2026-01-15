const btn = document.querySelector("#submitBtn");
const response = document.querySelector("#outputField");


function isInputValid(numberToBeChecked) {
	if (isNaN(numberToBeChecked)) {
		alert ("Input should be a number");
		return false;
	}
	
	if (numberToBeChecked <= 0n ) {
		alert ("Input should be a positive number");
		return false;
	}
	
	return true;
}

function factorial (limit) {
    let result = 1n;
    for (let i = limit ; 1n < i ; i-- ) {
        result *= i;
    }
    return result;
}

btn.addEventListener("click", function() {
    const myBigIntNumber = BigInt(document.querySelector("#input").value);
    if (isInputValid(myBigIntNumber)) {
        response.innerText = factorial(myBigIntNumber).toString();
    }
});