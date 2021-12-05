---
title: 'Hoisting'
date: 2021-12-05
tags: ['scope', 'hoisting']
toc: true
draft: false
show_reading_time: true
---

Ogni variabile o dichiarazione di funzione ha un proprio ambito di visibilità e utilizzabilità
(_scope_). Ma all’interno di uno scope una data variabile o funzione è visibile e accessibile anche
_prima_ della sua formale dichiarazione. E’ il meccanismo dello _hoisting_.

## Cosa è

_To hoist_ in inglese significa sollevare qualcosa di pesante, a volte con appositi strumenti o
corde; issare. In JavaScript è il meccanismo con il quale il compilatore (durante la fase del
_parsing_) raccoglie tutte le dichiarazioni di funzione e di variabile trovate in uno _scope_ e le
sposta all’inizio dello _scope_ stesso, in modo da poterle usare per tutti i riferimenti e le
assegnazioni successive.

Questo significa che una certa variabile o funzione è accessibile e utilizzabile anche _prima_ che
sia stata dichiarata. Esempio:

```javascript
getFruit();

function getFruit() {
	console.log('Here you are a pineapple');
}
```

Questo codice funziona come ci si aspetta, la chiamata a `getFruit()` restituisce una stringa nella
console anche se la funzione chiamata è definita solo successivamente.

## Come funziona

L’hoisting funziona in modo lievemente diverso a seconda che si tratti di dichiarazioni di funzione,
di variabili dichiarate con `var`, o ancora di variabili dichiarate con `let` o `const`.

### Dichiarazioni di funzione

Quando il compilatore JavaScript trova una dichiarazione di funzione crea all’inizio dello _scope_
una dichiarazione di variabile con lo stesso nome della funzione e automaticamente inizializza la
variabile con un puntatore alla stessa funzione. Poiché questa dichiarazione viene collocata
all’inizio dello _scope_ tutte le successive chiamate a quella funzione avranno un riferimento
prestabilito.

Una particolarità da tenere presente è che nel caso delle funzioni lo _scope_ all’inizio del quale
viene spostata la dichiarazione è quello della funzione immediatamente raggiungibile (o quello
globale), non lo _scope_ del blocco `for` o `while`.

```javascript
function fruitList() {
	let foods = ['banana'];

	for (let food of foods) {
		function getFruit() {
			console.log(`Here you are a ${food}`);
		}
	}

	getFruit();
}

fruitList(); // Here you are a banana
```

In questo esempio la chiamata a `getFruit()` viene fatta all’interno della funzione ma, anche se la
dichiarazione avviene all’interno di un blocco `for...of`, la chiamata ha successo in quanto il
compilatore ha 'sollevato' (_hoisted_) la dichiarazione di variabile `getFruit` all’inizio dello
_scope_ di `fruitList()` e la ha immediatamente inizializzata come puntatore a funzione.

### Dichiarazioni di variabile con var

Anche le dichiarazioni di variabili `var` vengono spostate all’inizio dello _scope_ (_scope_ di
funzione e non di blocco, proprio come per le funzioni). Ma le variabili `var` 'hoisted' vengono
inizializzate a `undefined`, a differenza che per le funzioni che sono immediatamente utilizzabili.

```javascript
console.log(smartAnimal); // undefined

var smartAnimal = 'horse';

console.log(smartAnimal); // horse
console.log(dumbAnimal); // reference error: dumbAnimal is not defined
```

In questo esempio la dichiarazione della variabile `smartAnimal` viene spostata all’inizio dello
_scope_. La chiamata da parte di `console.log` infatti trova una variabile con quel nome ma ad essa
è stato assegnato il valore `undefined`; subito dopo viene effettuata l’assegnazione di un valore
('horse') alla variabile; la successiva chiamata da parte di `console.log` dimostra che adesso la
variabile è inizializzata ad un valore.

Infine `console.log` prova a usare una variabile mai creata, neanche successivamente. Qui non c’è
_hoisting_ che tenga: non c’è nulla da spostare all’inizio dello _scope_ e quindi il compilatore
solleva un errore.

Una cosa interessante (ma del tutto conseguente a quanto abbiamo visto finora) avviene se proviamo
ad utilizzare una funzione assegnata ad una variabile dichiarata con `var`.

```javascript
getFruit(); // TypeError: getFruit is not a function
getCity(); // NewYork

var getFruit = function () {
	console.log('Here you are an orange');
};

function getCity() {
	console.log('New York');
}
```

In questo caso la dichiarazione di `getFruit` viene spostata all’inizio dello _scope_, e quindi è
utilizzabile; ma essendo una dichiarazione fatta con `var` il compilatore la inizializza a
`undefined`. Questo è il motivo per cui viene restituito un `TypeError`: il compilatore trova una
variabile `getFruit` ma non la riconosce come una funzione. Se invece avessimo dichiarato `getFruit`
direttamente come funzione il compilatore avrebbe immediatamente (come abbiamo visto nel capitolo
precedente) inizializzato la variabile 'sollevata' a funzione, e la chiamata avrebbe dato il
risultato corretto (come avviene per la chiamata a `getCity`).

A questo punto il meccanismo di _hoisting_ mostrato nel codice seguente è chiaro:

```javascript
console.log(getFruit); // undefined

getCity(); // NewYork

var getFruit = function () {
	return 'Here you are an orange';
};

console.log(getFruit()); // Here you are an orange

function getCity() {
	console.log('New York');
}
```

`getFruit` viene dichiarata alla riga 5 con `var`; viene quindi sollevata all'inizio dello _scope_ e
inizializzata a `undefined`, e la prima riga del codice lo conferma. Alla riga 5 alla variabile
`getFruit` viene assegnata una funzione, e infatti adesso l'istruzione `console.log` alla riga 9,
pur uguale a quella alla riga 1, restituisce la stringa corretta. La chiamata a `getCity` alla riga
3, invece, restituisce subito una stringa nella console in quanto la variabile `getCity` viene
dichiarata direttamente come funzione, seppure alla fine del programma.

### Dichiarazioni di variabili con let e const

`let` e `const` sono acquisizioni piuttosto recenti all'armamentario degli strumenti per lo sviluppo
in JavaScript: e infatti, pur avendo la funzione di dichiarare variabili come `var` e `function`,
hanno un comportamento alquanto diverso dai loro predecessori:

1. per inizializzare una variabile `var` è sufficiente una assegnazione; l'unico modo per
   inizializzare una variabile `let` o `const` è con una assegnazione collegata ad una istruzione di
   dichiarazione.
2. Le variabili `var`, dopo essere state 'sollevate' all'inizio dello _scope_ corrente, vengono
   automaticamente inizializzate a `undefined`; le variabili `let` e `const` non vengono
   inizializzate dopo l'hoisting e rimangono inaccessibili fino al momento in cui vengono
   formalmente dichiarate.
3. Le variabili `var` e `function` vengono 'sollevate' all'inizio del più vicino _scope_ di
   funzione, ma non di blocco; le variabili dichiarate con `let` e `const` vengono sollevate
   all'inizio dello _scope_ corrente, anche se questo fosse uno _scope_ di blocco.
4. Da ultimo, le variabili `var` possono essere _ridichiarate_ all'interno dello stesso scope, con
   un effetto praticamente nullo; le variabili `let` o `const` non possono essere ridichiarate,
   risultandone altrimenti la restituzione di un errore da parte del compilatore.

Approfondiamo i primi due punti:

```javascript
console.log(smartAnimal);
// ReferenceError: Cannot access 'smartAnimal' before initialization

let smartAnimal = 'dog';
```

In questo caso il compilatore JavaScript restituisce un errore in quanto la variabile 'smartAnimal'
non è stata ancora inizializzata; si badi: il compilatore _sa_ che la variabile esiste all'interno
dello _scope_, ma non la considera accessibile in quanto non ancora inizializzata. Proviamo allora a
inizializzarla prima di usarla:

```JavaScript
smartAnimal = 'dog';
// ReferenceError: Cannot access 'smartAnimal' before initialization

console.log(smartAnimal);

let smartAnimal;
```

Ma anche qui viene restituito lo stesso errore, e proprio nel momento in cui si cerca di
inizializzare la variabile con la stringa 'dog'.

### La TDZ

Il punto è che le variabili `let` e `const` vengono considerate 'disponibili' e 'accessibili' da
parte del compilatore solo nel momento in cui vengono formalmente dichiarate con le istruzioni `let`
o `const`. In altre parole le variabili `let` e `const` vengono 'sollevate' all'inizio dello _scope_
in cui sono create, e perciò considerate _esistenti_, ma diventano anche _accessibili_ solo nel
momento in cui vengono formalmente dichiarate. La finestra temporale in cui una variabile `let` o
`const` è 'esistente' ma non 'accessibile' viene chiamata _Temporal Death Zone_ (TDZ).

Vediamo il codice:

```JavaScript
var bigAnimal = 'elephant';

{
	console.log(bigAnimal);
	// ReferenceError: Cannot access 'bigAnimal' before initialization

	let bigAnimal = 'whale';
}
```

In questo caso la variabile `bigAnimal` viene inizializzata all'inizio del programma con la stringa
'elephant'; ciononostante viene sollevato un errore nel momento in cui si cerca di accedervi.

Il punto è che all'interno del blocco c'è un'altra variabile `bigAnimal` che viene dichiarata con
`let`, che pertanto viene 'sollevata' all'inizio del blocco corrente _ma non inizializzata_; questa
nuova variabile quindi 'eclissa' la prima agli occhi del compilatore il quale giustamente ci
notifica di non poter accedere a `bigAnimal` in quanto non ancora inizializzata.

Si tratta di un errore dovuto proprio alla presenza di una TDZ tra il momento in cui una variabile è
semplicemente _esistente_ e il momento in cui è invece effettivamente _accessibile_.

## Conclusioni

L'_hoisting_ è un comportamento complesso del compilatore JavaScript, reso ancora più criptico dal
fatto di gestire in modo molto diverso le variabili e le funzioni a seconda di come e quando vengono
dichiarate. La _Temporal Death Zone_, conseguenza diretta del meccanismo di _hoisting_, pure incide
in modo molto diverso sulla gestione dei vari tipi di variabile. Tutta questa complessità e
disomogeneità di comportamento può certamente essere fonte di errori insidiosi e difficilmente
individuabili.

L'unico modo per cercare di evitare questi errori sembra essere quello di dichiarare tutte le
variabili e le funzioni _all'inizio_ dello _scope_ di riferimento, riducendo al minimo il lavoro di
_hoisting_ da parte del compilatore e azzerando la durata della TDZ.
