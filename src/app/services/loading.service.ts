import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  isloading = new BehaviorSubject<boolean>(false)
  activePage: any;

  constructor() { }


  isLoading() {
    this.isloading.next(true);
  }
  isFinished() {
    this.isloading.next(false);

  }

  toggle(term) {
    term.toggle();
  }

}
