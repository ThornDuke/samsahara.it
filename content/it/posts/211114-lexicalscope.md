---
title: Il Lexical Scope
date: 2021-11-14
tags: ['scope']
toc: true
draft: false
show_reading_time: true
---

JavaScript usa un particolare modello per gestire l'accesso alle variabili, chiamato **lexical
scope**. È proprio il _lexical scope_ che consente al motore JavaScript di distinguere tra variabili
diverse ma con lo stesso nome, riconoscere variabili all'interno di funzioni o di cicli `for`,
accedere a variabili globali dall'interno di una funzione o di un blocco.

Vediamo come funziona.

## Il compilatore JavaScript

JavaScript è un linguaggio compilato. Prima della fase di esecuzione il codice passa per una fase di
vera e propria compilazione, suddivisa in tre sotto-fasi:

1.  **tokenizing/lexing**: il codice viene suddiviso in cellule indivisibili chiamate _tokens_,
    ognuna delle quali rappresenta un elemento significativo. Ad esempio, la linea

    ```javascript
    let animal = 'fox';
    ```

    viene suddivisa nei 5 tokens `let`, `animal`, `=`, `'fox'`, `;`.

2.  **parsing**: la lista di tokens viene organizzata in una struttura ad albero chiamata _abstract
    syntax tree_ (AST).
3.  **generazione del codice**: l'AST viene convertito in codice eseguibile.

È vero che il compilatore JavaScript non produce un file eseguibile e distribuibile
indipendentemente dal codice sorgente, come normalmente avviene con i linguaggi compilati, ma questo
non cambia la natura di JavaScript di essere un linguaggio compilato a tutti gli effetti.

Orbene, lo _scope_ viene creato proprio durante la fase di compilazione, da cui deriva il nome di
_lexical scope_ (da _tokenizing/lexing_), e resta immutabile durante l'esecuzione del programma.

## La creazione dello scope

Lo **scope** può essere definito come l'ambito all'interno del quale vigono certe regole di accesso
alle variabili. Abbiamo visto che viene creato durante la compilazione del codice e non viene più
modificato durante l'esecuzione del programma.

La struttura dello _scope_ è determinata dal modo con il quale vengono dichiarate le variabili, le
funzioni e i blocchi (`for`, `while`, ecc). Il procedimento è il seguente:

quando il compilatore inizia l'analisi del codice crea un _scope_ "globale": durante l'analisi del
codice il compilatore può incontrare variabili, funzioni, o blocchi:

- se incontra una nuova dichiarazione di variabile il compilatore la assegna allo _scope_ corrente,
  che in questo caso è quello globale;
- se invece incontra una dichiarazione di funzione o un blocco apre un nuovo _scope_ all'interno di
  quello corrente. Il nuovo _scope_ diventa quello corrente e tutte le nuove dichiarazioni di
  variabile vengono assegnate al nuovo scope;
- questo avviene fino alla chiusura dello _scope_ della funzione o del blocco (che solitamente
  avviene con la graffa di chiusura "`}`"). Lo _scope_ corrente non è più quello appena chiuso, ma
  quello precedente, ovvero quello all'interno del quale era stata aperta la funzione o il blocco.

### Variabili diverse con nomi uguali

Le variabili dichiarate in _scope_ diversi sono considerate sempre variabili diverse, anche se hanno
lo stesso nome. Quando il compilatore incontra una assegnazione di un valore ad una variabile deve
quindi determinare _quale_ variabile, tra le diverse con lo stesso nome dichiarate all'interno del
programma, riceverà l'assegnazione del valore.

Inizia quindi a cercare nello _scope_ corrente la dichiarazione di una variabile con quel nome; se
la trova ferma la ricerca ed esegue l'assegnazione, altrimenti continua la ricerca nello _scope
esterno_, quello all'interno del quale lo _scope_ corrente si trova ed è stato creato.

Questa ricerca (da uno _scope_ a quello esterno, a quello ancora più esterno) prosegue fino a quando
il compilatore arriva a cercare nello _scope_ globale, quello più esterno di tutti. Se non trova la
dichiarazione di variabile neanche lì allora solleva un errore.

Si noti che il compilatore effettua la ricerca sempre in linea retta e sempre verso _scope_ esterni
a quello corrente.

## Qualche esempio

```javascript
// inizio dello scope globale
let animal = 'fox';

function getAnimal() {
	// scope della funzione
	console.log('from inside the function:', animal);
}
// chiusa la funzione si chiude anche il suo scope;
// siamo tornati nello scope globale

getAnimal();
console.log('from outside the function:', animal);

// from inside the function: fox
// from outside the function: fox
```

All'inizio del programma il compilatore trova la variabile `animal`, che viene assegnata allo scope
globale. Subito dopo trova una dichiarazione di funzione alla quale assegna un nuovo scope, annidato
in quello globale; trova quindi una richiesta di valore ad una variabile effettuata dalla istruzione
`console.log`: il compilatore cerca la dichiarazione di variabile nello _scope_ corrente (quello
della funzione `getAnimal`) e non la trova. Inizia quindi a cercare nello scope immediatamente
esterno a quello della funzione e trova la formale dichiarazione `let animal = 'fox'`. All'interno
della funzione la variabile `animal` viene riconosciuta come quella dichiarata all'inizio del
programma e l'output delle ultime due righe lo conferma.

```javascript
let animal = 'fox';

function getAnimal() {
	let animal = 'horse';
	console.log('from inside the function:', animal);
}

getAnimal();
console.log('from outside the function:', animal);

// from inside the function: horse
// from outside the function: fox
```

Questo programma è quasi identico a quello precedente, l'unica differenza è che, quando il
compilatore inizia a cercare una dichiarazione di variabile cui assegnare il riferimento a `animal`
all'interno di `console.log`, lo trova subito nello _scope_ corrente, quindi interrompe la ricerca.
L'output alla fine del programma rende conto di questa differenza.

## Una trappola

Dunque se il compilatore trova una assegnazione a variabile, ma non trova una dichiarazione formale
di quella variabile nè nello _scope_ corrente nè in nessuno di quelli superiori, solleva un errore.

O meglio: _dovrebbe_ sollevare un errore. Purtroppo non è sempre così.

```javascript
function getAnimalName() {
	// viene assegnato un valore ad una variabile mai dichiarata:
	animal = 'fox';
}

getAnimalName();

console.log(animal);
// 'fox'
// ???
```

È un problema di cui JavaScript ha sempre sofferto: se si assegna un valore ad una variabile non
dichiarata, JavaScript crea silenziosamente una variabile con quel nome nello _scope_ globale, con
il concreto rischio di generare _bug_ insidiosi. Si può però costringere il compilatore a sollevare
un errore in presenza di qualunque variabile non formalmente dichiarata facendo girare il programma
(o la funzione) in _strict mode_.

```javascript
'use strict';

function getAnimalName() {
	// viene assegnato un valore ad una variabile mai dichiarata:
	animal = 'fox';
	// ReferenceError: la compilazione si ferma qui,
	// il programma non sarà eseguito.
}

getAnimalName();

console.log(animal);
```
