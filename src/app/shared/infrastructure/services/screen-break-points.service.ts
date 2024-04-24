import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

// Bootstrap breakpoints
export enum BreakPoints {
  XS = 0,
  SM = 576,
  MD = 768,
  LG = 992,
  XL = 1200,
  XXL = 1400,
}

@Injectable({
  providedIn: 'root'
})
export class ScreenBreakPointsService {
  private readonly breakPoint$ = new BehaviorSubject<BreakPoints>(this.getCurrentBreakPoint());

  constructor() {
    window.addEventListener('resize', () => {
      const breakPoint = this.getCurrentBreakPoint();
      this.breakPoint$.next(breakPoint);
    });
  }

  getCurrentBreakPoint(): BreakPoints {
    const width = window.innerWidth;
    let breakPoint = BreakPoints.XXL;
    const breakPoints = Object.values(BreakPoints);
    for (let i = 0; i < breakPoints.length; i++) {
      // Last element reached
      if (i === breakPoints.length - 1) {
        breakPoint = breakPoints[i] as BreakPoints;
        break;
      }

      const currentBreakPoint = breakPoints[i] as number;
      const nextBreakPoint = breakPoints[i + 1] as number;
      // Current with between breakpoints?
      const between = (currentBreakPoint as number) <= width && (nextBreakPoint as number) >= width;
      if (between) {
        return currentBreakPoint as BreakPoints;
      }
    }

    return breakPoint as BreakPoints;
  }

  observeBreakpoints(): Observable<BreakPoints> {
    return this.breakPoint$.asObservable();
  }
}
