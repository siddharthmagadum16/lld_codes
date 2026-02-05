
console.log("start");
setTimeout(() => console.log("logged"), 5000);
console.log("end");
// Why doesnt the program exit before printing "logged"
// as there is a point when both callstack and 
// microtask,macrotask queues are empty
// due to longer timer duration?
// Ans: The event loop doesn’t decide “should I exit?” 
// by looking only at the queues. 
// It also tracks sources of future work