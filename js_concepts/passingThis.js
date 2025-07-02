

function setUsername (name) {
  console.log('setting name', name);
  this.name = name;
}

function createUser (name, email) {
  this.email = email;
  setUsername.call(this, name);
  // setUsername.(this, name); // doesnt work
}


const chai = new createUser('sid', 'sdi16@gmail.com');
console.log(chai);


/*
In JavaScript, .call() is a method available on all function instances. It's used to invoke a function with a
 specified this value and arguments provided individually.

The syntax is functionName.call(thisArg, arg1, arg2, ...);,
where thisArg is the desired this value and arg1, arg2, ... are individual arguments for the function.
*/