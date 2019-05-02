import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reversePipe'
})
export class OngoingPipe implements PipeTransform {

  transform(value: any) {
    return -1 * value;
  }

}
