
class User {
  // ...
}


class Splitwise {
  IPayAdapter paymentService;
  map<Users, int>balance;

public:

  Splitwise(IPayAdapter service): paymentService(service) {}

  void settle (User a, User b, int rupees, int paise) {
    pay(a, b, rupees, paise)
  }
}

class IPayAdapter {
public:

  bool pay(User a, User b, int rupees, int paise) = 0;
}

class PayAdapter : public IPayAdapter {
  IService;
  map<string,IService*>serviceMapping;
public:
  pay(User a, User b, double rupees, int paise) {
    // transform logic
    string serviceName = a.servicePreferred;
    double amount = rupees + paise;
    IService service = new serviceMapping[serviceName];
    service.pay(a.accountNumber, b.accountNumber, amount);

  }
}


class IService {
public:
  send(int senderAcc, int receiverAcc, double amount) = 0;
}

class Stripe: IServiceApis {
public:
  send (int senderAcc, int receiverAcc, double amount) {
    // low level logic
  }
}

