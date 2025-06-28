
class NotificationService {
  // constructor(private id: string, private message: string) { }

  private static instance: NotificationService;
  private constructor() { }
  public static getInstance = (): NotificationService => this.instance ?? (this.instance = new NotificationService())


  public static notify = (uid: string, message: string): void => {
    console.log(`🔔 [${uid}] ${message}`);
  }
}


export default NotificationService;