import { Component, OnInit, Input } from '@angular/core';
import { ModelCard } from '../model';

@Component({
  selector: 'app-card2',
  templateUrl: './card2.component.html',
  styleUrls: ['./card2.component.scss']
})
export class Card2Component implements OnInit {
  @Input() Data: ModelCard;
  constructor() { }

  ngOnInit() {
  }

}
