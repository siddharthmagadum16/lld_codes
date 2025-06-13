#include "board.hpp"
#include <bits/stdc++.h>
using namespace std;


void Board::makeMove(pair<int,int>move, Token token) {
  int row = move.first;
  int col = move.second;
  board[row][col] = token;
}

GameState Board::getGameState() {

  for (int i = 0, cnt = 0; i < 3; ++ i, cnt = 0) {
    for (int j = 1; j < 3; ++ j) {
      if (board[i][j] == board[i][j - 1]) ++ cnt;
    }
    if (cnt == 2 and board[i][0] != Token::Empty) return GameState(true, board[i][0]);
  }
  for (int j = 0, cnt = 0; j < 3; ++ j, cnt = 0) {
    for (int i = 1; i < 3; ++ i) {
      if (board[i-1][j] == board[i][j]) ++ cnt;
    }
    if (cnt == 2 and board[0][j] != Token::Empty) return GameState(true, board[0][j]);
  }
  int cnt1 = 0, cnt2 = 0;
  for (int i = 1; i < 3; ++ i) {
    if (board[i][i] == board[i - 1][i - 1]) ++ cnt1;
  }
  if (cnt1 == 2 and board[1][1] != Token::Empty) return GameState(true, board[1][1]);
  for (int i = 0, j = 2; i < 2; ++i, -- j) {
    if (board[i][j] == board[i + 1][j - 1]) ++ cnt2;
  }
  if (cnt2 == 2 and board[1][1] != Token::Empty) return GameState(true, board[1][1]);

  for (int i = 0; i < 3; ++ i) {
    for (int j = 0; j < 3; ++ j) {
      if (board[i][j] == Token::Empty) return GameState(false);
    }
  }
  // printBoard();
  return GameState(true);
}

void Board::printBoard() {

  for (int i = 0; i < 3; ++ i) {
    for (int j = 0; j < 3; ++ j) {
      cout << board[i][j];
    }
    cout << endl;
  }
}