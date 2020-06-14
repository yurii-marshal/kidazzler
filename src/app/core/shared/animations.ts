import { animate, state, style, transition, trigger } from '@angular/animations';

export const dropdownDisplay = trigger('dropdownDisplay', [
  state(
    'false',
    style({
      transform: 'scaleY(0)',
      opacity: '.2',
      'transform-origin': 'top',
    }),
  ),
  state(
    'true',
    style({
      transform: 'scaleY(1)',
      opacity: '1',
      'transform-origin': 'top',
    }),
  ),
  transition('true <=> false', animate('.4s')),
]);
