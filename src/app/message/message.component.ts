import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})

export class MessageComponent implements OnInit {

  @Input() public severity: string;
  @Input() public text: string;

  constructor() { }

  ngOnInit() {
  }

}
