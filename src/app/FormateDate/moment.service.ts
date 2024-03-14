import { Injectable } from '@angular/core';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class MomentService {

  constructor() { }
  getDate(date) {
    if (date)
      return moment(date, 'YYYY-MM-DD').format('DD MMM YYYY');
    else
      return "";
  }
  getUIDCode() {
    let dateTime = new Date();
    return dateTime ? moment(new Date(dateTime)).format("YYYYMMDDHHmmss") : "";
  }

  getFullDate(date) {
    return moment(date, 'YYYY-MM-DD HH:mm').format('DD MMM YYYY HH:mm')
  }

  getFullDBDate(date) {
    return date ? moment(date, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm') : "";
  }

  getDateDBFormat(dateTime) {
    return dateTime ? moment(new Date(dateTime)).format("YYYY-MM-DD HH:mm") : "";
  }

  getDateUserTimezone(date) {
    if (moment(date).isValid())
      return date ? moment(date, 'YYYY-MM-DDTHH:mm:00').format("YYYY-MM-DD HH:mm") : null;
    else
      return null
  }

  getDateForDatatable(date) {
    if (moment(date).isValid())
      return date ? moment(date, 'YYYY-MM-DDTHH:mm:00').format("YYYY-MM-DD HH:mm") : null;
    else
      return null
  }

  getDateforTable(date) {
    return date ? moment(date, 'YYYY-MM-DD HH:mm').format('MMMM DD YYYY') : "";
  }
}
