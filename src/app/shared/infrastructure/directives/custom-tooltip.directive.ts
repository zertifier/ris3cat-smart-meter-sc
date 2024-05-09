import {Directive, ElementRef, HostListener, Input, Renderer2, TemplateRef} from '@angular/core';

@Directive({
  selector: '[appCustomTooltip]',
  standalone: true
})
export class CustomTooltipDirective {

  @Input({required: true}) tooltipContent!: TemplateRef<never>;

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {
  }

  @HostListener('hover')
  showTooltip() {
    this.renderer.appendChild('body', this.tooltipContent.elementRef);
    this.renderer.setStyle(this.tooltipContent.elementRef, 'position', 'absolute');

  }
}
