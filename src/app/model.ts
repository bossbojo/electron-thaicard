export interface ModelCard {
    citizen_id: string;
    en_name: Enname;
    th_name: Enname;
    address: Address;
    birth: string;
    expire: string;
    gender: string;
    photo: string;
    issue: string;
    issuer: string;
}

export interface Enname {
    firstname: string;
    lastname: string;
    prefix: string;
}

export interface Address {
    address1: string;
    district: string;
    provice: string;
    sub_district: string;
}
