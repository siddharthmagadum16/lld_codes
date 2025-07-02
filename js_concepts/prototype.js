

Object.prototype.greet = function () {
  console.log('Hello')
}

String.prototype.trueLength = function () {
  console.log('Actual length is ', this.trim().length);
}

const str = 'Siddharth   '

console.log(str.length);
str.trueLength()