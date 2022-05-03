---
title: 'Moduli'
date: 2022-05-02
featured_image: 'MargaretHamilton.jpg'
tags: ["scope", "closure", "modules"]
toc: true
draft: false
show_reading_time: true
metatag: 'JavaScript programmazione avanzata, scope, closures, modules'
---

I _moduli_ sono il principale strumento per la strutturazione e la organizzazione del codice; il modulo consente di applicare il principio di _incapsulazione_ di dati e procedure che è così importante nella programmazione contemporanea, non solo in JavaScript. Per mezzo della incapsulazione non solo si raccolgono dati e codice logicamente collegati in un unica struttura utilizzabile come un _unicum_ (ad esempio si possono raccogliere in un modulo tutte le procedure e i dati relativi all'accesso a un database, oppure tutte le procedure relative alla gestione di particolari strutture dati), ma si possono anche nascondere tutti quei dettagli implementativi (variabili, costanti, procedure) di cui è bene evitare la modificabilità all'esterno del modulo stesso.

In questo articolo vedremo innanzitutto cosa si intende per _modulo_ in JavaScript, poi i modi differenti nei quali questo concetto viene applicato in Node e in ES.

## Cosa NON È un modulo

Un _modulo_ è una struttura dati contenente _dati_ (anche chiamati _stato_ del modulo) e procedure (anche chiamati _metodi_). I metodi devono accedere ai dati per leggerli e modificarli, e i dati devono essere inaccessibili dall'esterno del modulo. Se manca anche una sola di queste caratteristiche non siamo più di fronte ad un modulo ma ad un'altra struttura dati: il _namespace_ o la _struttura dati_ vera e propria.

### Namespace

Se una struttura contiene solo procedure ma nessun dato cui le procedure accedano in lettura o scrittura non può essere considerata un _modulo_ ma un _namespace_, una struttura molto semplice e statica, che si limita a mettere a disposizione una serie di metodi logicamente collegati ad un certo scopo. Ad esempio:

```javascript
function stringUtils() {
	function reverse(string) {
		return string
			.split('')
			.reverse()
			.join('')
	}

	function substitute(string, char1, char2) {
		return string
			.split('')
			.map(char => char === char1 ? char2 : char)
			.join('')
	}

	function exclude(string, char) {
		return string
			.split('')
			.filter(currentChar => currentChar !== char)
			.join('')
	}

	return {
		reverse,
		substitute,
		exclude
	}
}

let utils = stringUtils()

console.log(utils.reverse('ladder'))
// ===> reddal
console.log(utils.substitute('stopper', 't', 'l'))
// ===> slopper
console.log(utils.exclude('london', 'n'))
// ===> lodo
```
In questo esempio `stringUtils` è un semplice _namespace_, trattandosi di una struttura che si limita a mettere a disposizione una serie di metodi volti a modificare in vario modo le stringhe che vengono passate come parametri.

### Struttura dati

Se una struttura contiene procedure e dati cui le procedure accedono, ma i dati non sono nascosti all'interno della struttura, non vale la pena di parlare di _modulo_, trattandosi invece di una semplice _struttura dati_. Vediamo un esempio:

```javascript
const animalVerses = {
	animals: [
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
	],

	getVerse(id) {
		let animal = this.animals.find(a => a.id === id)
		return animal.verse
	},

	setVerse(id, verse) {
		let animal = this.animals.find(a => a.id === id)
		let newAnimal = {
			...animal,
			verse: verse
		}
		this.animals = this.animals.map(a => a.id !== id ? a : newAnimal)
	}
}

console.log(animalVerses.animals)
// ===> ... come ci si aspetta
console.log(animalVerses.getVerse(3))
// ===> chirp
animalVerses.setVerse(4, 'bark')
console.log(animalVerses.animals)
// ===> [ ..., { id: 4, name: 'dolphin', verse: 'bark' }, ...]
```

Qui `animalVerses` è costituito sia da dati (l'array `animals`), sia da metodi che accedono a quei dati in lettura e in scrittura; ma, come si vede dal primo `console.log` in coda all'esempio, i dati non sono nascosti all'interno della struttura dati, sono accedibili dall'esterno sia in lettura che in scrittura. Quindi `animalVerses` non è un _modulo_.

## Il modulo "classico"

Dunque un _modulo_ deve contenere dati (lo _stato_ del modulo), i dati devono essere nascosti all'interno del modulo, e deve contenere le procedure (o _metodi_) per accedere a quei dati. Vediamo un esempio:

```javascript
const animalVerses = (function manageAnimals() {
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
})()

console.log(animalVerses.getVerse(3))
// ===> chirp
animalVerses.setVerse(4, 'bark')
animalVerses.printAnimals()
// ===> [ ..., { id: 4, name: 'dolphin', verse: 'bark' }, ...]

console.log(animalVerses.animals)
// ===> undefined

animalVerses.printAnimals()
// ===> ... come ci si aspetta
```

Il modulo vero e proprio è `manageAnimals` che, con la tecnica del `IIFE` (Immediately Invoked Function Expression), assegna alla variabile `animalVerses` l'oggetto `publicInterface`. Quest'ultimo oggetto espone l'_interfaccia pubblica_ del modulo, ossia i metodi che accedono allo stato del modulo (l'oggetto `animals`) in lettura e in scrittura.

Gli ultimi due `console.log` dell'esempio evidenziano il fatto che lo stato del modulo è _nascosto_ e inaccessibile dall'esterno se si usa un sistema diretto (primo `log`) mentre è leggibile per mezzo di un apposito metodo facente parte dell'interfaccia pubblica.


Ovviamente si può definire un modulo senza usare un `IIFE` e utilizzare istanze del modulo definite _ad hoc_, ad esempio:

```javascript
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
```

Qui viene definito il modulo `manageAnimals` con il quale vengono definite le due diverse istanze `animalVerses_A` e `animalVerses_B`, ognuna delle quali ha un proprio e diverso stato `animals` che infatti, come si vede dai vari `console.log`, vengono gestiti in modo diverso.

## Il modulo in Node

Sia in Node che in ES il concetto di modulo è collegato a quello di `file`: un file contiene un solo modulo, ogni modulo è contenuto in un suo proprio file.

Possiamo trasformare il modulo dell'esempio precedente nel formato Node nel modo seguente:

```javascript
// === file animalVerses.js =======
//
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

module.exports = {
	getVerse,
	setVerse,
	printAnimals
}
//
// === end of file animalVerses.js =======

// === file index.js =======
//
const myAnimalVerses = require('path/to/animalVerses.js')

console.log(myAnimalVerses.getVerse(3))
// ===> chirp

myAnimalVerses.setVerse(4, 'bark')
myAnimalVerses.printAnimals()
// ===> [ ..., { id: 4, name: 'dolphin', verse: 'bark' }, ...]

console.log(myAnimalVerses.animals)
// ===> undefined

myAnimalVerses.printAnimals()
// ===> ... come ci si aspetta
//
// === end of file index.js =======
```

Il file `animalVerses.js` definisce i metodi di accesso ai dati in `animals`. Il modulo Node espone un oggetto vuoto (`module.exports`) al quale vengono assegnati come campi i metodi e i dati del modulo che costituiscono l'interfaccia pubblica [^1]. Per creare una istanza del modulo si usa la sintassi `const myAnimalVerses = require('path/to/animalVerses.js')` che ha l'effetto di assegnare a `myAnimalVerses` il contenuto dell'interfaccia pubblica esposta dal modulo `animalVerses.js`.

Il metodo `require` importa _tutto_ il contenuto dell'interfaccia pubblica del modulo. È possibile però importare solo parte dell'interfaccia con uno dei seguenti procedimenti:

```javascript
const printAnimals = require('path/to/animalVerses.js').printAnimals
// oppure
const { printAnimals } = require('path/to/animalVerses.js')
```

Infine, i moduli contenuti all'interno della directory `node_modules` possono essere referenziati con la sintassi priva della indicazione del percorso del file, ad es: `require('animalVerses')`.

## Il modulo in ES

Il modulo in ES è molto simile a quello usato in Node: anche in ES ogni modulo è contenuto in un suo proprio file e la sintassi di definizione di dati e metodi è praticamente identica.

Ma al posto dell'oggetto `module.exports` si usa la _keyword_ `export` e al posto di `require()` si usa la _keyword_ `import`. Possiamo quindi riscrivere il nostro modulo in formato ES nel seguente modo:

```javascript
// === file animalVerses.js =======
//
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

export {
	getVerse,
	setVerse,
	printAnimals
}
//
// === end of file animalVerses.js =======

// === file index.js =======
//
import * as myAnimalVerses from 'path/to/animalVerses.js'

console.log(myAnimalVerses.getVerse(3))
// ===> chirp

myAnimalVerses.setVerse(4, 'bark')
myAnimalVerses.printAnimals()
// ===> [ ..., { id: 4, name: 'dolphin', verse: 'bark' }, ...]

console.log(myAnimalVerses.animals)
// ===> undefined

myAnimalVerses.printAnimals()
// ===> ... come ci si aspetta
//
// === end of file index.js =======
```

Come si vede, le differenze rispetto al modulo in formato Node sono davvero pochissime.

Anche in ES è possibile importare solo alcuni degli elementi dell'interfaccia (invece di importarli tutti, come è il comportamento di default) con la sintassi

```javascript
import { getVerse, printAnimals } from 'path/to/animalVerses.js'
```

È possibile indicare nel modulo uno dei dati o metodi dell'interfaccia come `export default`; in questo caso la sintassi per l'importazione è priva delle parentesi graffe:

```javascript
// === file animalVerses.js =======
function getVerse(id) {/* ... etc. */}

export default getVerse

// === file index.js =======
import getVerse from 'path/to/animalVerses.js'
```

[^1]: In realtà la questione è un po' più complessa: l'istruzione nell'esempio _sostituisce_ l'oggetto vuoto offerto da `module.exports` con il diverso oggetto contenente i riferimenti ai metodi del modulo. Alcuni autori ritengono che questo procedimento possa dar luogo a problemi in alcuni casi limite e propongono metodi alternativi, ad esempio: `Object.assign(module.exports, {/* ... exports */})`, oppure `module.exports.method1 = method1; module.exports.method2 = method2; /* ... etc. */`. Ho usato il procedimento nel testo sia perchè è comunque molto usato nella programmazione contemporanea, sia perchè è un meccanismo facilmente comprensibile e memorizzabile.


{{< banner-description "Nel banner: Margaret Hamilton. Ha scritto parte del codice che girava sui computer di bordo della missione Apollo 11. In una famosa fotografia la si vede reggere la pila di fogli contenenti il listato (alta quanto lei) perchè non cada. Il codice era scritto in assembly, a mano su fogli di carta, e successivamente trasformato in schede perforate." >}}