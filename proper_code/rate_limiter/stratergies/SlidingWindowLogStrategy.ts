class SlidingWindowLogStrategy implements RateLimitingStratergy {
  private data: Map<string, Map<string, Date[]>> = new Map(); // < id, <api, context>>
  private maxReqsThreshold: number;
  private timeWindow: number;
  public constructor(_maxReqsThreshold: number, _timeWindow: number) {
    this.maxReqsThreshold = _maxReqsThreshold;
    this.timeWindow = _timeWindow;

  }
// [d1,d2,d3]
  getLogsOfSlidingWindow(logs: Date[], currDate: Date): Date[] {
    return logs.filter(log => (+currDate - +log) < this.timeWindow * 1000);
  }

  public isRequestAllowed (uid: string, apiUrl: string): boolean {
    const currDate = new Date();
    const prevAllowedReqLogs = this.data.get(uid)?.get(apiUrl) || [];
    const currWindowLogs = this.getLogsOfSlidingWindow(prevAllowedReqLogs, currDate);
    if (currWindowLogs.length >= this.maxReqsThreshold) {
      return false
    }
    currWindowLogs.push(currDate);
    if (!this.data.get(uid)) {
      this.data.set(uid, new Map());
    }
    this.data.get(uid)?.set(apiUrl, currWindowLogs);
    return true;
  }
}

export { SlidingWindowLogStrategy }