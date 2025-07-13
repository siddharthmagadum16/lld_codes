
interface Teleporter {

  getDestination(): number;
  getOrigin(): number;
}

class Snake implements Teleporter {
  private head: number;
  private tail: number;

  constructor(_head: number, _tail: number) {
    this.head = _head;
    this.tail = _tail;
  }

  getDestination(): number {
    return this.tail;
  }
  getOrigin(): number {
    return this.head;
  }
}


class Ladder implements Teleporter {
  private start: number;
  private end: number;

  constructor(_start: number, _end: number) {
    this.start = _start;
    this.end = _end;
  }

  getDestination(): number {
    return this.end;
  }
  getOrigin(): number {
    return this.start;
  }
}

export {
  Snake,
  Ladder,
  Teleporter,
}