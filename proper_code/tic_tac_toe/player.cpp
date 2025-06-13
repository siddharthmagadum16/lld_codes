#include "player.hpp"
#include <bits/stdc++.h>
using namespace std;


pair<int,int> Player::getMove() {
  int row, col;
  cout << "Hi " + name + ", Type [row][col] to make move:: ";
  cin >> row >> col;
  return {--row, --col};
}

Token Player::getToken() {
  return token;
}

string Player::getName() {
  return name;
}