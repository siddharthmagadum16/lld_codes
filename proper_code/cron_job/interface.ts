
enum JobStatus {
  SCHEDULED = "SCHEDULED",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
};
type element = JobStatus|undefined;
const arr:Array<element> = [JobStatus.SCHEDULED, JobStatus.SUCCESS, undefined];

export { JobStatus };
