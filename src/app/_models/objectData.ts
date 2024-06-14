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
}

export enum ObjectCategory {
  CATHEDRAL = 'CATHEDRAL',
  APARTMENT = 'APARTMENT',
  COMPANY = 'COMPANY',
  NATURE = 'NATURE',
  MONUMENT = 'MONUMENT',
  OTHER = 'OTHER',
}
