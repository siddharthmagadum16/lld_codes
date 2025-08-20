import DeliveryService from "./services/delivery_service"
import DriverService from "./services/driver_service"



const demo = () => {

  const driverService = DriverService.getInstance();
  DeliveryService.setDriverServiceInstance(driverService);
  const deliveryService = DeliveryService.getInstance();

  driverService.addDriver('sid', 100);
  driverService.addDriver('raj', 200);
  driverService.addDriver('sam', 50);

  let endDate1 = new Date();
  let startDate1 = new Date();
  startDate1.setHours(startDate1.getHours() - 1);
  console.log('Current Delivery Cost: ', deliveryService.addDelivery(startDate1, endDate1, 'sid'));
  console.log('Total Delivery cost: ', deliveryService.getTotalDeliveryCost());

  let endDate2 = new Date('2025-08-20T21:30:00.000Z');
  let startDate2 = new Date('2025-08-20T20:00:00.000Z');
  console.log('Current Delivery Cost: ', deliveryService.addDelivery(startDate2, endDate2, 'raj'));
  console.log('Total Delivery cost: ', deliveryService.getTotalDeliveryCost());


  let endDate3 = new Date('2025-08-20T20:30:00.000Z');
  let startDate3 = new Date('2025-08-20T20:00:00.000Z');
  console.log('Current Delivery Cost: ', deliveryService.addDelivery(startDate3, endDate3, 'sam'));
  console.log('Total Delivery cost: ', deliveryService.getTotalDeliveryCost());

}

demo();

// tsx client.ts

/*

Food delivery companies employ tens of thousands of delivery drivers who each submit hundreds of deliveries per week. 
Delivery details are automatically sent to the system immediately after the delivery. Delivery drivers have different 
hourly payment rates, depending on their performance. Drivers can take on, and be paid for, multiple deliveries simultaneously. 
If a driver is paid $10.00 per hour, and a delivery takes 1 hour and 30 minutes, the driver is paid $15.00 for that delivery. 
We are building a dashboard to show a single number - the total cost of all deliveries - on screens in the accounting department offices.  

Write 3 functions for a delivery services to call. 1. Get driver hourly rate 2. Record a delivery 3. Calculate total cost of delivery for all drivers (WA, sde2) 
 
Given a Food Delivery Platform, write 3 methods where :- 
addDriver(driver_id,pay_per_hour)
recordDelivery(driver_id,start_time,end_time)
fetchTotalCostIncurredForAllDeliveries() (sde2)

*/