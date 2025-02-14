#include <iostream>
#include <mutex>
#include <thread>
using namespace std;


class Logger {
  static mutex mtx;
  static Logger* instance;
  static int cntr;
  Logger () {
    cout << "constructor called " << ++cntr << " times" << endl;
  }
  Logger (const Logger&) = delete;
  Logger operator=(const Logger &) = delete;
public:
  static Logger* getSingleton() {

    if (instance == nullptr) {
      mtx.lock();
      if (instance == nullptr) {
        instance = new Logger();
      }
      mtx.unlock();
    }
    return instance;
  }
};

int Logger::cntr = 0;
Logger* Logger::instance = nullptr;
mutex Logger::mtx;
void createLogger1 () {
  Logger* log = Logger::getSingleton();

}

void createLogger2 () {
  Logger* log = Logger::getSingleton();

}

int main () {

  thread t1(createLogger1);
  thread t2(createLogger2);

  t1.join();
  t2.join();
  return 0;
}



// what is the difference between below to inh