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

function factorial (currentVal) {
    return currentVal === 1n ? 1n : currentVal * factorial(currentVal - 1n);
}

btn.addEventListener("click", function() {
    const myBigIntNumber = BigInt(document.querySelector("#input").value);
    if (isInputValid(myBigIntNumber)) {
        response.innerText = factorial(myBigIntNumber).toString();
    }
});