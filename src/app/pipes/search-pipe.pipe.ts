import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchPipe'
})
export class SearchPipePipe implements PipeTransform {

  /*   transform(value: any, args: any): any {
      if (!args) { return value; }
      var re = new RegExp(args, 'gi'); //'gi' for case insensitive and can use 'g' if you want the search to be case sensitive.
      return value.replace(re, "<mark>" + args + "</mark>");
    } */

  transform(text: string, search): string {
    var pattern = search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    pattern = pattern.split(' ').filter((t) => {
      return t.length > 0;
    }).join('|');
    var regex = new RegExp(pattern, 'gi');
    return search ? text.replace(regex, (match) => `<mark>${match}</mark>`) : text;
  }
}
