import { useMemo } from 'react';
import type { FormState, ResultadoSimulacion, PeriodoCronograma, ModalidadSeguro } from '../types/creditTypes';

// Tasas de seguro según skill reglas-negocio-credito (Paso 5)
const TASA_SEGURO: Record<ModalidadSeguro, number> = {
  SIN_DEVOLUCION: 0.0040,
  CON_DEVOLUCION: 0.0072,
};

function addMeses(fechaStr: string, meses: number): string {
  const d = new Date(fechaStr + 'T12:00:00');
  d.setMonth(d.getMonth() + meses);
  return d.toISOString().slice(0, 10);
}

function formatFecha(fechaStr: string): string {
  const [y, m, d] = fechaStr.split('-');
  const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  return `${parseInt(d)} ${meses[parseInt(m) - 1]} ${y}`;
}

/**
 * Calcula la simulación aplicando las fórmulas del PRD sección 5:
 * Paso 1: Monto financiado = valorBien - cuotaInicial - bono
 * Paso 2: TEM = (1 + TEA)^(1/12) - 1
 * Paso 3: Cuota = M × [i(1+i)^n] / [(1+i)^n - 1]
 * Paso 4: Cronograma amortización francesa
 * Paso 5: Seguro = saldo × tasaSeguro
 */
export function calcularSimulacion(
  form: FormState,
  tasaSeguroMensual: number,
): ResultadoSimulacion {
  // Paso 1 — monto financiado
  const cuotaInicial = form.valorBien * form.cuotaInicialPct;
  const montoFinanciado = form.valorBien - cuotaInicial - form.bono;
  const n = form.plazoMeses;

  // Paso 2 — TEM
  const tem = Math.pow(1 + form.tea, 1 / 12) - 1;

  // Paso 3 — cuota base (amortización francesa)
  const factor = Math.pow(1 + tem, n);
  const cuotaBase = montoFinanciado * (tem * factor) / (factor - 1);

  // Paso 4 + 5 — cronograma
  const cronograma: PeriodoCronograma[] = [];
  let saldo = montoFinanciado;
  let totalIntereses = 0;
  let totalSeguros = 0;

  for (let i = 1; i <= n; i++) {
    const fechaCuota = addMeses(form.fechaDesembolso, i);
    const interes = saldo * tem;
    const capital = cuotaBase - interes;
    const seguro = form.seguroActivo ? saldo * tasaSeguroMensual : 0;
    const cuotaTotal = cuotaBase + seguro;
    const saldoFinal = Math.max(0, saldo - capital);

    cronograma.push({
      numero: i,
      fecha: formatFecha(fechaCuota),
      saldoInicial: saldo,
      interes,
      capital,
      seguro,
      cuotaTotal,
      saldoFinal,
    });

    totalIntereses += interes;
    totalSeguros += seguro;
    saldo = saldoFinal;
  }

  const totalPagar = montoFinanciado + totalIntereses + totalSeguros;
  const cuotaConSeguro = cuotaBase + (form.seguroActivo ? montoFinanciado * tasaSeguroMensual : 0);

  return {
    montoFinanciado,
    tem,
    cuotaBase,
    cuotaConSeguro,
    totalIntereses,
    totalSeguros,
    totalPagar,
    primeraCuota: formatFecha(addMeses(form.fechaDesembolso, 1)),
    cronograma,
  };
}

/** Hook que memoriza el resultado de la simulación cuando cambia el formulario */
export function useCreditoCalculator(
  form: FormState,
  tasasSeguro: { modalidad: string; tasaMensual: number }[],
): ResultadoSimulacion | null {
  return useMemo(() => {
    if (!form.productoCodigo || form.valorBien <= 0 || form.plazoMeses <= 0) return null;

    const tasaObjeto = tasasSeguro.find(t => t.modalidad === form.modalidadSeguro);
    const tasaSeguroMensual = tasaObjeto?.tasaMensual ?? TASA_SEGURO[form.modalidadSeguro];

    return calcularSimulacion(form, tasaSeguroMensual);
  }, [form, tasasSeguro]);
}
