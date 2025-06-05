'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store/configStore';
import WeatherChart from './components/WeatherChart';
import SearchBar from './components/searchBar';
import WeatherMap from './components/WeatherMap';
import CityList from './components/CityList';
import { fetchWeatherData, fetchWeatherByLocation, fetchNearbyCities, setDefaultCity, clearDefaultCity } from './store/slice/weatherSlice';
import React from 'react';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default function Home() {
  const dispatch = useAppDispatch();
  const { currentWeather, loading, error, defaultCity } = useAppSelector(
    (state) => state.weather
  );

  useEffect(() => {
    if (defaultCity) {
      dispatch(fetchWeatherData(defaultCity));
    }
  }, [defaultCity, dispatch]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          dispatch(fetchWeatherByLocation({ lat: latitude, lon: longitude }));
          dispatch(fetchNearbyCities({ lat: latitude, lon: longitude }));
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, [dispatch]);

  const handleLocationSearch = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: lat, longitude: lon } = position.coords;
          dispatch(fetchWeatherByLocation({ lat, lon }));
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const handleSetDefaultCity = () => {
    if (currentWeather?.city.name) {
      dispatch(setDefaultCity(currentWeather.city.name));
    }
  };

  const handleClearDefaultCity = () => {
    dispatch(clearDefaultCity());
  };

  const getChartData = (key: keyof typeof currentWeather.list[0]['main']) => {
    if (!currentWeather?.list) return [];
    return currentWeather.list.map(item => item.main[key]);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gray-50">
      <div className="w-full max-w-6xl space-y-6">
        <div className="search-section">
          <SearchBar loading={loading} />
          <button 
            className="location-button"
            onClick={handleLocationSearch}
            disabled={loading}
          >
            Use My Location
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {currentWeather && (
          <>
            <div className="city-header">
              <h2>{currentWeather.city.name}, {currentWeather.city.country}</h2>
              {defaultCity === currentWeather.city.name ? (
                <button 
                  className="default-button active"
                  onClick={handleClearDefaultCity}
                >
                  Default City ✓
                </button>
              ) : (
                <button 
                  className="default-button"
                  onClick={handleSetDefaultCity}
                >
                  Set as Default
                </button>
              )}
            </div>

            <div className="charts">
              <WeatherChart 
                data={getChartData('temp')} 
                color="#2563eb" 
                unit="°F"
                title="Temperature"
              />
              <WeatherChart 
                data={getChartData('pressure')} 
                color="#16a34a" 
                unit="hPa"
                title="Pressure"
              />
              <WeatherChart 
                data={getChartData('humidity')} 
                color="#9333ea" 
                unit="%"
                title="Humidity"
              />
            </div>

            <WeatherMap lat={currentWeather.city.coord.lat} lon={currentWeather.city.coord.lon} />
          </>
        )}
        
        {/* List of searched cities with their charts */}
        <CityList />
      </div>

      <style jsx>{`
        .search-section {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
          max-width: 600px;
          margin: 0 auto;
        }

        .location-button {
          padding: 1rem 1.5rem;
          background: var(--secondary-color);
          color: white;
          border: none;
          border-radius: var(--border-radius);
          cursor: pointer;
          transition: var(--transition);
          white-space: nowrap;
        }

        .location-button:hover:not(:disabled) {
          background: var(--primary-color);
        }

        .city-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin: 2rem 0;
        }

        .city-header h2 {
          font-size: 1.5rem;
          color: var(--text-primary);
        }

        .default-button {
          padding: 0.5rem 1rem;
          border: 2px solid var(--primary-color);
          border-radius: var(--border-radius);
          background: transparent;
          color: var(--primary-color);
          cursor: pointer;
          transition: var(--transition);
        }

        .default-button:hover {
          background: var(--primary-color);
          color: white;
        }

        .default-button.active {
          background: var(--primary-color);
          color: white;
        }

        @media (max-width: 768px) {
          .search-section {
            flex-direction: column;
            align-items: stretch;
          }

          .location-button {
            width: 100%;
          }

          .city-header {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </main>
  );
}
