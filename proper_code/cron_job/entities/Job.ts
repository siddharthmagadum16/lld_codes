import { JobStatus } from "../interface";

// min hour day month weekday
class Job {
  public status: JobStatus = JobStatus.SCHEDULED;
  public result: any;
  public constructor(
    public jobId: string,
    public taskId: string,
    public fn: Function,
    public args: string[],
    public runDate: Date
  ) {}

  public execute() {
    try {
      this.fn(...this.args);
      this.status = JobStatus.SUCCESS
    } catch (err) {
      this.status = JobStatus.FAILED
    } finally {
      console.log('Job ', this.jobId,'for task: ', this.taskId, this.status, "with result: ", this.result);
    }
  }
}

export { Job }