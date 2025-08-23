import Employee from "../entities/Employee";
import { IEmployeeService } from "../interfaces";


class EmployeeService implements IEmployeeService {

  private static instance: IEmployeeService;
  private employees: Map<string,Employee> = new Map();
  private constructor () {}

  static getInstance = (): IEmployeeService => {
    return EmployeeService.instance ? EmployeeService.instance : EmployeeService.instance = new EmployeeService();
  }
  
  public isValidEmployee = (employeeId: string): boolean => this.employees.has(employeeId);

  addEmployees = (employees: Employee[]): void => {
    employees.forEach((emp: Employee) => {
      this.employees.set(emp.getId(), emp);
    });
  }
}

export default EmployeeService;
