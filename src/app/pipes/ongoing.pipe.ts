import { Pipe, PipeTransform } from '@angular/core';
import { Sug } from '../models/Sug.model';

@Pipe({
  name: 'reversePipe'
})
export class OngoingPipe implements PipeTransform {

  transform(array: any, field: string): any[] {
    if (!Array.isArray(array)) {
      return;
    }
    /*     array.sort((a: any, b: any) => {
          if (a < b) {
            return -1;
          } else if (a > b) {
            return 1;
          } else {
            return 0;
          }
        }); */
    return array;
  }
}
