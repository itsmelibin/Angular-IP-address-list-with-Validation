import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserConst } from './user.const';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule} from 'primeng/dropdown';
import { RouterModule } from '@angular/router';
import { ButtonModule} from 'primeng/button';
import { MessagesModule} from 'primeng/messages';
import { MessageModule} from 'primeng/message';
import { User } from './model/user.model';

import { MessageComponent } from '../message/message.component';
import { UserComponent } from './user.component';

describe('UsersComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserComponent, MessageComponent],
      imports: [DropdownModule, FormsModule, ReactiveFormsModule, RouterModule, ButtonModule, MessagesModule, MessageModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.userOptions = UserConst.plans;
    component.severity = 'info';
    component.text = 'test';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
