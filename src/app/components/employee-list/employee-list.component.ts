import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Employee } from 'src/app/models/Employee';
import { EmployeeService } from 'src/app/services/employee.service';
import { CostCalculateService } from 'src/app/services/cost-calculate-service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  employees: Employee[];
  addEmpErrorMsg: string;
  private empSubscription: Subscription;
  constructor(
    private employeeService: EmployeeService,
    private costCalculateService: CostCalculateService
  ) { }

  ngOnInit(): void {
    this.loadEmployees();
  }

  ngOnDestroy(): void {
    this.empSubscription?.unsubscribe();
  }

  removeEmployee(employee: Employee) {
    this.employeeService.removeEmployee(employee).then(
      (removed) => {
        if (!!removed) {
          this.loadEmployees()
        }
      }
    )
  }

  calculateCost(emp: Employee) {
    emp.cost = this.costCalculateService.calculatePayCheckCost(emp);
  }

  private loadEmployees() {
    this.empSubscription = this.employeeService.getEmployees().subscribe(
      employees => {
        this.employees = employees;
      }
    )
  }
}
