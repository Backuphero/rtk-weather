declare module 'react-sparklines' {
  export const Sparklines: React.FC<{
    data: number[];
    width?: number;
    height?: number;
    margin?: number;
    children?: React.ReactNode;
  }>;

  export const SparklinesLine: React.FC<{
    color?: string;
    style?: React.CSSProperties;
  }>;

  export const SparklinesCurve: React.FC<{
    color?: string;
    style?: React.CSSProperties;
  }>;

  export const SparklinesReferenceLine: React.FC<{
    type?: 'max' | 'min' | 'mean' | 'avg' | 'median';
    style?: React.CSSProperties;
  }>;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_OPENWEATHER_API_KEY: string;
      NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: string;
    }
  }
}
