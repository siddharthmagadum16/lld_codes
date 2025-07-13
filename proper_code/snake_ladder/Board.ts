import { Dice } from "./Dice";
import { Ladder, Snake, Teleporter } from "./Teleporter";
import Player from './Player';

class Board {

  private static readonly instance: Board = new Board();
  private players: Player[] = [];
  private teleporterByOrigin: Map<number, Teleporter> = new Map<number, Teleporter>();
  private isGameOver: boolean = false;
  private diceInstance: Dice;

  private constructor() {
    this.diceInstance = Dice.getInstance();
  }

  static getInstance = () => Board.instance;

  setup = (players: Player[], snakes: Snake[], ladders: Ladder[]) => {

    this.players = players;
    snakes.forEach((snake:Snake) => {
      this.teleporterByOrigin.set(snake.getOrigin(), snake);
    })
    ladders.forEach((ladder:Ladder) => {
      this.teleporterByOrigin.set(ladder.getOrigin(), ladder);
    })
  }

  declareWinner = (player: Player) => {
    console.log('Game Over');
    console.log('Winner is: ', player.getName(), 'Congrats!');
    this.isGameOver = true;
  }

  startGame() {

    let currPlayerIndex:number = 0;

    while (!this.isGameOver) {

      const diceValue = this.diceInstance.rollDice();
      let player: Player = this.players[currPlayerIndex];
      const currPos = player.getPosition();
      let newPos = currPos + diceValue;

      if (this.teleporterByOrigin.has(newPos)) {
        newPos = this.teleporterByOrigin.get(newPos)!.getDestination();
      }

      if (newPos > 100) {
        console.log('Out of bounds position, cannot move to', newPos);
      }
      else {
        player.changePosition(newPos);
        if (newPos == 100) {
          return this.declareWinner(player);
        }
      }
      currPlayerIndex = (currPlayerIndex + 1) % this.players.length;
      const playerPositions = this.players.map((player:Player) => player.getPosition()).join(', ');
      console.log(playerPositions);
    }
  }

}

export default Board;