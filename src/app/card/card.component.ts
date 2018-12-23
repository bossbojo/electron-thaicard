import { Component, OnInit, Input } from '@angular/core';
import { ModelCard } from '../model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() Data : ModelCard;
  constructor() { }

  ngOnInit() {
    console.log(this.Data);
  }

}
