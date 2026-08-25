import React, { useState } from 'react';
import {
  Grid,
  Column,
  Button,
  Link,
  InlineNotification,
} from '@carbon/react';
import { Download, ArrowRight } from '@carbon/icons-react';
import type { FormState, ResultadoSimulacion, PeriodoCronograma } from '../types/creditTypes';
import { PRODUCTO_META } from '../types/creditTypes';
import { CronogramaModal } from './CronogramaModal';

interface Props {
  form: FormState;
  resultado: ResultadoSimulacion;
  onContactarAsesor: () => void;
  onReset: () => void;
}

function fmt(n: number): string {
  return `S/ ${n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtPct(n: number): string {
  return `${(n * 100).toFixed(4)}%`;
}

export const Step4Resultado: React.FC<Props> = ({ form, resultado, onContactarAsesor, onReset: _onReset }) => {
  const [cronogramaOpen, setCronogramaOpen] = useState(false);
  const productoLabel = form.productoCodigo
    ? PRODUCTO_META[form.productoCodigo].label
    : 'Crédito';

  const handleExport = () => {
    const headers = ['#', 'Fecha', 'Saldo Inicial', 'Interés', 'Capital', 'Seguro', 'Cuota Total', 'Saldo Final'];
    const rows = resultado.cronograma.map((r: PeriodoCronograma) =>
      [r.numero, r.fecha,
        r.saldoInicial.toFixed(2), r.interes.toFixed(2),
        r.capital.toFixed(2), r.seguro.toFixed(2),
        r.cuotaTotal.toFixed(2), r.saldoFinal.toFixed(2),
      ].join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `simulacion-${productoLabel.replace(/\s/g, '-').toLowerCase()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="step4-resultado">
      <div className="step-title-header">
        <h3 className="cds--type-heading-compact-02">
          Resumen de tu simulación
        </h3>
        <p className="cds--type-body-compact-01 step-subtitle">
          {productoLabel} · {form.plazoMeses} cuotas · TEA {(form.tea * 100).toFixed(2)}%
        </p>
      </div>

      {/* Tarjeta principal */}
      <div className="summary-hero-card" role="region" aria-label="Cuota mensual estimada">
        <Grid narrow fullWidth>
          <Column sm={4} md={8} lg={16}>
            <div className="summary-hero-card__inner">
              <span className="summary-hero-card__label cds--type-label-01">
                CUOTA MENSUAL ESTIMADA
              </span>
              <div className="summary-hero-card__amount">
                <span className="summary-hero-card__currency">S/</span>
                <span className="summary-hero-card__value">
                  {resultado.cuotaConSeguro.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <span className="summary-hero-card__tem cds--type-helper-text-01">
                TEM {fmtPct(resultado.tem)} · Base 360 días
              </span>
            </div>
          </Column>
        </Grid>
      </div>

      {/* Desglose */}
      <Grid narrow className="breakdown-grid">
        <Column sm={2} md={2} lg={4}>
          <div className="breakdown-item">
            <span className="breakdown-item__label cds--type-label-01">MONTO FINANCIADO</span>
            <span className="breakdown-item__value cds--type-body-compact-02">{fmt(resultado.montoFinanciado)}</span>
          </div>
        </Column>
        <Column sm={2} md={2} lg={4}>
          <div className="breakdown-item">
            <span className="breakdown-item__label cds--type-label-01">CUOTA BASE (SIN SEGURO)</span>
            <span className="breakdown-item__value cds--type-body-compact-02">{fmt(resultado.cuotaBase)}</span>
          </div>
        </Column>
        <Column sm={2} md={2} lg={4}>
          <div className="breakdown-item">
            <span className="breakdown-item__label cds--type-label-01">TOTAL INTERESES</span>
            <span className="breakdown-item__value cds--type-body-compact-02">{fmt(resultado.totalIntereses)}</span>
          </div>
        </Column>
        <Column sm={2} md={2} lg={4}>
          <div className="breakdown-item">
            <span className="breakdown-item__label cds--type-label-01">TOTAL SEGUROS</span>
            <span className="breakdown-item__value cds--type-body-compact-02">{fmt(resultado.totalSeguros)}</span>
          </div>
        </Column>
        <Column sm={2} md={2} lg={4}>
          <div className="breakdown-item">
            <span className="breakdown-item__label cds--type-label-01">TOTAL A PAGAR</span>
            <span className="breakdown-item__value cds--type-body-compact-02 breakdown-item__value--highlight">{fmt(resultado.totalPagar)}</span>
          </div>
        </Column>
        <Column sm={2} md={2} lg={4}>
          <div className="breakdown-item">
            <span className="breakdown-item__label cds--type-label-01">PRIMERA CUOTA</span>
            <span className="breakdown-item__value cds--type-body-compact-02">{resultado.primeraCuota}</span>
          </div>
        </Column>
      </Grid>

      {/* Enlace cronograma */}
      <div className="schedule-link-row">
        <Link
          href="#"
          renderIcon={ArrowRight}
          onClick={(e: React.MouseEvent) => { e.preventDefault(); setCronogramaOpen(true); }}
          className="schedule-link"
        >
          Ver cronograma de pagos
        </Link>
      </div>

      {/* Aviso legal */}
      <InlineNotification
        kind="warning"
        title="Simulación referencial"
        subtitle="Las cifras mostradas son estimadas. Las condiciones finales del crédito pueden variar según evaluación crediticia y políticas vigentes de ACME Banco."
        lowContrast
        hideCloseButton
        className="legal-notice"
      />

      {/* Export + Asesor */}
      <div className="export-row">
        <Button kind="tertiary" renderIcon={Download} onClick={handleExport} size="md">
          Imprimir / Exportar
        </Button>
        <Button kind="primary" renderIcon={ArrowRight} onClick={onContactarAsesor} size="md">
          Contactar a un asesor
        </Button>
      </div>

      <CronogramaModal
        open={cronogramaOpen}
        onClose={() => setCronogramaOpen(false)}
        cronograma={resultado.cronograma}
        productoLabel={productoLabel}
      />
    </div>
  );
};
