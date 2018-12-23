import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor() { }

  public CoverDataCard(Data: any) {
  }
}
export class Card {
  citizen_id = null;
  th_name = {
    prefix: null,
    firstname: null,
    lastname: null,
  };
  en_name = {
    prefix: null,
    firstname: null,
    lastname: null,
  };
  gender = null;
  birth = null;
  issuer = null;
  issue = null;
  expire = null;
  address = {
    address: null,
    sub_district: null,
    district: null,
    provice: null
  };
  photo = null;
  constructor(
  ) { }

}
