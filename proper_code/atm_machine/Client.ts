import { MachineState } from "./enums/enum";
import { Card } from "./models/Card";
import { AtmMachineService } from "./services/AtmMachineService";



const atmMachineServiceInst = AtmMachineService.getInstance();


const card1 = new Card(1234567890, 934);
const card2 = new Card(1234567891, 932);

atmMachineServiceInst.insertCard(card1);
atmMachineServiceInst.selectOption(MachineState.ENTER_AMOUNT_TO_WITHDRAW);
atmMachineServiceInst.submitAmountEntered(600);
atmMachineServiceInst.submitAtmPin(9832);


// atmMachineServiceInst.insertCard(card1);