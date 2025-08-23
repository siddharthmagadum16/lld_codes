

class Resource {
  private resourceId: string;
  private data: string;

  constructor(rId: string, _data: string) {
    this.resourceId = rId;
    this.data = _data;
  }

  getId = (): string => this.resourceId;
  getData = (): string => this.data;
}

export default Resource;