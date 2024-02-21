import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {

  private _draftSavedBBSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _projectIDbbSubject: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  private _projectidVolumeSubject: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  private _draftSavedVolumeSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _projectIdCLISubject: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  private _draftSavedCLISubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _projectIdOCSubject: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  private _draftSavedOCSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


  draftSavedBB$: Observable<boolean> = this._draftSavedBBSubject.asObservable();
  projectIDbb$: Observable<number | null> = this._projectIDbbSubject.asObservable();
  projectidVolume$: Observable<number | null> = this._projectidVolumeSubject.asObservable();
  draftSavedVolume$: Observable<boolean> = this._draftSavedVolumeSubject.asObservable();
  projectIdCLI$: Observable<number | null> = this._projectIdCLISubject.asObservable();
  draftSavedCLI$: Observable<boolean> = this._draftSavedCLISubject.asObservable();
  projectIdOC$: Observable<number | null> = this._projectIdOCSubject.asObservable();
  draftSavedOC$: Observable<boolean> = this._draftSavedOCSubject.asObservable();

  constructor() { }

  setDraftSavedBB(value: boolean): void {
    this._draftSavedBBSubject.next(value);
  }
  setProjectIDbb(value: number | null): void {
    this._projectIDbbSubject.next(value);
  }
  setProjectidVolume(value: number | null): void {
    this._projectidVolumeSubject.next(value);
  }

  setDraftSavedVolume(value: boolean): void {
    this._draftSavedVolumeSubject.next(value);
  }
  setProjectIdCLI(value: number | null): void {
    this._projectIdCLISubject.next(value);
  }

  setDraftSavedCLI(value: boolean): void {
    this._draftSavedCLISubject.next(value);
  }
  setProjectIdOtherCost(value: number | null): void {
    this._projectIdOCSubject.next(value);
  }

  setDraftSavedOtherCost(value: boolean): void {
    this._draftSavedOCSubject.next(value);
  }
}
