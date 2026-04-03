// lib/web-vitals.ts
// Monitorea Core Web Vitals: LCP, FID, CLS
// Para uso con Google Analytics o Sentry

export function reportWebVitals(metric: any) {
  const body: PerformanceMetricWithValue = metric;
  
  // Enviar a analytics solo si es en producción
  if (process.env.NODE_ENV === 'production') {
    const url = '/api/analytics';
    // navigator.sendBeacon para garantizar envío
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, JSON.stringify(body));
    }
  }
}

interface PerformanceMetricWithValue {
  name: string;
  value: number;
  delta: number;
  id: string;
}
