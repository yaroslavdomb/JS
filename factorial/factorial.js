const btn = document.querySelector("#submitBtn");
const response = document.querySelector("#outputField");


function isInputValid(numberToBeChecked) {
	if (isNaN(numberToBeChecked)) {
		alert ("Input should be a number");
		return false;
	}
	
	if (numberToBeChecked <= 0 ) {
		alert ("Input should be a positive number");
		return false;
	}
	
	return true;
}

function factorial (currentVal) {
    return currentVal === 1 ? 1 : currentVal *  factorial(currentVal-1);
}

btn.addEventListener("click", function() {
    const myNumber = Number(document.querySelector("#input").value);
    if (isInputValid(myNumber)) {
        response.innerText = factorial(myNumber);
    }
});