#include <bits/stdc++.h>
#include "game.hpp"
using namespace std;


int main () {

  Game game("Siddharth", "Sonu");
  cout << "Press any key to start game: ";
  string ch;
  cin >> ch;
  game.startGame();


  return 0;
}