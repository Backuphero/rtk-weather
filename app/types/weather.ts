export interface WeatherData {
  list: WeatherItem[];
  city: City;
}

export interface WeatherItem {
  main: {
    temp: number;
    pressure: number;
    humidity: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  dt: number;
}

export interface City {
  id: number;
  name: string;
  coord: {
    lat: number;
    lon: number;
  };
  country: string;
}

export interface NearbyCity {
  name: string;
  coord: {
    lat: number;
    lon: number;
  };
  weather: {
    temp: number;
    description: string;
    icon: string;
  };
}

export interface SearchedCity {
  city: {
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
  };
  list: WeatherItem[];
}

export interface WeatherState {
  currentWeather: WeatherData | null;
  searchedCities: SearchedCity[];
  nearbyCities: NearbyCity[];
  loading: boolean;
  error: string | null;
  defaultCity: string | null;
}
