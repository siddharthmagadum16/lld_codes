#pragma once
#include "common.hpp"
#include <bits/stdc++.h>
using namespace std;

class Player {
private:
  string name;
  Token token;
public:
  Player(string name, Token token): name(name), token(token) {}

  pair<int,int> getMove();
  Token getToken();
  string getName();

};