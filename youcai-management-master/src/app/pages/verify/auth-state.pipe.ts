import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'authState'
})
export class AuthStatePipe implements PipeTransform {
  transform(value: number): string {
    if (value === 0) {
      return '提交';
    } else if (value === 1) {
      return '通过';
    } else if (value === 2) {
      return '不通过';
    }
    return null;
  }
}
