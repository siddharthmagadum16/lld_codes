
class User {
  public userId: string;
  public ip: string;
  public deviceId: string;

  public constructor(_userId: string, _ip: string, _deviceId: string) {
    this.userId  = _userId
    this.ip  = _ip
    this.deviceId  = _deviceId
  }
}

export { User }