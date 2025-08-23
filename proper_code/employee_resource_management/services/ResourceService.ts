import Employee from "../entities/Employee";
import Resource from "../entities/Resource";
import { IEmployeeService, IResourceService } from "../interfaces";


class ResourceService implements IResourceService {

  private static instance: IResourceService;

  private access: Map<string, Set<string>> = new Map();
  private resources: Map<string,Resource> = new Map();
  private static employeeServiceInst: IEmployeeService | undefined;
  private constructor () {}

  static getInstance = (): IResourceService => {
    return ResourceService.instance ? ResourceService.instance : ResourceService.instance = new ResourceService();
  }

  public static setEmployeeInstance = (employeeServiceInstance: IEmployeeService) => {
    ResourceService.employeeServiceInst = employeeServiceInstance;
  }


  public grantResourceAccess = (employeeId: string, resourceId: string): void => {
    if (!ResourceService.employeeServiceInst!.isValidEmployee(employeeId)) {
      console.error('Cant provide access. Not a valid employee');
    }

    const existingAccess = this.access.get(employeeId);
    if (existingAccess) {
      existingAccess.add(resourceId);
    }
    else  this.access.set(employeeId, new Set([resourceId]));
    console.log('Employee', employeeId, 'was granted resource with resourceId: ', resourceId);
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
