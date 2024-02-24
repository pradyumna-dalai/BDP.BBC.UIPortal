import { Injectable } from '@angular/core';
import countries from "src/assets/demo/data/countries.json";
// import { DialogService, ToasterSeverity } from '../dialog/dialog.service';
import { Base64 } from 'js-base64';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  constructor() {
  }

  public getCountryList(): any {
    return countries.data.map((country: any) => {
      return {
        key: country.name,
        value: country.name
      }
    });
  }

  public static getCountryName(phoneCode) {
    return countries.data.find(c => c.code == phoneCode).name;
  }

  public static toTitleCase(value: string) {
    return value.charAt(0).toUpperCase() + value.substring(1).toLowerCase();
  }

  public getRandomNo(min: number = 999999999, max: number = 9999999999) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // showToastMessage(message, severity = ToasterSeverity.ERROR) {
  //   let toast = {
  //     severity: severity,
  //     summary: severity == ToasterSeverity.SUCCESS ? 'Success' : 'Error',
  //     detail: message,
  //     life: 10000,
  //     closable: true,
  //     // data:,
  //     // icon:,
  //     // contentStyleClass:,
  //     // styleClass:,
  //   }
  //   this.dialogService.showToaster(toast);
  // }

  public static convertToBase64(value: string) {
    return Base64.encode(value);
  }

}
