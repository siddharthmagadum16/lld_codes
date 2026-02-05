import { Job } from "../entities/Job";
import { Task } from "../entities/Task";
import { JobStatus } from "../interface";
import { TaskService } from "./TaskService";

class JobService {
  private static instance: JobService = new JobService();

  private failedJobs: Map<string, Job> = new Map();
  private successfulJobs: Map<string, Job> = new Map();
  private scheduledJobs: Map<string, Job> = new Map();
  private statusToStorateMapper: Map<JobStatus, Map<string,Job>> = new Map([
    [JobStatus.FAILED, this.failedJobs],
    [JobStatus.SUCCESS, this.successfulJobs],
    [JobStatus.SCHEDULED, this.scheduledJobs],
  ]);

  private constructor() {}
  public static getInstance = (): JobService => JobService.instance;


  private createJob(task: Task): Job | undefined {
    const runDate = task.getExecutionDate();
    if (!runDate) return ;
    return new Job(
      task.taskId + task.startDate.toDateString(),
      task.taskId,
      task.fn,
      task.args,
      runDate
    );
  }

  // private scheduleNextJob()

  private executeWrapper (job: Job) {
    // return () => {
    job.fn(job.args);
    const task = TaskService.getInstance().getTaskById(job.taskId);
    this.statusToStorateMapper.get(job.status)?.set(job.jobId, job);
    this.scheduledJobs.delete(job.jobId);
    if (task) this.scheduleJob(task);
    // }
  }

  public scheduleJob(task: Task) {
    const job = this.createJob(task);
    if (!job) return ;
    const currDate = new Date();
    // const delay = +currDate - +job.runDate;
    const delay = 5000;
    console.log('delay', delay);
    this.scheduledJobs.set(job.jobId, job);
    setTimeout(() => this.executeWrapper(job), delay);
  }

  public getScheduledJobs = (): Job[] => this.scheduledJobs.values().toArray();
  public getFailedJobs = (): Job[] => this.failedJobs.values().toArray();
  public getSuccesfulJobs = (): Job[] => this.successfulJobs.values().toArray();
};

export { JobService };