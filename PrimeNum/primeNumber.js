const btn = document.querySelector("#submitBtn");
const response = document.querySelector("#outputField");

function isPrime(potentialPrimeNum){ 
	const limit = Math.ceil(Math.sqrt(potentialPrimeNum));
	for (let i = 2; i <= limit ; i++) {
		if (potentialPrimeNum % i === 0) {
			return false;
		}
	}
	return true;
}

function isInputValid(potentialPrimeNum) {
	if (isNaN(potentialPrimeNum)) {
		alert ("Input should be a number");
		return false;
	}
	
	if (potentialPrimeNum < 0 ) {
		alert ("Input should be a positive number");
		return false;
	}
	
	if (potentialPrimeNum === 0 || potentialPrimeNum === 1 ) {
		alert ("Not a prime number by defenition");
		return false;
	}
	
	return true;
}

btn.addEventListener ("click", function() {
	const potentialPrimeNum = Number(document.querySelector("#num").value);
	if (isInputValid(potentialPrimeNum)){
		response.innerText = isPrime(potentialPrimeNum);
	}
})
