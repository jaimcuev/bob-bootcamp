/** Tipos del dominio del Simulador de Crédito */

export type ProductoCodigo = 'HIPOTECARIO' | 'AUTOMOTRIZ' | 'CONSUMO' | 'COMERCIAL';

export type ModalidadSeguro = 'SIN_DEVOLUCION' | 'CON_DEVOLUCION';

export interface Producto {
  codigo: ProductoCodigo;
  nombre: string;
  teaMinima: number;
  teaMaxima: number;
  permitePeriodoGracia: boolean;
  permiteCuotasDobles: boolean;
}

export interface TasaSeguro {
  modalidad: ModalidadSeguro;
  tasaMensual: number;
}

export interface FormState {
  // Paso 1
  productoCodigo: ProductoCodigo | null;
  // Paso 2
  valorBien: number;
  cuotaInicialPct: number;  // 0-1 (porcentaje como decimal)
  bono: number;
  tea: number;              // 0-1 (decimal, ej: 0.098)
  plazoMeses: number;
  fechaDesembolso: string;  // 'YYYY-MM-DD'
  diaPago: number;          // 1-31
  // Paso 3
  seguroActivo: boolean;
  modalidadSeguro: ModalidadSeguro;
  // Paso 4 (calculado)
}

export interface ResultadoSimulacion {
  montoFinanciado: number;
  tem: number;
  cuotaBase: number;
  cuotaConSeguro: number;
  totalIntereses: number;
  totalSeguros: number;
  totalPagar: number;
  primeraCuota: string;     // fecha formateada
  cronograma: PeriodoCronograma[];
}

export interface PeriodoCronograma {
  numero: number;
  fecha: string;
  saldoInicial: number;
  interes: number;
  capital: number;
  seguro: number;
  cuotaTotal: number;
  saldoFinal: number;
}

/** Pasos del wizard */
export type Paso = 1 | 2 | 3 | 4;

/** Opciones de plazo que aparecen en el content switcher */
export const PLAZOS_OPCIONES: number[] = [60, 120, 180, 240, 360];

/** Días de pago disponibles */
export const DIAS_PAGO: number[] = [1, 5, 10, 15, 20, 25, 28];

/** Metadatos visuales de cada producto (íconos y descripciones para la UI) */
export const PRODUCTO_META: Record<ProductoCodigo, { label: string; descripcion: string; iconKey: string }> = {
  HIPOTECARIO: {
    label: 'Crédito Hipotecario',
    descripcion: 'Financia la compra de tu vivienda con el mejor plazo.',
    iconKey: 'home',
  },
  AUTOMOTRIZ: {
    label: 'Crédito Automotriz',
    descripcion: 'Financia tu vehículo nuevo o usado con facilidades.',
    iconKey: 'car',
  },
  CONSUMO: {
    label: 'Crédito de Consumo',
    descripcion: 'Para libre disponibilidad y gastos personales.',
    iconKey: 'shopping-cart',
  },
  COMERCIAL: {
    label: 'Crédito Comercial',
    descripcion: 'Impulsa tu negocio con capital de trabajo, compra de activos o expansión de tu empresa.',
    iconKey: 'store',
  },
};

/** Códigos de producto soportados por la UI del simulador */
export const PRODUCTOS_SOPORTADOS = new Set<string>(Object.keys(PRODUCTO_META));

export const FORM_STATE_INICIAL: FormState = {
  productoCodigo: null,
  valorBien: 50000,
  cuotaInicialPct: 0.1,
  bono: 0,
  tea: 0.098,
  plazoMeses: 120,
  fechaDesembolso: new Date().toISOString().slice(0, 10),
  diaPago: 15,
  seguroActivo: true,
  modalidadSeguro: 'SIN_DEVOLUCION',
};
