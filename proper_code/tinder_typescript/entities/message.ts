
class Message {
  private text: string;
  private createdAt: Date;


  constructor(t: string) {
    this.text = t;
    this.createdAt = new Date();
  }

  getText = (): string => {
    return this.text;
  }
}