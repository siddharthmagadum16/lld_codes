import { ISubscriber } from '../interfaces/index'

class Supplier implements ISubscriber {
  
  notification(message: string): void {
    console.log('Stock alert:', message);
  }
}

export  { Supplier }