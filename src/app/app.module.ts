import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DropdownModule} from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ButtonModule} from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MessagesModule} from 'primeng/messages';
import { MessageModule} from 'primeng/message';
import { TooltipModule} from 'primeng/tooltip';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { WhitelistComponent } from './whitelist/whitelist.component';
import { MessageComponent } from './message/message.component';


@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    WhitelistComponent,
    MessageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DropdownModule,
    BrowserAnimationsModule,
    FormsModule,
    ButtonModule,
    ReactiveFormsModule,
    MessagesModule,
    MessageModule,
    TooltipModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
