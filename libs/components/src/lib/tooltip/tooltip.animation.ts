/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { animate, AnimationMetadata, keyframes, state, style, transition } from '@angular/animations'

/**
 * Animation that transitions a tooltip in and out.
 */
export const tooltipAnimation: AnimationMetadata[] = [
  state('initial, void, hidden', style({ opacity: 0, transform: 'scale(0)' })),
  state('visible', style({ transform: 'scale(1)' })),
  transition(
    '* => visible',
    animate(
      '250ms cubic-bezier(0, 0, 0.2, 1)',
      keyframes([
        style({ opacity: 0, transform: 'scale(0)', offset: 0 }),
        style({ opacity: 0.5, transform: 'scale(0.99)', offset: 0.5 }),
        style({ opacity: 1, transform: 'scale(1)', offset: 1 }),
      ]),
    ),
  ),
  transition('* => hidden', animate('100ms cubic-bezier(0, 0, 0.2, 1)', style({ opacity: 0 }))),
]
