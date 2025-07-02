/* https://p.ip.fi/iYhp
use case: whenever there is a data change happening and many multiple tasks should be carried out.

in other way - when a publisher publishes an event, all subscribers for a topic consume it

UML diagram - https://imgur.com/a/0eoz9aT


checkout this YT short too - https://youtube.com/shorts/K1HHbKJvcv8?si=3S2rBVvjbFxzT1dK (no need of below interface)

to extend this further as a followup, there can be push or pull type of Subject(observerable)


Here Group class is Subject (observable), and User is observer

*/

#include <iostream>
#include <set>
#include <string>

using namespace std;

class ISubscriber {
  protected:
    string name;
  public:
    virtual void notify(string message) = 0;
};

class User: public ISubscriber {
  public:
    User(string name) {
      this->name = name;
    }
    void notify(string message) {
      cout << name << " is notified about: " << message << "\n";
    }
};
// there can be different implementation of ISubscriber to subscribe other than use User class

class Group {
  private:
    set<ISubscriber*> subscribers;
  public:
    void addSubscriber(ISubscriber &sub) {
      subscribers.insert(&sub);
    }

    void removeSubscriber (ISubscriber &sub) {
      subscribers.erase(&sub);
    }

    void notify(string message) {
      for (ISubscriber* sub: subscribers) {
        sub->notify(message);
      }
    }
};

int main () {

  Group g;

  User user1("sid");
  User user2("mom");
  User user3("sonu");

  g.addSubscriber(user1);
  g.addSubscriber(user2);
  g.addSubscriber(user3);

  g.notify("message1");

  g.removeSubscriber(user3);

  g.notify("message2");

  return 0;

}

