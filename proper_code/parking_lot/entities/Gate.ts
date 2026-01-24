import { GateType } from "../interface";

class Gate {
  constructor(public gateId: string, public gateType: GateType) {}
};

export {
  Gate,
}
