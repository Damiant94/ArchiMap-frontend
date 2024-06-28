export interface ObjectData {
  _id: string;
  name: string;
  description: string;
  location: {
    coordinateLonLat: number[];
    country: string;
    place: string;
  };
  category: ObjectCategory;
  username: string;
  imageUrl?: string;
  status?: ObjectStatus
}

export interface ObjectDataMap {
  id: string;
  coordinateLonLat: number[];
  category: ObjectCategory;
}

export enum ObjectStatus {
  NEW = 'NEW',
  REPORTED = 'REPORTED',
  OK = 'OK'
}

export enum ObjectCategory {
  CATHEDRAL = 'CATHEDRAL',
  APARTMENT = 'APARTMENT',
  COMPANY = 'COMPANY',
  MONUMENT = 'MONUMENT',
  OTHER = 'OTHER',
}
