import { Pipe, PipeTransform } from '@angular/core';
import { Doc } from '../models/Doc.model';

@Pipe({
  name: 'fileFilter'
})
export class FileFilterPipe implements PipeTransform {

  public transform(documents: Doc[], term: string): any[] {
    if (!documents || !documents.length) return [];
    if (!term) return documents;
    // Filter items array, items which match will return true
    return documents.filter(v => v.filename.toLowerCase().indexOf(term.toLowerCase()) !== -1);
  }

}
