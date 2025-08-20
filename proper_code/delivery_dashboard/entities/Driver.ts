class Driver {
  constructor(private name: string, private hourlyRate: number) {}
  getHourlyRate = (): number => this.hourlyRate;
};

export default Driver;