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
  CMD_CID = null;
  CMD_THFULLNAME = null;
  CMD_ENFULLNAME = null;
  CMD_BIRTH = null;
  CMD_GENDER = null;
  CMD_ISSUER = null;
  CMD_ISSUE = null;
  CMD_EXPIRE = null;
  CMD_ADDRESS = {
    address: null,
    sub_district: null,
    district: null,
    provice: null
  };
  CMD_PHOTO_RAW = null;
  constructor(
  ) { }

}
