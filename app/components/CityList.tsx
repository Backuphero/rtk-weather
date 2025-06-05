import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Sparklines, SparklinesLine, SparklinesReferenceLine } from 'react-sparklines';
import { removeSearchedCity } from '../store/slice/weatherSlice';
import { RootState } from '../store/rootReducer';

const CityList = () => {
  const dispatch = useDispatch();
  const searchedCities = useSelector((state: RootState) => state.weather.searchedCities);

  const getChartData = (list: any[], field: string) => {
    return list.map(item => item.main[field]);
  };

  const calculateAverage = (data: number[]) => {
    const sum = data.reduce((a, b) => a + b, 0);
    return Math.round(sum / data.length);
  };

  return (
    <div className="city-list">
      <h2 className="list-title">Searched Cities</h2>
      {searchedCities.map((cityData) => (
        <div key={cityData.city.name} className="city-card">
          <div className="city-header">
            <div className="city-info">
              <h3 className="city-name">{cityData.city.name}</h3>
              {cityData.city.country && (
                <span className="country-code">{cityData.city.country}</span>
              )}
            </div>
            <button
              onClick={() => dispatch(removeSearchedCity(cityData.city.name))}
              className="remove-button"
              aria-label="Remove city"
            >
              ×
            </button>
          </div>
          
          <div className="chart-container">
            <div className="chart">
              <h4>Temperature (°F)</h4>
              <Sparklines data={getChartData(cityData.list, 'temp')} height={50}>
                <SparklinesLine color="red" />
                <SparklinesReferenceLine type="avg" />
              </Sparklines>
              <div className="avg">
                Average: {calculateAverage(getChartData(cityData.list, 'temp'))}°F
              </div>
            </div>

            <div className="chart">
              <h4>Pressure (hPa)</h4>
              <Sparklines data={getChartData(cityData.list, 'pressure')} height={50}>
                <SparklinesLine color="blue" />
                <SparklinesReferenceLine type="avg" />
              </Sparklines>
              <div className="avg">
                Average: {calculateAverage(getChartData(cityData.list, 'pressure'))} hPa
              </div>
            </div>

            <div className="chart">
              <h4>Humidity (%)</h4>
              <Sparklines data={getChartData(cityData.list, 'humidity')} height={50}>
                <SparklinesLine color="green" />
                <SparklinesReferenceLine type="avg" />
              </Sparklines>
              <div className="avg">
                Average: {calculateAverage(getChartData(cityData.list, 'humidity'))}%
              </div>
            </div>
          </div>
        </div>
      ))}

      <style jsx>{`
        .city-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding: 1rem;
        }

        .list-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1rem;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 0.5rem;
        }

        .city-card {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease;
        }

        .city-card:hover {
          transform: translateY(-2px);
        }

        .city-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }

        .city-info {
          display: flex;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .city-name {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }

        .country-code {
          font-size: 0.875rem;
          color: #4b5563;
          font-weight: 500;
          background: #f3f4f6;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }

        .remove-button {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #9ca3af;
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .remove-button:hover {
          color: #ef4444;
          background: #fee2e2;
        }

        .chart-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .chart {
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 8px;
          transition: background-color 0.2s ease;
        }

        .chart:hover {
          background: #f3f4f6;
        }

        .chart h4 {
          margin-bottom: 0.75rem;
          font-size: 0.75rem;
          color: #4b5563;
          font-weight: 500;
        }

        .avg {
          text-align: center;
          font-size: 0.75rem;
          color: #6b7280;
          margin-top: 0.75rem;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default CityList;
