export interface ObjectData {
  _id: string;
  name: string;
  description: string;
  location: Location;
  category: ObjectCategory;
  imageUrl?: string;
  status?: ObjectStatus;
}

interface Location {
  coordinateLonLat: number[];
  country: string;
  place: string;
}

export interface ObjectDataMap {
  id: string;
  coordinateLonLat: number[];
  category: ObjectCategory;
}

export enum ObjectStatus {
  NEW = 'NEW',
  REPORTED = 'REPORTED',
  OK = 'OK',
}

export enum ObjectCategory {
  CATHEDRAL = 'CATHEDRAL',
  APARTMENT = 'APARTMENT',
  COMPANY = 'COMPANY',
  MONUMENT = 'MONUMENT',
  OTHER = 'OTHER',
}
