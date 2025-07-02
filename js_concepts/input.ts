
import * as readline from 'readline';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

const readInput = (p: string) => new Promise(resolve => rl.question(p, resolve));

const func = async () => {
  const output = await readInput('whats your name: ');
  console.log(output);
  rl.close();
}
func();