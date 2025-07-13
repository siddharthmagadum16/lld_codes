
import Board from "./Board";
import { Ladder, Snake } from "./Teleporter";
import Player from './Player';

const board = Board.getInstance();

const snakes = [
  new Snake(99, 52),
  new Snake(25, 10),
  new Snake(79, 43),
  new Snake(35, 12)
]

const ladders = [
  new Ladder(10, 20),
  new Ladder(28, 41),
  new Ladder(3, 23),
  new Ladder(66, 89)
]

const players = [
  new Player('sid'),
  new Player('sam'),
  new Player('raj'),
]


board.setup(players, snakes, ladders);

board.startGame();
