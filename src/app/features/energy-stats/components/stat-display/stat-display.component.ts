import {Component, HostBinding, Input} from '@angular/core';
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-stat-display',
  standalone: true,
  imports: [
    NgStyle
  ],
  templateUrl: './stat-display.component.html',
  styleUrl: './stat-display.component.scss'
})
export class StatDisplayComponent {
  @Input() label: string = '';
  @Input() text: string = '';
  @Input() public color = 'light-gray';
  @HostBinding('style.width') @Input() width = '100%';
}
