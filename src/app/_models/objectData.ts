export interface ObjectData {
  id: string;
  name: string;
  description: string;
  location: {
    coordinates: number[];
    country: string;
    city: string;
  };
  dateOfBuild?: string;
  category: ObjectCategory;
  userData: {
    userId: string;
    userName: string;
  };
}

export enum ObjectCategory {
  CATHEDRAL = 'CATHEDRAL',
  APARTMENT = 'APARTMENT',
  COMPANY = 'COMPANY',
  NATURE = 'NATURE',
  MONUMENT = 'MONUMENT',
  OTHER = 'OTHER',
}
