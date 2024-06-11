import { ObjectCategory, ObjectData } from "../../_models/objectData";

export const mockObjects: ObjectData[] = [
    {
      id: '1',
      name: 'Eiffel Tower',
      description: 'Desc',
      location: {
        coordinates: [2.35, 48.85],
        country: 'France',
        city: 'Paris',
      },
      category: ObjectCategory.MONUMENT,
      userData: {
        userId: '2',
        userName: 'SuperAwesomeUser',
      },
      imageUrl: "https://www.planetware.com/photos-large/F/eiffel-tower.jpg"
    },
    {
      id: '2',
      name: 'Palac Kultury I Nauki',
      description: 'Opis super budynek',
      location: {
        coordinates: [21.03, 52.24],
        country: 'Poland',
        city: 'Warsaw',
      },
      category: ObjectCategory.MONUMENT,
      userData: {
        userId: '2',
        userName: 'SuperAwesomeUser',
      },
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/PKiN_widziany_z_WFC.jpg/640px-PKiN_widziany_z_WFC.jpg"
    },
    {
      id: '3',
      name: 'Krzywa Wieza',
      description: 'Desc',
      location: {
        coordinates: [21, 3],
        country: 'Italy',
        city: 'Piza',
      },
      category: ObjectCategory.MONUMENT,
      userData: {
        userId: '2',
        userName: 'SuperAwesomeUser',
      },
      imageUrl: ""
    },
    {
      id: '4',
      name: 'Luk Tryumfalny',
      description: 'Desc',
      location: {
        coordinates: [11, 2],
        country: 'France',
        city: 'Paris',
      },
      category: ObjectCategory.MONUMENT,
      userData: {
        userId: '2',
        userName: 'SuperAwesomeUser',
      },
      imageUrl: ""
    },
    {
      id: '5',
      name: 'Sky Tower',
      description: 'Desc',
      location: {
        coordinates: [14, 2],
        country: 'Poland',
        city: 'Wroclaw',
      },
      category: ObjectCategory.COMPANY,
      userData: {
        userId: '2',
        userName: 'SuperAwesomeUser',
      },
      imageUrl: ""
    },
    {
      id: '6',
      name: 'Eiffel Tower',
      description: 'Desc',
      location: {
        coordinates: [18, 4],
        country: 'Spain',
        city: 'Barcelona',
      },
      category: ObjectCategory.MONUMENT,
      userData: {
        userId: '2',
        userName: 'SuperAwesomeUser',
      },
      imageUrl: ""
    },
    {
      id: '7',
      name: 'Blok',
      description: 'Desc',
      location: {
        coordinates: [10, 3],
        country: 'Poland',
        city: 'Zgierz',
      },
      category: ObjectCategory.APARTMENT,
      userData: {
        userId: '2',
        userName: 'SuperAwesomeUser',
      },
      imageUrl: ""
    },
    {
      id: '8',
      name: 'Colosseum',
      description: 'Desc',
      location: {
        coordinates: [3, 3],
        country: 'Italy',
        city: 'Rome',
      },
      category: ObjectCategory.MONUMENT,
      userData: {
        userId: '2',
        userName: 'SuperAwesomeUser',
      },
      imageUrl: ""
    },
  ];