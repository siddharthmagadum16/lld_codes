import Employee from "./entities/Employee";
import Resource from "./entities/Resource";
import { IEmployeeService, IResourceService } from "./interfaces";
import EmployeeService from "./services/EmployeeService";
import ResourceService from "./services/ResourceService";


const demo = () => {

  const EmployeeServiceInst: IEmployeeService = EmployeeService.getInstance();
  ResourceService.setEmployeeInstance(EmployeeServiceInst);
  const ResourceServiceInst: IResourceService = ResourceService.getInstance();
  

  ResourceServiceInst.addResources([
    new Resource('r1', 'r1data'),
    new Resource('r2', 'r2data'),
    new Resource('r3', 'r3data'),
    new Resource('r4', 'r4data'),
  ]);

  EmployeeServiceInst.addEmployees([
    new Employee('e1', 'employee1'),
    new Employee('e2', 'employee2'),
    new Employee('e3', 'employee3'),
    new Employee('e4', 'employee4'),
  ]);

  ResourceServiceInst.grantResourceAccess('e1', 'r1');
  ResourceServiceInst.grantResourceAccess('e1', 'r2');
  ResourceServiceInst.grantResourceAccess('e2', 'r2');

  ResourceServiceInst.getResource('e1', 'r1');

  ResourceServiceInst.getResource('e2', 'r2');
  ResourceServiceInst.revokeResourceAccess('e2', 'r2');
  ResourceServiceInst.getResource('e2', 'r2');

  ResourceServiceInst.getResource('e3', 'r4');
  ResourceServiceInst.getResource('e4', 'r4');
  
}

demo();

/*
should be pascal case ? EmployeeServiceInst
should DIP injected through constructor? what about circular dependencies?

*/