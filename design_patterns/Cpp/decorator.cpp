#include <iostream>
using namespace std;


class Beverage {
public:
  virtual int cost() = 0;
};

class Expresso: public Beverage {
public:
  int cost () override {
    return 10;
  }
};

class Latte: public Beverage {
public:
  int cost () override {
    return 20;
  }
};

class AddonDecorator: public Beverage {
public:
  Beverage* beverage;
  AddonDecorator(Beverage *b): beverage(b) {}
  virtual int cost () = 0;
};

class Caramel: public AddonDecorator {
public:
  int cost () override {
    return this->beverage->cost() + 1;
  }
  Caramel(Beverage *b): AddonDecorator(b) {};
};

class Choco: public AddonDecorator {
public:
  int cost () override {
    return this->beverage->cost() + 2;
  }
  Choco(Beverage *b): AddonDecorator(b) {};
};

int main () {

  Beverage* b = new Choco(new Latte());
  cout << b->cost() << endl;
  return 0;
}