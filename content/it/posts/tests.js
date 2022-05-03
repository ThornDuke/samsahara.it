function manageAnimals() {
	let animals = [
		{
			id: 1,
			name: 'chicken',
			verse: 'cluck'
		},
		{
			id: 2,
			name: 'zebra',
			verse: 'neigh'
		},
		{
			id: 3,
			name: 'penguin',
			verse: 'chirp'
		},
		{
			id: 4,
			name: 'dolphin',
			verse: 'whistle'
		},
	];

	function getVerse(id) {
		let animal = animals.find(a => a.id === id)
		return animal.verse
	}

	function setVerse(id, verse) {
		let animal = animals.find(a => a.id === id)
		let newAnimal = {
			...animal,
			verse: verse
		}
		animals = animals.map(a => a.id !== id ? a : newAnimal)
	}

	function printAnimals() {
		console.log(animals)
	}

	const publicInterface = {
		getVerse,
		setVerse,
		printAnimals
	}

	return publicInterface
}

let animalVerses_A = new manageAnimals();
let animalVerses_B = new manageAnimals();

console.log(animalVerses_A.getVerse(3))
// ===> chirp
console.log(animalVerses_B.getVerse(4))
// ===> whistle

animalVerses_A.setVerse(4, 'bark')
animalVerses_B.setVerse(4, 'buzz')
animalVerses_A.printAnimals()
// ===> [ ..., { id: 4, name: 'dolphin', verse: 'bark' }, ...]
animalVerses_B.printAnimals()
// ===> [ ..., { id: 4, name: 'dolphin', verse: 'buzz' }, ...]

console.log(animalVerses_A.animals)
// ===> undefined
console.log(animalVerses_B.animals)
// ===> undefined

animalVerses_A.printAnimals()
animalVerses_B.printAnimals()
// ===> ... come ci si aspetta