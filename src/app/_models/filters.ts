export interface Filters {
  search: string;
  category: string;
  country: string;
}

export interface Query {
  search?: string;
  category?: string;
  country?: string;
  page?: number;
}
