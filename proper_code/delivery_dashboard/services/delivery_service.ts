import Delivery from "../entities/Delivery";
import { IDeliveryService, IDriverService } from "../interfaces/interface";


class DeliveryService implements IDeliveryService {
  private static instance: DeliveryService;
  private static deliveries: Delivery[] = [];
  private static totalDeliveryCost = 0;

  private static driverServiceInstance: IDriverService | undefined;

  static getInstance = (): IDeliveryService => {
    if (!DeliveryService.instance) {
      DeliveryService.instance  = new DeliveryService();
    }
    return DeliveryService.instance;
  }

  static setDriverServiceInstance = (driverServiceInstance: IDriverService): void => {
    DeliveryService.driverServiceInstance = driverServiceInstance;
  }

  addDelivery(startTime: Date, endTime: Date, driverName: string): number {
    const deliveryTime:number = (+endTime - +startTime) / 1000;
    // console.log('deliveryTime: ', deliveryTime);
    const deliveryCost: number = deliveryTime * DeliveryService.driverServiceInstance!.getHourlyRateForDriver(driverName) / 3600;
    DeliveryService.totalDeliveryCost += deliveryCost;
    DeliveryService.deliveries.push(new Delivery(startTime, endTime, driverName));
    return deliveryCost;
  }

  getTotalDeliveryCost = (): number => {
    return DeliveryService.totalDeliveryCost;

  }
}

export default DeliveryService;