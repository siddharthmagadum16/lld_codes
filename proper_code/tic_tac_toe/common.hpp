#pragma once
#include <bits/stdc++.h>
using namespace std;

enum class GameResult {
  PENDING,
  DRAW,
  PLAYER_1,
  PLAYER_2
};

enum class Token {
  X = 'X',
  O = 'O',
  Empty = '.'
};

ostream& operator<<(ostream &os, Token token);



struct GameState {
  bool isFinished;
  Token winnerToken;
  GameState(bool _isFinished = false, Token winToken = Token::Empty) {
    isFinished = _isFinished;
    winnerToken = winToken;
  }
};

