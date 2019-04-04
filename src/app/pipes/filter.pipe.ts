import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/User.model';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  public transform(users: User[], filter: string): any[] {
    if (!users || !users.length) return [];
    if (!filter) return users;
    // Filter items array, items which match will return true
    return users.filter(v => v.firstname.toLowerCase().indexOf(filter.toLowerCase()) !== -1 || v.lastname.toLowerCase().indexOf(filter.toLowerCase()) !== -1);
  }

}
