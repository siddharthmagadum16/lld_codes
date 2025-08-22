export interface IDelivery {
  id: string;
  driverId: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in hours
  cost: number;
  status: DeliveryStatus;
  createdAt: Date;
  
  // Methods that the Delivery entity implements
  complete(): void;
  cancel(): void;
  isActive(): boolean;
  isCompleted(): boolean;
  isCancelled(): boolean;
}

export enum DeliveryStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface IDeliveryService {
  recordDelivery(driverId: string, startTime: Date, endTime: Date): Promise<IDelivery>;
  getDelivery(deliveryId: string): Promise<IDelivery | null>;
  getDeliveriesByDriver(driverId: string): Promise<IDelivery[]>;
  getAllDeliveries(): Promise<IDelivery[]>;
  cancelDelivery(deliveryId: string): Promise<void>;
}
