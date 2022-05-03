---
title: Closures
date: 2022-02-06
featured_image: 'gvr.jpg'
tags: ['closures']
toc: true
draft: false
show_reading_time: true
metatag: 'JavaScript programmazione avanzata, closures, scope'
---

Le _closures_ sono una caratteristica importantissima, addirittura _fondamentale_ nel moderno
JavaScript; il concetto di _closures_ attiene esclusivamente alle funzioni (non ci sono _closures_
senza funzioni), e descrive il fenomeno per il quale alcune variabili, dichiarate all'interno di
funzioni, sono accessibili anche all'esterno della funzione nella quale sono dichiarate. Questo
concetto sembra essere controintuitivo: in fondo una variabile è visibile solo all'interno dello
_scope_ nel quale è dichiarata, e una funzione apre e chiude un proprio scope. Dunque, come può
essere possibile che una variabile dichiarata all'interno di una funzione sia accessibile anche
all'esterno della funzione stessa?

## Una funzione può restituire una funzione

Vediamo un esempio, utile anche per osservare in azione il meccanismo delle _closures_.

```javascript
function getAnimal(animalId) {
	let animals = {
		1: 'wolf',
		2: 'horse',
		3: 'chicken',
		4: 'dog',
		5: 'octopus',
	};

	return function setVerse(verse) {
		return `${animals[animalId]} says '${verse}'`;
	};
}

let whatAnimalSays = getAnimal(5);

console.log(whatAnimalSays('bloubl')); // octopus says 'bloubl'

whatAnimalSays = getAnimal(3);

console.log(whatAnimalSays('yeeak')); // chicken says 'yeeak'
```

Vediamo cosa succede: la funzione `getAnimal` prima dichiara la variabile `animals`, un oggetto
contenente cinque nomi di animali indicizzati da 1 a 5, poi crea e restituisce la funzione
`setVerse` che accede alla variabile `animals` e ne legge un valore per costruire una stringa.

Il programma prosegue dichiarando la variabile `whatAnimalSays` che viene inizializzata alla
funzione restituita da `getAnimal`. `whatAnimalSays` viene infine passata a `console.log` per
verificarne l'output.

Come si può notare, i nomi di animale restituiti dalla funzione `setVerse` sono sempre diversi e
dipendono dal parametro passato a `getAnimal`; `setVerse` "ricorda" la variabile `animals` anche se
la funzione `getAnimal` è ormai chiusa così come il suo _scope_. In altre parole la funzione
`setVerse` _racchiude_ con se (_closure_) la variabile `animals` e accede ad essa anche se la
funzione `getAnimal` (creatrice sia di `animals` che di `setVerse`) non esercita più il suo
controllo di _scope_.

Vediamo un altro esempio che mostra il fenomeno dell'accesso ad una variabile dichiarata all'interno
di una funzione chiusa.

```javascript
function createColorRandomizer() {
	let colors = ['white', 'red', 'green', 'gray', 'blue', 'yellow', 'black', 'brown'];

	return function chooseColor() {
		let index = Math.floor(Math.random() * colors.length);
		return colors[index];
	};
}

let sprayer = createColorRandomizer();

console.log(sprayer()); // black
console.log(sprayer()); // blue
console.log(sprayer()); // green
```

Come prima, `sprayer` è una istanza di `chooseColor`; quest'ultima "racchiude in se" (_closure_) la
variabile `colors` e vi accede in lettura anche dal di fuori della funzione `createColorRandomizer`.

## Una closure può anche scrivere in una variabile

Finora abbiamo visto che che la _closure_ può accedere alle variabili in lettura; ma nulla impedisce
che possa accedervi anche in scrittura. L'esempio che segue è piuttosto famoso.

```javascript
function createCounter() {
	let counter = 0;

	return function incrementer() {
		counter += 1;
		return counter;
	};
}

let tickA = createCounter();
let tickB = createCounter();

console.log(tickA()); // 1
console.log(tickA()); // 2
console.log(tickA()); // 3
console.log(tickA()); // 4
console.log(tickB()); // 1
console.log(tickB()); // 2
console.log(tickB()); // 3
```

Qui `tickA` e `tickB` sono due istanze di `incrementer`; questa è una funzione che accede alla
variabile `counter`, _la incrementa di uno_ e ne restituisce il valore. Si noti come ogni volta che
viene chiamata la funzione `createCounter` venga creata _una nuova istanza_ di `counter`: `tickA` e
`tickB` non accedono allo stesso `counter` ma ognuna ad una variabile contatore diversa, come si può
verificare dall'output mandato dalle funzioni alla console.

{{< banner-description "Nel banner: Guido Van Rossum, creatore del linguaggio Python." >}}
