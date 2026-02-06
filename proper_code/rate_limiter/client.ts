import { User} from './entities/user'
import { RateLimiterService } from './services/RateLimiterService';

const user1 =  new User('userId1', 'ip1', 'deviceid1');
const user2 =  new User('userId2', 'ip2', 'deviceid2');


const rateService = new RateLimiterService();


console.log(rateService.apiWrapper(user1, '/api1', {}));
console.log(rateService.apiWrapper(user1, '/api1', {}));
console.log(rateService.apiWrapper(user1, '/api2', {}));
console.log(rateService.apiWrapper(user2, '/api1', {}));

setTimeout(() => {
  
  console.log(rateService.apiWrapper(user1, '/api1', {}));
}, 6000);
