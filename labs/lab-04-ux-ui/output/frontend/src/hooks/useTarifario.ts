import { useState, useEffect } from 'react';
import type { Producto, TasaSeguro } from '../types/creditTypes';

interface TarifarioState {
  productos: Producto[];
  tasasSeguro: TasaSeguro[];
  loading: boolean;
  error: string | null;
}

/** Hook que carga productos y tasas de seguro desde el mock-server / BFF */
export function useTarifario(): TarifarioState {
  const [state, setState] = useState<TarifarioState>({
    productos: [],
    tasasSeguro: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [prodRes, segRes] = await Promise.all([
          fetch('/api/tarifario/v1/productos'),
          fetch('/api/tarifario/v1/seguro-desgravamen'),
        ]);

        if (!prodRes.ok || !segRes.ok) {
          throw new Error('Error al cargar el tarifario');
        }

        const productos: Producto[] = await prodRes.json();
        const tasasSeguro: TasaSeguro[] = await segRes.json();

        if (!cancelled) {
          setState({ productos, tasasSeguro, loading: false, error: null });
        }
      } catch (err) {
        if (!cancelled) {
          // Fallback para desarrollo sin servidor
          const productosFallback: Producto[] = [
            { codigo: 'HIPOTECARIO', nombre: 'Crédito Hipotecario',  teaMinima: 0.0980, teaMaxima: 0.1490, permitePeriodoGracia: false, permiteCuotasDobles: false },
            { codigo: 'AUTOMOTRIZ',  nombre: 'Crédito Automotriz',   teaMinima: 0.4000, teaMaxima: 1.1413, permitePeriodoGracia: false, permiteCuotasDobles: false },
            { codigo: 'CONSUMO',     nombre: 'Crédito al Consumo',   teaMinima: 0.1599, teaMaxima: 1.1413, permitePeriodoGracia: true,  permiteCuotasDobles: true  },
            { codigo: 'COMERCIAL',   nombre: 'Crédito Comercial',    teaMinima: 0.4500, teaMaxima: 1.1413, permitePeriodoGracia: false, permiteCuotasDobles: false },
          ];
          const tasasFallback: TasaSeguro[] = [
            { modalidad: 'SIN_DEVOLUCION', tasaMensual: 0.0040 },
            { modalidad: 'CON_DEVOLUCION', tasaMensual: 0.0072 },
          ];
          setState({ productos: productosFallback, tasasSeguro: tasasFallback, loading: false, error: null });
        }
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  return state;
}
