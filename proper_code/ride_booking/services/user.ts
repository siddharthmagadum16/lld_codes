import Ride from '../entities/Ride';
import User from '../entities/User';
import NotificationService from './notification';


class UserService {

  private static users: User[];
  private static instance: UserService;
  private notificationService: NotificationService;

  private constructor() {
    UserService.users = [];
    this.notificationService = NotificationService.getInstance();
  }
  public static getInstance = (): UserService => this.instance ?? (this.instance = new UserService())

  public createUser = (name: string, phone: string): User => {
    const newUser = new User(name, phone);
    UserService.users.push(newUser);
    return newUser;
  }

  public notifyRideEnded = (ride: Ride) => {
    this.notificationService.notifyRideEnded(ride.getUser().getName(), ride.getPrice());
  }

  public notifyRideStarted = (ride: Ride) => {
    this.notificationService.notifyRideStarted(ride.getUser().getName(), ride.getDriver().getName());
  }
}

export default UserService;
