const btn = document.querySelector("#btn");
const out = document.querySelector("#output");

function isInputValid (num) {
    
    return !isNaN(num);
}

// /*
// V1
// */
// btn.addEventListener ("click", function() {
//     const myNumber = Number(document.querySelector("#input"));
//     if (isInputValid (myNumber)) {
//         let posNumber = Math.abs(myNumber);
//         let sum = 0 ; 
//         while ( 0 < posNumber ) {
//             sum += posNumber % 10;
//             posNumber = (posNumber - (posNumber % 10))/10;
//         }
//     }
//     out.innerText = sum;
// });

// /*
// V2
// */
// btn.addEventListener ("click", function() {
//     const myNumber = Number(document.querySelector("#input"));
//     if (isInputValid (myNumber)) {
//         let posNumber = Math.abs(myNumber);
//         let sum = 0 ; 
//         while ( 0 < posNumber ) {
//             sum += posNumber % 10;
//             posNumber = Math.floor(posNumber/10);
//         }
//     }
//     out.innerText = sum;
// });

/*
V3
*/
btn.addEventListener ("click", function() {
    const myNumber = Number(document.querySelector("#input"));
    if (isInputValid (myNumber)) {
        out.innerText = Math.abs(myNumber).toString().split('').reduce((a,b) => a + Number(b), 0);
    }
});