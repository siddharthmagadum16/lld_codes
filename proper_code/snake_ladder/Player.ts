

class Player {
  private name: string;
  private position: number;
  constructor(name: string) {
    this.name = name;
    this.position = 0;
  }

  changePosition(newPosition: number) {
    this.position = newPosition;
  }
  getPosition = () => this.position;

  getName = () => this.name;
};

export default Player;