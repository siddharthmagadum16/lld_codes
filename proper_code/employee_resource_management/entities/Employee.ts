
class Employee {
  private employeeId: string;
  private name: string;

  constructor(empId: string, _name: string) {
    this.employeeId = empId;
    this.name = _name;
  }

  getId = () => this.employeeId;
}

export default Employee;