import { Task } from "../entities/Task";
import { JobService } from "./JobService";



class TaskService {
  private static instance: TaskService = new TaskService();
  private tasks: Map<string, Task> = new Map();
  private jobServiceInst: JobService | undefined;
  private constructor() {}
  public setJobServiceInst(jobServiceInst: JobService) {
    this.jobServiceInst = jobServiceInst;
  }

  public static getInstance = (): TaskService => TaskService.instance;

  public createTask(taskId: string, startDate: Date, recurrenceRule: string, fn: Function, args:any[]) {
    const task = new Task(taskId, recurrenceRule, startDate, fn, args);
    this.tasks.set(task.taskId, task);
    this.jobServiceInst!.scheduleJob(task);
  }

  public getTaskById = (taskId: string): Task => this.tasks.get(taskId)!;
}

export { TaskService }