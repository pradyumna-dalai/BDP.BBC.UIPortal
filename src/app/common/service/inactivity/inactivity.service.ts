import { Injectable } from '@angular/core';
import { fromEvent, merge, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InactivityService {
  private activityEvents = ['mousemove', 'keydown', 'touchstart'];
  private readonly SECONDS_IN_MINUTE = 60;

  public idle$: Subject<any> = new Subject();
  public wake$: Subject<any> = new Subject();

  isIdle = false;
  private idleAfterSeconds = 2 * this.SECONDS_IN_MINUTE;
  private countDown;
  startTime: any;


  constructor() {
    const activity$ = merge(
      ...this.activityEvents.map((event) => fromEvent(document, event))
    ).subscribe({
      next: ()=> this.onInteraction()
    })
  }

  onInteraction() {
    // Is idle and interacting, emit Wake
    if (this.isIdle) {
      this.isIdle = false;
      const currentTime: any = new Date();
      let idleDuration = Math.abs(currentTime - this.startTime);
      this.wake$.next({isActive: true, duration: idleDuration});
    }

    // User interaction, reset start-idle-timer
    clearTimeout(this.countDown);
    this.startTime = new Date();
    this.countDown = setInterval(() => {
      // Countdown done without interaction - emit Idle
      this.isIdle = true;
      const currentTime: any = new Date();
      let idleDuration = Math.abs(currentTime - this.startTime);
      this.idle$.next({isIdle: true, duration: idleDuration});
    }, this.idleAfterSeconds * 1_000)
  }
}
