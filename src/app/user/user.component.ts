import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserConst } from './user.const';
import { User } from './model/user.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class UserComponent implements OnInit {

  public userOptions: User[];
  public selectedOption: User;
  public severity: string;
  public text: string;

  constructor(private route: ActivatedRoute) {
    this.userOptions = UserConst.plans;
  }

  ngOnInit() {
    this.hidePlanDetails();
    if (this.route.snapshot.paramMap.get('label')) {
      this.selectedOption = UserConst.plans.filter((eachPlan) => eachPlan.value === 
      this.route.snapshot.paramMap.get('label').toLowerCase())[0];
      this.showPlanDetails(this.selectedOption);
    }
  }

  public updatePlan(plan): void {
    (!!plan.value) ? this.showPlanDetails(plan.value) : this.hidePlanDetails();
  }

  private showPlanDetails(plan): void {
    this.severity = 'info';
    this.text = this.userOptions.filter((eachPlan) => eachPlan.value === plan.value.toLowerCase())[0].details;
  }

  private hidePlanDetails(): void {
    this.text = '';
  }

}
