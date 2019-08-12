import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { Whitelist } from './model/whitelist.model';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { UserConst } from '../user/user.const';

@Component({
  selector: 'app-whitelist',
  templateUrl: './whitelist.component.html',
  styleUrls: ['./whitelist.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class WhitelistComponent implements OnInit {

  public ipAddressForm: FormGroup;
  public ipAddress: FormArray;
  public userType: string;
  public whitelistIps: Whitelist[];
  public ipList: FormArray;
  public severity: string;
  public message: string;
  public buttonText: string;
  public savedItems: any[];
  public USERCONST: any;
  public maxIps = 0;
  public disableSave: boolean;

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.message = '';
    this.userType = this.route.snapshot.paramMap.get('label').charAt(0).toUpperCase() + this.route.snapshot.paramMap.get('label').slice(1);
    this.ipAddressForm = this.formBuilder.group({ ipList: this.formBuilder.array([])});
    this.getPlanDetails();
  }

  public getPlanDetails(): void {
    this.USERCONST = UserConst;
    const plandetails = this.USERCONST.plans.filter((eachPlan) => eachPlan.value === this.userType.toLowerCase());
    plandetails[0] ? this.maxIps = plandetails[0].maxIp : this.errorMessage('Invalid Plan');
    this.getList();
  }

  public getList(): void {
    this.ipList = this.ipAddressForm.get('ipList') as FormArray;
    this.savedItems = JSON.parse(localStorage.getItem(this.userType.toLowerCase())) || [];
    this.appendtoList();
  }

  public appendtoList(): void {
    if (this.savedItems) {
      this.savedItems.map((eachItem) => this.ipList.push(this.showList(eachItem)));
      this.buttonText = 'Saved';
    }
    if (!this.ipList.length) {
      this.addItem();
      this.buttonText = 'Save';
    }
  }

  public addItem(): void {
    this.ipList.length < this.maxIps ? this.getNewItem() :
    this.waringMessage(`${this.userType} user cannot add more than ${this.maxIps} IP address`);
  }

  public getNewItem(): void {
      this.ipList = this.ipAddressForm.get('ipList') as FormArray;
      this.ipList.push(this.createItem());
      this.checkFormStatus();
  }

  public removeItem(index): void {
    if (this.ipList.length === 1) {
      this.ipList.controls[0].get('ipAddress').setValue('');
    } else {
      this.ipList.removeAt(this.ipList.value.findIndex((currentIp, id) => id === index));
    }
    this.message = '';
    this.checkFormStatus();
  }

  public saveItem(): void {
    this.savedItems = this.ipAddressForm.value.ipList.filter((eachIp) => eachIp.ipAddress.trim().length > 0);
    this.removeDuplicate();
    this.buttonText = 'Saved';
    this.disableSave = true;
  }

  public removeDuplicate(): any {
    this.savedItems = this.savedItems.filter((ipAdress, index, array) => index === array.findIndex((findIp) =>
        findIp.ipAddress === ipAdress.ipAddress)
    );
    const userType = this.userType.toLowerCase();
    localStorage.setItem(userType, JSON.stringify(this.savedItems));
  }

  public checkFormStatus(): void {
    this.message = '';
    this.disableSave = false;
    this.ipAddressForm.status === 'INVALID' ?
         this.errorMessage('invalid IP Address') : this.isUpdated() ? this.buttonText = 'Save' : this.buttonText = 'Saved';
  }

  public isUpdated(): boolean {
    return (this.savedItems.length !== this.ipAddressForm.value.ipList.length) || this.isValueUpdated();
  }

  public isValueUpdated(): boolean {
    let update = false;
    this.savedItems.map((eachIp, index) => {
      if (!update && (eachIp.ipAddress !== this.ipAddressForm.value.ipList[index].ipAddress)) {
        update = true;
      }
    });
    return update;
  }

  public isDisabled(): boolean {
    return (this.ipAddressForm.value.ipList.filter((eachIp) => eachIp.ipAddress.trim().length > 0).length === 0
            && (!!this.savedItems && this.savedItems.length === 0)) || (this.ipAddressForm.status === 'INVALID');
  }

  private ipValidator(): ValidatorFn {
    const validIpRegEx = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return (control: AbstractControl): {[key: string]: any} | null => {
        const valid = validIpRegEx.test(control.value);
        return (valid || control.value.length === 0 ) ? null : {invalidIp: {value: control.value}};
    };
  }

  private showList(item): FormGroup {
    return this.formBuilder.group({ ipAddress: [item.ipAddress, [this.ipValidator()]]});
  }

  private createItem(): FormGroup {
    return this.formBuilder.group({ ipAddress: ['', [this.ipValidator()]]});
  }

  private waringMessage(text): void {
    this.severity = 'warn';
    this.message = text;
  }

  private errorMessage(text): void {
    this.severity = 'error';
    this.message = text;
  }

  private successMessage(text): void {
    this.severity = 'success';
    this.message = text;
  }

  private clearMessages(): void {
    this.message = '';
  }
}
