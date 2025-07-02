function createUser(name, price) {
  this.name = name;
  this.price = price;
  return `${this.name}_${this.price}`
}

createUser.prototype.sayHello = function () {
  console.log('Hello ', this.name);
}


const user = createUser('sid', 23);
const user2 = new createUser('sid2', 230);
console.log(user, user2);
createUser.prototype.sayHello();
