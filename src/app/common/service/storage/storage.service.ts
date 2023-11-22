import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  public setItem(key: any, value: any) {
    if(value){
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  public getItem(key: any) {
    const item: string = localStorage.getItem(key);
    try {
      if (item) {
        return JSON.parse(item);
      }
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  public removeItem(key: any) {
    localStorage.removeItem(key);
  }
}
