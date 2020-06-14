import { Component, Input, OnInit } from '@angular/core';
import { Slide } from './shared/slide';

@Component({
  selector: 'kz-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent implements OnInit {
  items: any[];
  currentIndex = 0;
  speed = 6000;
  infinite = true;
  direction = 'right';
  directionToggle = true;
  autoplay = true;
  @Input() slides: Slide[] = [];

  constructor() {}

  ngOnInit() {}
}
