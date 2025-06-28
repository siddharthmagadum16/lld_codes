
// 1 hr 30 mins thinking, 30mins implementation


class User  {
  private name: string;
  private phone: string;
  public constructor(name: string, phone: string) {
    this.name = name;
    this.phone = phone;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getPhone(): string {
    return this.phone;
  }

  public setPhone(phone: string): void {
    this.phone = phone;
  }
}

export default User;