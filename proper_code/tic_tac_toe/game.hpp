#pragma once
#include "common.hpp"
#include "board.hpp"
#include "player.hpp"
#include <bits/stdc++.h>
using namespace std;

class Game {
private:
  Board* board;
  Player* player1;
  Player* player2;

public:
  Game(string player1Name, string player2Name) {
    player1 = new Player(player1Name, Token::X);
    player2 = new Player(player2Name, Token::O);
    board = new Board();
  }
  Player* getNextPlayer(Player* player);
  void startGame();
  GameState getGameState();
  void endGame(GameState state);
};

