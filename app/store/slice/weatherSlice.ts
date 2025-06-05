import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { WeatherState, WeatherData, NearbyCity } from '@/app/types/weather';

const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

export const fetchWeatherData = createAsyncThunk(
  'weather/fetchWeatherData',
  async (city: string) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${OPENWEATHER_API_KEY}&units=imperial`
    );
    if (!response.ok) {
      throw new Error('City not found');
    }
    const data = await response.json();
    return { ...data, cityName: city };
  }
);

export const fetchWeatherByLocation = createAsyncThunk(
  'weather/fetchWeatherByLocation',
  async ({ lat, lon }: { lat: number; lon: number }) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=imperial`
    );
    if (!response.ok) {
      throw new Error('Location not found');
    }
    return response.json();
  }
);

export const fetchNearbyCities = createAsyncThunk(
  'weather/fetchNearbyCities',
  async ({ lat, lon }: { lat: number; lon: number }) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=5&appid=${OPENWEATHER_API_KEY}&units=imperial`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch nearby cities');
    }
    const data = await response.json();
    return data.list.map((city: any) => ({
      name: city.name,
      coord: city.coord,
      weather: {
        temp: city.main.temp,
        description: city.weather[0].description,
        icon: city.weather[0].icon
      }
    }));
  }
);

const initialState: WeatherState = {
  currentWeather: null,
  searchedCities: [],
  nearbyCities: [],
  loading: false,
  error: null,
  defaultCity: typeof window !== 'undefined' ? localStorage.getItem('defaultCity') : null
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setDefaultCity(state, action) {
      state.defaultCity = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('defaultCity', action.payload);
      }
    },
    clearDefaultCity(state) {
      state.defaultCity = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('defaultCity');
      }
    },
    clearNearbyCities(state) {
      state.nearbyCities = [];
    },
    removeSearchedCity(state, action) {
      state.searchedCities = state.searchedCities.filter(
        city => city.city.name !== action.payload
      );
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        state.loading = false;
        const cityData = {
          city: {
            id: action.payload.city.id,
            name: action.payload.cityName,
            coord: action.payload.city.coord,
            country: action.payload.city.country
          },
          list: action.payload.list
        };
        
        // Update or add city data
        const existingCityIndex = state.searchedCities.findIndex(
          city => city.city.name === action.payload.cityName
        );
        
        if (existingCityIndex !== -1) {
          state.searchedCities[existingCityIndex] = cityData;
        } else {
          state.searchedCities.push(cityData);
        }
        
        state.currentWeather = cityData;
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch weather data';
      })
      .addCase(fetchWeatherByLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherByLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWeather = action.payload;
        state.error = null;
      })
      .addCase(fetchWeatherByLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch weather data';
      })
      .addCase(fetchNearbyCities.fulfilled, (state, action) => {
        state.nearbyCities = action.payload;
      });
  }
});

export const { setDefaultCity, clearDefaultCity, clearNearbyCities, removeSearchedCity } = weatherSlice.actions;
export default weatherSlice.reducer;
