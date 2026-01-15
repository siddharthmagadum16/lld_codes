import Employee from "../entities/Employee";
import Resource from "../entities/Resource";
import { IEmployeeService, IResourceService } from "../interfaces/index";
import Mutex from "./Mutex";

class ResourceService implements IResourceService {

  private static instance: IResourceService;
  private accessLock = new Mutex();

  private access: Map<string, Set<string>> = new Map();
  private resources: Map<string,Resource> = new Map();
  private employeeServiceInst: IEmployeeService | undefined;
  private constructor () {}

  static getInstance = (): IResourceService => {
    return ResourceService.instance ? ResourceService.instance : ResourceService.instance = new ResourceService();
  }

  public setEmployeeInstance = (employeeServiceInstance: IEmployeeService) => {
    this.employeeServiceInst = employeeServiceInstance;
  }

  private getAccessOfEmployee = async (employeeId: string): Promise<Set<string>|undefined> => {
    return await new Promise(resolve => setTimeout(() => resolve(this.access.get(employeeId)), 1000));
  }
  private setAccessOfEmployee = async (employeeId: string, accesses: Set<string>): Promise<Map<string, Set<string>>>  => {
    return await new Promise(resolve => setTimeout(() => resolve(this.access.set(employeeId, accesses)), 1000));
  }

  public grantResourceAccess = async (employeeId: string, resourceId: string): Promise<void> => {
    if (!this.employeeServiceInst!.isValidEmployee(employeeId)) {
      console.error('Cant provide access. Not a valid employee');
      return;
    }

    const releaseAccessLock = await this.accessLock.acquire();
    try {
      const existingAccess = await this.getAccessOfEmployee(employeeId);
      let newAccess: Set<string>;
      newAccess = existingAccess ? new Set([...existingAccess!, resourceId]) : new Set([resourceId]);
      await this.setAccessOfEmployee(employeeId, newAccess);

      console.log(`Employee: ${employeeId} was granted resource: ${resourceId} | Employee's resources: [${[...this.access.get(employeeId)!]}]`);
    } finally {
      releaseAccessLock();
    }
  }

  public revokeResourceAccess = (employeeId: string, resourceId: string): void => {
    const grantedResources = this.access.get(employeeId);
    if (grantedResources?.has(resourceId)) {
      grantedResources.delete(resourceId);
      console.log('access revoked for employee', employeeId, 'for resouceid', resourceId);
    }
    else {
      console.error('Access not revoked. Reason - access not found');
    }
  }
  public getResource = (employeeId: string, resourceId: string): Resource | null => {
    const existingResources = this.access.get(employeeId);
    if(existingResources?.has(resourceId)) {
      if (this.resources.has(resourceId)) {
        const resource = this.resources.get(resourceId) as Resource;
        console.log('Resource fetched by', employeeId, ' --> ', JSON.stringify(resource));
        return resource;
      }
      else console.error('Resource doesnt exists with resourceId', resourceId);
    }
    else console.error('Employee: ', employeeId, ', doesnt have access to resource with resourceId', resourceId);
    return null;
  }

  public addResources(resources: Resource[]): void {
    resources.forEach((rec: Resource) => this.resources.set(rec.getId(), rec));
  }
}

export default ResourceService;
