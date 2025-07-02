
const data = 'global';

function outer () {
  this.data='outer';
  console.log('outer', data);
  function inner() {
    this.data = 'inner';
    console.log('inner', data);
  }
}

const outerObj = {
  data: 'outerObj',
  innerObj: {
    // data: 'innerObj',
  }
}
// new keyword functionality
function createUser (name, price) {
  this.name = name;
  this.price = price;
  return `${this.name}_${this.price}`
}

createUser.prototype.sayHello = function() {
  console.log('Hello ', this.name);
}

const user = createUser('sid', 23);
console.log(user);
createUser.prototype.sayHello();

// console.log(outer.inner.data);
// console.log(outerObj.innerObj.data);