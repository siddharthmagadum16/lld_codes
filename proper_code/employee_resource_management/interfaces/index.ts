import Employee from "../entities/Employee";
import Resource from "../entities/Resource";


interface IEmployeeService {
  isValidEmployee(employeeId: string): boolean;
  addEmployees(employees: Employee[]): void;
}

interface IResourceService {
  grantResourceAccess(employeeId: string, resourceId: string): void;
  revokeResourceAccess(employeeId: string, resourceId: string): void;
  getResource(employeeId: string, resourceId: string): Resource | null;
  addResources(resources: Resource[]): void;
}


export {
  IEmployeeService,
  IResourceService,
}