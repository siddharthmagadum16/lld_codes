import { JobService } from "./services/JobService";
import { TaskService } from "./services/TaskService";
// min hour day month weekday
const fn = (args: any[]) => {
  console.log('Task executed', args.toString());
}
const jobService = JobService.getInstance();
const taskService = TaskService.getInstance();
taskService.setJobServiceInst(jobService);

taskService.createTask('T1', new Date(), '5 * * *', fn, ['arg1', 'arg2']);

setTimeout(() => {
  console.log(jobService.getScheduledJobs().map(job => job.jobId))
  console.log(jobService.getFailedJobs().map(job => job.jobId))
  console.log(jobService.getSuccesfulJobs().map(job => job.jobId))
},8000)