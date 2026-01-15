
/* promise all */
const p1 = Promise.resolve("Success 1");
const p2 = Promise.resolve("Success 2");

Promise.all([p1, p2])
    .then(console.log)
    .catch(console.error)
    .finally(() => console.log('PROMISE.ALL'))

// Output: ["Success 1", "Success 2"]


/* promise allSettled */
const p11 = Promise.resolve("Success");
const p22 = Promise.reject("Error");
const p33 = new Promise((res, rej) => rej('Error2'))

Promise.allSettled([p11, p22, p33])
    .then(console.log)
    .finally(() => console.log('PROMISE.ALLSETTLED'))


/* Output: 
[
  { status: "fulfilled", value: "Success" },
  { status: "rejected", reason: "Error" },
  { status: "rejected", reason: "Error2" }
]
*/


/* promise race */
const fast = new Promise((res, rej) => setTimeout(() => rej("FastErr"), 100));
const slow = new Promise(res => setTimeout(() => res("Slow"), 500));

Promise.race([fast, slow])
    .then(console.log)
    .catch(console.error)
    .finally(() => console.log('PROMISE.RACE'))



/* promise any */
const t1 = Promise.reject("Fail 1");
const t2 = Promise.resolve("First Success");
const t3 = Promise.resolve("Second Success");

Promise.any([t1, t2, t3])
    .then(console.log)
    .catch(console.error)
    .finally(() => console.log('PROMISE.ANY'))
// Output: "First Success"
/* throws aggregate error when all rejected
[AggregateError: All promises were rejected] {
  [errors]: [ 'Fail 1', 'First Success', 'Second Success' ]
}
*/



async function run() {
    await new Promise(resolve => setTimeout(resolve, 1000));
    Promise.resolve("Done").then(console.log); // Output: "Done"
    Promise.reject("Fail").catch(console.error); // Output: "Fail"
}

run();

export { }