import {Pipe, PipeTransform} from '@angular/core';
import {DecimalPipe} from '@angular/common';

@Pipe({
  name: 'float'
})
export class FloatPipe implements PipeTransform {
  constructor(private decimalPipe: DecimalPipe) {}

  transform(value: number): string {
    const numberString = value.toString();
    if (numberString.startsWith('0.')) {
      let newString = numberString.substring(2);
      let amount = 0;
      while (newString.startsWith('0')) {
        amount++;
        newString = newString.substring(1);
      }
      return value.toFixed(2 + amount);
    } else {
      return value.toFixed(2);
      // return this.decimalPipe.transform(value, '1.2-2');
    }
  }
}
