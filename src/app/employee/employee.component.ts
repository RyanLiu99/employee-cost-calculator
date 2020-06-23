import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { Employee } from '../models/Employee';
import { EmployeeService } from '../services/employee.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit, OnDestroy {

  private _route: ActivatedRoute;

  message: string;
  empForm: FormGroup;
  private _empId: number;
  private mapSubscription: Subscription;

  get empId(): number {
    return this._empId;
  };

  get children() {
    return this.empForm.get('children') as FormArray;
  }

  constructor(
    private _route: ActivatedRoute,
    private fb: FormBuilder,
    private employeeService: EmployeeService) {
  }
  ngOnDestroy(): void {
    this.mapSubscription?.unsubscribe();
  }

  addChild(e: Event) {
    e.preventDefault();
    this.children.push(this.fb.control(''));
  }

  removeChild(i: number,e:Event) {
    e.preventDefault();
    this.children.removeAt(i);
  }

  ngOnInit(): void {
    this.mapSubscription =this._route.paramMap.subscribe(params => {
      this._empId = +params.get('empId');

      if (this._empId === 0) {
        this.empForm = this.fb.group({
          id: 0,
          name: ['', Validators.required],
          spouseName:'',
          children: this.fb.array([])
        });

      } else {
       this.employeeService.getEmployee(this._empId).then(emp => {
          this.empForm = this.fb.group({
            id: emp.id,
            spouseName:emp.spouseName,
            name: emp.name,
            children:this.fb.array(emp.children)
          });
        })
      }
    });
  }

  onSubmit() {
    let employee = this.getEmployeeFromForm();
    this.employeeService.submitEmployee(employee).then(
      (msg) => {
        this.empForm.reset();
        this.showMessage(msg);
      }).catch(error => {
        this.showMessage(error);
      })
  }

  private getEmployeeFromForm(): Employee {
    const v = this.empForm.value;
    const e = new Employee(v.id, v.name);
    e.spouseName = v.spouseName;
    e.children = v.children.filter(s => !!s); //remove empty strings
    return e;
  }

  private showMessage(message: string) {
    this.message = message;
   setTimeout(() => {
      this.message = null;
    }, 2000);
  }
}
