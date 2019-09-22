var Rx = require('rxjs');
var RxOperators = require('rxjs/operators');

console.log('Example 1 - The simplest observable you can create is one with a single value.');
const stream1A$ = Rx.of(2);
stream1A$.subscribe(console.log); // prints 2

console.log('Example 2 - Concatenation of 2 streams of values.');
const stream2A$ = Rx.of(2, 5, 10);
const stream2B$ = Rx.of(4);
const stream2C$ = Rx.concat(stream2A$, stream2B$)
                    .pipe(RxOperators.reduce((x, y) => {
                        // console.log("x=" + x + ", y=" + y);
                        return x + y;
                    }));
stream2C$.subscribe(console.log); // prints 21


console.log('Example 3 - From an iterable.');
const stream3A$ = Rx.from([10, 20, 30]);
stream3A$.subscribe(console.log); // prints 10 20 30


console.log('Example 4 - Unsubscribe and dispose the stream.');
const stream4A$ = Rx.interval(500)
  .pipe(
      RxOperators.take(5),
      RxOperators.map(x => x + 1));
const subscriber4A$ = stream4A$.subscribe(
    tick => console.log(`${tick} tick`),
    error => console.error(`Error: ${error}`),
    () => console.log('Example 4 completed!'));
// subscriber4A$.unsubscribe();

console.log('Example 5 - Filter out odd numbers, compute their square, and sum them.');
var array = [1, 2, 3, 4, 5];
Rx.from(array)
  .pipe(
    RxOperators.filter(x => (x%2) === 0),
    RxOperators.map(x => x * x),
    RxOperators.reduce((x, y) => x + y))
  .subscribe(console.log); // prints 20

console.log('Example 6 - Same as the previous, but more declarative.');
// Observables allow you to sequence and chain
// operators together very f luently while abstracting the problem of
// latency and wait-time away from your code. Notice that this way of
// writing code also eliminates the complexity involved in looping and
// conditional statements in favor of higher-order functions.
const even = x => (x % 2) === 0;
const square = x => x * x;
const sum = (a, b) => a + b;

Rx.from(array)
  .pipe(
    RxOperators.filter(even),
    RxOperators.map(square),
    RxOperators.reduce(sum))
  .subscribe(console.log); // prints 20


console.log('Example 7 - from a URL');
var rp = require('request-promise');
const user = Rx.of('http://api.github.com/users')
                .pipe(
                    RxOperators.flatMap(
                        url => 
                        Rx.from(
                            rp(
                                {
                                    uri: url,
                                    headers: { 'User-Agent': 'Request-Promise' },
                                    json: true // Automatically parses the JSON string in the response
                                }
                            )
                        )
                    ),
                    RxOperators.concatMap(response => Rx.from(response)),
                    RxOperators.map(user => user.login))
                .subscribe(console.log);


// https://dev.to/sagar/reactive-programming-in-javascript-with-rxjs-4jom