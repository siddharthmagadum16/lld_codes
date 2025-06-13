#include "game.hpp"
#include <bits/stdc++.h>
using namespace std;

Player* Game::getNextPlayer(Player* player) {
  return player->getToken() == player1->getToken() ? player2 : player1;
}

void Game::startGame() {
  GameState state;
  Player* currPlayer = player1;
  do {
    board->printBoard();
    pair<int,int>move = currPlayer->getMove();
    board->makeMove(move, currPlayer->getToken());

    currPlayer = getNextPlayer(currPlayer);
    state = board->getGameState();
  } while (not state.isFinished);
  endGame(state);
}

void Game::endGame(GameState state) {
  board->printBoard();
  if (state.winnerToken == Token::Empty) {
    cout << "Game over: It's a DRAW" << endl;
  }
  else {
    string winnerName = player1->getToken() == state.winnerToken ? player1->getName() : player2->getName();
    cout << "Game over: Winner is : " << winnerName << endl;
  }
}
