'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/configStore';
import { fetchWeatherData } from '../store/slice/weatherSlice';
import styles from './searchBar.module.css';

interface SearchBarProps {
  loading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ loading }) => {
  const [city, setCity] = useState('');
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (city.trim()) {
      try {
        setError(null);
        await dispatch(fetchWeatherData(city)).unwrap();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <input
          type="text"
          value={city}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCity(e.target.value)}
          placeholder="Enter city name..."
          className={styles.searchInput}
          disabled={loading}
        />
        <button type="submit" className={styles.searchButton} disabled={loading || !city.trim()}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default SearchBar;
