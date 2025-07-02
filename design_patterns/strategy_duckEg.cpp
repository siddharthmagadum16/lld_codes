#include <iostream>
using namespace std;



class IQuackBehaviour {
  public:
  virtual void quack() = 0;
};

class SimpleQuack: public IQuackBehaviour {
  public:
  void quack() {
    cout << "Simple Quack" << endl;
  }
};

class DeepQuack: public IQuackBehaviour {
  public:
  void quack() {
    cout << "Deep Quack" << endl;
  }
};


class IFlyBehaviour {
  public:
  virtual void fly() = 0;
};

class LowFly: public IFlyBehaviour {
  public:
  void fly() {
    cout << "Low fly" << endl;
  }
};

class HighFly: public IFlyBehaviour {
  public:
  void fly() {
    cout << "High fly" << endl;
  }
};


class Duck {
  IQuackBehaviour *quackStrategy;
  IFlyBehaviour *flyStrategy;
  public:
  Duck(string quack, string fly) {
    if (quack == "simple") quackStrategy = new SimpleQuack();
    if (quack == "deep") quackStrategy = new DeepQuack();
    if (fly == "low") flyStrategy = new LowFly();
    if (fly == "high") flyStrategy = new HighFly();
  }

  void quack () { quackStrategy->quack(); }
  void fly() { flyStrategy->fly(); }
};

int main () {

  Duck *duck = new Duck("simple", "high");
  duck->quack();
  duck->fly();
  return 0;
}

