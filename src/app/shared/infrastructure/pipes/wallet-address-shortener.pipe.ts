import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'TextShorter',
  standalone: true
})
export class TextShorterPipe implements PipeTransform {

  transform(value: string, start: number, end: number = start): unknown {
    if (value.length < start || value.length < end) {
      return value;
    }

    const startString = value.slice(0, start);
    const endString = value.slice(end * -1);

    return `${startString}...${endString}`;
  }
}
