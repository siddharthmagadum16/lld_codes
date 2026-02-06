import { User } from '../entities/user'
import { SlidingWindowLogStrategy } from '../stratergies/SlidingWindowLogStrategy'


// StratergySelector
// {
//   userID: [TocketBucket]
//   ipId: [TocketBucket]
//   ()
// }

enum RateLimitingId {
  USER_ID = "userId",
  DEVICE_ID = "deviceId"
}

enum StratergyType {
  SLIDING_WINDOW_LOG = 'SLIDING_WINDOW_LOG'
}

class StratergySelector {

  public static stratergies: Map<RateLimitingId, Map<StratergyType, any>>;

  constructor() {

    StratergySelector.stratergies = new Map([
      [RateLimitingId.USER_ID, new Map([[StratergyType.SLIDING_WINDOW_LOG, new SlidingWindowLogStrategy(2, 5)]])],
      // [RateLimitingId.DEVICE_ID, new Map([[StratergyType.TOCKEN_BUCKET, new TockenBucketSTratergy(2, 5)]])] 
    ])
  }
}

class RateLimiterService {

  
  public constructor () {
    
  }
  apiWrapper(user: User, apiName: string, apiParams:any) {

      const userId = user[RateLimitingId.USER_ID];
      const stratergy = StratergySelector.stratergies.get(RateLimitingId.USER_ID)?.get(StratergyType.SLIDING_WINDOW_LOG)!;

      if (!stratergy) {
        console.log("no stratergy found", stratergy)
      }
      const isAllowed = stratergy.isRequestAllowed(userId, apiName);
      // console.log("isallowed: ", isAllowed);
      return isAllowed;
  }
}


/*
const isAllowedList = RateLimitingId.values().map(idType => {
})
isAllowedList.some()
*/

export { RateLimiterService }
