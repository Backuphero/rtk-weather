import React from 'react';
import { Sparklines, SparklinesLine, SparklinesCurve, SparklinesReferenceLine } from 'react-sparklines';

interface WeatherChartProps {
  data: number[];
  color: string;
  unit: string;
  title: string;
}

const WeatherChart: React.FC<WeatherChartProps> = ({ data, color, unit, title }) => {
  const average = data.reduce((sum, value) => sum + value, 0) / data.length;

  return (
    <div className="chart-card">
      <h3 className="chart-title">{title}</h3>
      <Sparklines data={data} width={180} height={120} margin={5}>
        <SparklinesLine style={{ stroke: color, strokeWidth: 2, fill: "none" }} />
        <SparklinesReferenceLine type="avg" style={{ stroke: '#ef4444', strokeDasharray: '2, 2' }} />
      </Sparklines>
      <div className="chart-average">
        Average: {average.toFixed(2)} {unit}
      </div>
    </div>
  );
};

export default WeatherChart;
