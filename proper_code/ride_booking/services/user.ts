import Ride from '../entities/Ride';
import User from '../entities/User';
import NotificationService from './notification';


class UserService {

  private static users: User[];

  private static instance: UserService;
  private constructor() {
    UserService.users = [];
  }
  public static getInstance = (): UserService => this.instance ?? (this.instance = new UserService())

  public createUser = (name: string, phone: string): User => {
    const newUser = new User(name, phone);
    UserService.users.push(newUser);
    return newUser;
  }

  public notifyRideEnded = (ride: Ride) => {
    NotificationService.notify(ride.getUser().getName(), 'Your ride has ended. Kindly pay ' + ride.getPrice() + 'INR')
  }

  public notifyRideStarted = (ride: Ride) => {
    NotificationService.notify(ride.getUser().getName(), 'Your ride has started. Driver\s name is ' + ride.getDriver().getName())

  }
}

export default UserService;
