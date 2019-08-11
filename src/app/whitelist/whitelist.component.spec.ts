import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DropdownModule} from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ButtonModule} from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MessagesModule} from 'primeng/messages';
import { MessageModule} from 'primeng/message';
import { TooltipModule} from 'primeng/tooltip';
import { Routes, RouterModule } from '@angular/router';
import { ActivatedRoute, convertToParamMap} from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { UserConst } from '../user/user.const';

import { WhitelistComponent } from './whitelist.component';
import { MessageComponent } from '../message/message.component';
import { UserComponent } from '../user/user.component';

const routes: Routes = [
  { path: '', redirectTo: '/user', pathMatch: 'full' },
  { path: 'user', component: UserComponent },
  { path: 'whitelist/:label', component: WhitelistComponent },
  { path: 'not_found', component: UserComponent},
  { path: '**', redirectTo: 'user' }
];

describe('WhitelistComponent', () => {
  let component: WhitelistComponent;
  let fixture: ComponentFixture<WhitelistComponent>;
  // create new instance of FormBuilder
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhitelistComponent, MessageComponent, UserComponent],
      imports: [DropdownModule, FormsModule, ReactiveFormsModule, RouterModule, ButtonModule, MessagesModule,
                MessageModule, TooltipModule, RouterModule.forRoot(routes)],
      providers: [ WhitelistComponent, {
                  provide: ActivatedRoute, FormBuilder,
                  useValue: { snapshot: { paramMap: convertToParamMap( {label: 'basic' } ) } }
                }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhitelistComponent);
    component = fixture.componentInstance;
    component.userType = 'basic';
    component.USERCONST = UserConst;
    component.ipAddressForm = formBuilder.group({ ipList: formBuilder.array([])});
    let store = {};
    const mockLocalStorage = {
      getItem: (key: string): string => {
        return key in store ? store[key] : null;
      },
      setItem: (key: string, value: string) => {
        store[key] = `${value}`;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      }
    };
    spyOn(localStorage, 'getItem')
    .and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem')
      .and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, 'removeItem')
      .and.callFake(mockLocalStorage.removeItem);
    spyOn(localStorage, 'clear')
      .and.callFake(mockLocalStorage.clear);
    const testIp = [{ipAddress: '10.2.1.23'}, {ipAddress: '10.3.2.32'}, {ipAddress: '12.12.12.46'}];
    localStorage.setItem('basic', JSON.stringify(testIp));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load plan details', () => {
    spyOn(component, 'getList');
    component.getPlanDetails();
    expect(component.maxIps).toEqual(5);
    expect(component.getList).toHaveBeenCalled();
  });

  it('should load existing details', () => {
    spyOn(component, 'appendtoList');
    component.getList();
    expect(component.savedItems.length).toEqual(3);
    expect(component.appendtoList).toHaveBeenCalled();
    expect(component.ipList.length).toEqual(3);
  });

  it('should add new item', () => {
    component.addItem();
    expect(component.ipList.length).toEqual(4);
  });

  it('should not add more than limit', () => {
    component.addItem();
    component.addItem();
    component.addItem();
    component.addItem();
    expect(component.ipList.length).toEqual(5);
    expect(component.severity).toEqual('warn');
  });

  it('should remove one item', () => {
    component.removeItem(0);
    expect(component.ipList.length).toEqual(2);
  });

  it('should not remove last item', () => {
    component.removeItem(0);
    component.removeItem(0);
    component.removeItem(0);
    expect(component.ipList.length).toEqual(1);
  });

  it('should not save empty item', () => {
    component.addItem();
    component.saveItem();
    expect(component.savedItems.length).toEqual(3);
  });

  it('should save new non empty item', () => {
    const newIP = '10.2.1.3';
    component.addItem();
    component.ipList.controls[3].get('ipAddress').setValue(newIP);
    component.saveItem();
    expect(component.savedItems.length).toEqual(4);
  });

  it('should load diffrent user type', () => {
    const testIp = [{ipAddress: '10.2.1.23'}, {ipAddress: '10.3.2.32'}, {ipAddress: '12.12.12.46'}];
    localStorage.setItem('premium', JSON.stringify(testIp));
    component.userType = 'premium';
    spyOn(component, 'getList');
    component.getPlanDetails();
    expect(component.maxIps).toEqual(10);
    expect(component.getList).toHaveBeenCalled();
  });

  it('should show invalid message for invalid IP type 1', () => {
    const newIP = '10.2.1.500';
    component.addItem();
    component.ipList.controls[3].get('ipAddress').setValue(newIP);
    expect(component.ipAddressForm.status).toEqual('INVALID');
  });

  it('should show invalid message for invalid IP type 2', () => {
    const newIP = '10.2.1';
    component.addItem();
    component.ipList.controls[3].get('ipAddress').setValue(newIP);
    expect(component.ipAddressForm.status).toEqual('INVALID');
  });

  it('should show invalid message for invalid IP type 3', () => {
    const newIP = '10.2.5.f';
    component.addItem();
    component.ipList.controls[3].get('ipAddress').setValue(newIP);
    expect(component.ipAddressForm.status).toEqual('INVALID');
  });

  it('should not save empty rows', () => {
    const newIP = '';
    component.addItem();
    component.ipList.controls[3].get('ipAddress').setValue(newIP);
    component.addItem();
    component.ipList.controls[3].get('ipAddress').setValue(newIP);
    expect(component.savedItems.length).toEqual(3);
  });

  it('should enable save button for new item', () => {
    component.addItem();
    expect(component.isUpdated()).toBe(true);
  });

  it('should enable save button for remove item', () => {
    component.removeItem(0);
    expect(component.isUpdated()).toBe(true);
  });


});
