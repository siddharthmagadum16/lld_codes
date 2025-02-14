#include <bits/stdc++.h>
using namespace std;

enum Color {
  BLACK, WHITE
};

enum GameStatus {
  BLACK_WON, WHITE_WON, DRAW, ABORT, IN_PROGRESS, START
};

class Player {
  string name;
  Color color;
  // set<Piece>pieces;
public:
  Player(string &name, Color color): name(name), color(color) {

  }

  Position makeMove() {
    cin >> row >> col;
    return {row, col};
  }

  Color getColor() { return color; }
};

class Position {
  int row;
  int col;
}

class Piece {
  Position position;
  Chess chess;
  Color color;
public:
  Piece(Chess &chess, Position position, Color color): chess(chess), position(position), color(color) {}
  bool isKing() { return false; }
};

class Pawn: public Piece {

}
class King: public Piece {
public:
  bool isKing() { return true };
}
class Rook: public Piece {}


class ChessBoard {
  set<Piece>pieces;
  void initializeBoard() {}

public:
  ChessBoard() {
    initializeBoard();
  }

  Position getKingPosition(Player player) {
    for (Piece &piece: pieces) {
      if (piece.name == KING and piece.color == player.getColor()) {
        return piece.getPosition();
      }
    }
    throw error('something is wrong');
  }

  bool isCheck() {
    Position kingPos = getKingPosition();

  }

  bool isValidMove(Position &startPos, Position &destPos, Player &player) {
    // it checks if startPos and destPos are within bounds
    // check if startPos has player.getColor() color
    // checks if getPiece(dstPos).getColor() != player.getColor(); except castling.
    
  }
};

class Chess {
  Player pA, pB;
  ChessBoard board;
  GameStatus status;


public:
  Chess(Player player1, Player player2): pA(player1), pB(player2) {
    status(START);
    if (pA.color == BLACK) swap(pA, pB);
  }

  void start() {
    status = IN_PROGRESS;

    while(status != IN_PROGRESS) {
      Position dstPosition = {-1, -1};
      Position startPosition = {-1, -1};
      do {
       [startPosition, dstPosition] = pA.makeMove();
      } while(!isValidMove(startPosition, dstPosition, pA));
    }
  }


};



int main () {

  Player pA("sid", BLACK);
  Player pB("sam", WHITE);
  Chess chess(pA, pB);
  chess.start();

  return 0;
}