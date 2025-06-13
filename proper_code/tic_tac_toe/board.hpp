#pragma once
#include "common.hpp"
#include <bits/stdc++.h>
using namespace std;


class Board {
private:
  Token board[3][3];
public:
  Board() {
    fill_n(&board[0][0], 9, Token::Empty);
  }
  void makeMove(pair<int,int>move, Token Token);
  GameState getGameState();
  Token getWinningToken();
  void printBoard();
};

