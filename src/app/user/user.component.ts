import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserConst } from './user.const';
import { User } from './model/user.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class UserComponent implements OnInit {
  userOptions: User[];
  selectedOption: User;
  severity: string;
  text: string;

  constructor() {
    this.userOptions = UserConst.plans;
  }

  ngOnInit() {
    this.hidePlanDetails();
  }

  updatePlan(plan) {
    (!!plan.value) ? this.showPlanDetails(plan.value) : this.hidePlanDetails();
  }

  showPlanDetails(plan) {
    this.severity = 'info';
    this.text = this.userOptions.filter((eachPlan) => eachPlan.value === plan.value.toLowerCase())[0].details;
  }

  hidePlanDetails() {
    this.text = '';
  }

}
