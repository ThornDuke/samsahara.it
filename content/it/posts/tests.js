function createCounter() {
	let counter = 0;

	return function incrementer() {
		counter += 1;
		return counter;
	};
}

let counterA = createCounter();
let counterB = createCounter();

console.log(counterA()); // 1
console.log(counterA()); // 2
console.log(counterA()); // 3
console.log(counterA()); // 4
console.log(counterB()); // 1
console.log(counterB()); // 2
console.log(counterB()); // 3
