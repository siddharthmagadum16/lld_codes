import { Floor } from "./entities/Floor";
import { Gate } from "./entities/Gate";
import { Spot } from "./entities/Spot";
import { Vehicle } from "./entities/Vehicle";
import { GateType, SpotType, VehicleType } from "./interface";
import { ParkingLotService } from "./services/ParkingLotService";


const sleep = (x: number) => new Promise((res, rej) => setTimeout(res, x*1000));

const parkingLotService = ParkingLotService.getInstance();


const spot01 = new Spot('SPOT01', SpotType.SMALL);
const spot02 = new Spot('SPOT02', SpotType.SMALL);
const spot03 = new Spot('SPOT03', SpotType.MEDIUM);
const spot04 = new Spot('SPOT04', SpotType.SMALL);

const spot11 = new Spot('SPOT11', SpotType.SMALL);
const spot12 = new Spot('SPOT12', SpotType.MEDIUM);
const spot13 = new Spot('SPOT13', SpotType.LARGE);
const spot14 = new Spot('SPOT14', SpotType.MEDIUM);

const spot21 = new Spot('SPOT21', SpotType.SMALL);
const spot22 = new Spot('SPOT22', SpotType.SMALL);
const spot23 = new Spot('SPOT23', SpotType.SMALL);
const spot24 = new Spot('SPOT24', SpotType.SMALL);



parkingLotService.floors = [
  new Floor([spot01,spot02,spot03,spot04]),
  new Floor([spot11,spot12,spot13,spot14]),
  new Floor([spot21,spot22,spot23,spot24])
];
const gate01 = new Gate('GATE01', GateType.ENTRY);
const gate02 = new Gate('GATE02', GateType.EXIT);
const gate03 = new Gate('GATE03', GateType.ENTRY);
const gate04 = new Gate('GATE04', GateType.EMERGENCY);

parkingLotService.gates = [
  gate01,
  gate02,
  gate03,
  gate04
]


const vehicle1 = new Vehicle('VEHICLE01',VehicleType.BIKE);
const vehicle2 = new Vehicle('VEHICLE02',VehicleType.CAR);
const vehicle3 = new Vehicle('VEHICLE03',VehicleType.TRUCK);
const vehicle4 = new Vehicle('VEHICLE04',VehicleType.TRUCK);

const ticket1 = parkingLotService.parkVehicle(vehicle1, gate01);
const ticket2 = parkingLotService.parkVehicle(vehicle2, gate03);

await sleep(2);
if (ticket1) {
  const ticket = parkingLotService.unparkVehicle(vehicle1, gate02);
  console.log('--Parking Cost::', ticket.cost, 'for vehicle: ', vehicle1.vehicleId);
}
await sleep(1);
if (ticket2) {
  const ticket = parkingLotService.unparkVehicle(vehicle2, gate02);
  console.log('--Parking Cost::', ticket.cost, 'for vehicle: ', vehicle2.vehicleId);
}


const ticket3 = parkingLotService.parkVehicle(vehicle3, gate01);
const ticket4 = parkingLotService.parkVehicle(vehicle4, gate03);

await sleep(3);
// if (ticket3) parkingLotService.unparkVehicle(vehicle3);
if (ticket3) {
  const ticket = parkingLotService.unparkVehicle(vehicle3, gate02);
  console.log('--Parking Cost::', ticket.cost, 'for vehicle: ', vehicle3.vehicleId);
}

parkingLotService.showAnalytics();