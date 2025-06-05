import React from 'react';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWeatherData } from '../store/slice/weatherSlice';
import { WeatherState } from '../types/weather';
import { AppDispatch } from '../store/configStore';

interface WeatherMapProps {
  lat: number;
  lon: number;
}

const WeatherMap: React.FC<WeatherMapProps> = ({ lat, lon }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { nearbyCities } = useSelector((state: { weather: WeatherState }) => state.weather);

  const handleCityClick = (cityName: string) => {
    dispatch(fetchWeatherData(cityName));
  };

  return (
    <div className="map-container">
      <iframe
        width="100%"
        height="450"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
          &q=${lat},${lon}&zoom=10`}
      />
      <div className="nearby-cities">
        {nearbyCities.map((city) => (
          <button
            key={city.name}
            className="city-pin"
            style={{
              left: `${Math.random() * 80 + 10}%`,
              top: `${Math.random() * 80 + 10}%`
            }}
            onClick={() => handleCityClick(city.name)}
          >
            <Image 
              src={`http://openweathermap.org/img/w/${city.weather.icon}.png`}
              alt={city.weather.description}
              width={50}
              height={50}
              unoptimized 
            />
            <span>{city.name}</span>
            <span className="temp">{Math.round(city.weather.temp)}°F</span>
          </button>
        ))}
      </div>
      <style jsx>{`
        .map-container {
          position: relative;
          width: 100%;
          height: 450px;
          margin: 2rem 0;
          border-radius: var(--border-radius);
          overflow: hidden;
        }

        .nearby-cities {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .city-pin {
          position: absolute;
          background: var(--card-background);
          border: none;
          border-radius: 8px;
          padding: 0.5rem;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          pointer-events: auto;
          transition: var(--transition);
        }

        .city-pin:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }

        .city-pin img {
          width: 32px;
          height: 32px;
        }

        .city-pin span {
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        .temp {
          font-weight: 600;
          color: var(--primary-color);
        }
      `}</style>
    </div>
  );
};

export default WeatherMap;
