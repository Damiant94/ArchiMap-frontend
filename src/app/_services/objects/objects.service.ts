import { Injectable } from '@angular/core';
import { ObjectCategory, ObjectData } from '../../_models/objectData';

@Injectable({
  providedIn: 'root'
})
export class ObjectsService {

  private objects: ObjectData[] = mockObjects;

  constructor() { }

  get getObjects() {
    return [...this.objects]
  }

  setObjects(objects: ObjectData[]) {
    this.objects = [...objects]
  }
}

export const mockObjects = [
  {
      id: '1',
      name: 'Eiffel Tower',
      description: 'Desc',
      location: {
        coordinates: [1,2],
        country: 'France',
        city: 'Paris'
      },
      category: ObjectCategory.MONUMENT,
      userData: {
        userId: '2',
        userName: 'SuperAwesomeUser'
      }
  },
  {
      id: '1',
      name: 'Eiffel Tower',
      description: 'Desc',
      location: {
        coordinates: [1,2],
        country: 'France',
        city: 'Paris'
      },
      category: ObjectCategory.MONUMENT,
      userData: {
        userId: '2',
        userName: 'SuperAwesomeUser'
      }
  },
  {
      id: '1',
      name: 'Eiffel Tower',
      description: 'Desc',
      location: {
        coordinates: [1,2],
        country: 'France',
        city: 'Paris'
      },
      category: ObjectCategory.MONUMENT,
      userData: {
        userId: '2',
        userName: 'SuperAwesomeUser'
      }
  },
  {
      id: '1',
      name: 'Eiffel Tower',
      description: 'Desc',
      location: {
        coordinates: [1,2],
        country: 'France',
        city: 'Paris'
      },
      category: ObjectCategory.MONUMENT,
      userData: {
        userId: '2',
        userName: 'SuperAwesomeUser'
      }
  },
  {
      id: '1',
      name: 'Eiffel Tower',
      description: 'Desc',
      location: {
        coordinates: [1,2],
        country: 'France',
        city: 'Paris'
      },
      category: ObjectCategory.MONUMENT,
      userData: {
        userId: '2',
        userName: 'SuperAwesomeUser'
      }
  },
  {
      id: '1',
      name: 'Eiffel Tower',
      description: 'Desc',
      location: {
        coordinates: [1,2],
        country: 'France',
        city: 'Paris'
      },
      category: ObjectCategory.MONUMENT,
      userData: {
        userId: '2',
        userName: 'SuperAwesomeUser'
      }
  },
  {
      id: '1',
      name: 'Eiffel Tower',
      description: 'Desc',
      location: {
        coordinates: [1,2],
        country: 'France',
        city: 'Paris'
      },
      category: ObjectCategory.MONUMENT,
      userData: {
        userId: '2',
        userName: 'SuperAwesomeUser'
      }
  },
  {
      id: '1',
      name: 'Eiffel Tower',
      description: 'Desc',
      location: {
        coordinates: [1,2],
        country: 'France',
        city: 'Paris'
      },
      category: ObjectCategory.MONUMENT,
      userData: {
        userId: '2',
        userName: 'SuperAwesomeUser'
      }
  },
]