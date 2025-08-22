import { IDelivery, DeliveryStatus } from '../interfaces/IDelivery';

export class Delivery implements IDelivery {
  public readonly id: string;
  public readonly driverId: string;
  public readonly startTime: Date;
  public readonly endTime: Date;
  public readonly duration: number;
  public readonly cost: number;
  public status: DeliveryStatus;
  public readonly createdAt: Date;

  constructor(driverId: string, startTime: Date, endTime: Date, cost: number) {
    if (startTime >= endTime) {
      throw new Error('Start time must be before end time');
    }
    
    if (cost < 0) {
      throw new Error('Cost cannot be negative');
    }

    this.id = this.generateId();
    this.driverId = driverId;
    this.startTime = startTime;
    this.endTime = endTime;
    this.duration = this.calculateDuration(startTime, endTime);
    this.cost = cost;
    this.status = DeliveryStatus.ACTIVE;
    this.createdAt = new Date();
  }

  private generateId(): string {
    return `del_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private calculateDuration(startTime: Date, endTime: Date): number {
    const diffInMs = endTime.getTime() - startTime.getTime();
    return diffInMs / (1000 * 60 * 60); // Convert to hours
  }

  complete(): void {
    this.status = DeliveryStatus.COMPLETED;
  }

  cancel(): void {
    this.status = DeliveryStatus.CANCELLED;
  }

  isActive(): boolean {
    return this.status === DeliveryStatus.ACTIVE;
  }

  isCompleted(): boolean {
    return this.status === DeliveryStatus.COMPLETED;
  }

  isCancelled(): boolean {
    return this.status === DeliveryStatus.CANCELLED;
  }
}
