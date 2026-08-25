import React, { useCallback } from 'react';
import {
  Grid,
  Column,
  TextInput,
  Select,
  SelectItem,
  ContentSwitcher,
  Switch,
  InlineNotification,
  DatePicker,
  DatePickerInput,
  FormGroup,
} from '@carbon/react';
import type { FormState, Producto } from '../types/creditTypes';
import { PLAZOS_OPCIONES, DIAS_PAGO } from '../types/creditTypes';

interface Props {
  form: FormState;
  producto: Producto | undefined;
  onChange: (partial: Partial<FormState>) => void;
}

function formatCurrency(value: number): string {
  return value.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function parseCurrency(str: string): number {
  const clean = str.replace(/[^\d.]/g, '');
  return parseFloat(clean) || 0;
}

export const Step2Condiciones: React.FC<Props> = ({ form, producto, onChange }) => {
  const cuotaInicial = form.valorBien * form.cuotaInicialPct;
  const montoFinanciado = form.valorBien - cuotaInicial - form.bono;

  const handlePlazoSwitch = useCallback((data: { index?: number }) => {
    const idx = data.index ?? 0;
    const plazo = PLAZOS_OPCIONES[idx];
    if (plazo) onChange({ plazoMeses: plazo });
  }, [onChange]);

  const selectedPlazoIdx = PLAZOS_OPCIONES.indexOf(form.plazoMeses);

  return (
    <div className="step2-condiciones">
      <div className="step-title-header">
        <h3 className="cds--type-heading-compact-02">
          Define las condiciones
        </h3>
        <p className="cds--type-body-compact-01 step-subtitle">
          Ajusta el monto y el plazo de acuerdo a tu capacidad de pago.
        </p>
      </div>

      <Grid narrow className="conditions-grid">
        {/* Valor del bien */}
        <Column sm={4} md={8} lg={16}>
          <TextInput
            id="valor-bien"
            labelText={<span className="field-label-upper">VALOR DEL BIEN</span>}
            value={`S/ ${formatCurrency(form.valorBien)}`}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const raw = e.target.value.replace(/[^0-9.]/g, '');
              const num = parseFloat(raw) || 0;
              onChange({ valorBien: num });
            }}
            helperText="Ingresa el valor total del bien a financiar"
            placeholder="S/ 50,000.00"
            size="md"
          />
        </Column>

        {/* Cuota inicial */}
        <Column sm={4} md={4} lg={8}>
          <TextInput
            id="cuota-inicial"
            labelText={<span className="field-label-upper">CUOTA INICIAL (%)</span>}
            value={`${(form.cuotaInicialPct * 100).toFixed(0)}%`}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const raw = parseCurrency(e.target.value);
              onChange({ cuotaInicialPct: Math.min(100, raw) / 100 });
            }}
            helperText={`S/ ${formatCurrency(cuotaInicial)}`}
            placeholder="10%"
            size="md"
          />
        </Column>

        {/* TEA */}
        <Column sm={4} md={4} lg={8}>
          <TextInput
            id="tasa-tea"
            labelText={<span className="field-label-upper">TASA DE INTERÉS ANUAL (TEA)</span>}
            value={`${(form.tea * 100).toFixed(2)}%`}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const raw = parseCurrency(e.target.value);
              onChange({ tea: raw / 100 });
            }}
            helperText={
              producto
                ? `Mín: ${(producto.teaMinima * 100).toFixed(2)}% · Máx: ${(producto.teaMaxima * 100).toFixed(2)}%`
                : 'Tasa de interés efectiva anual'
            }
            placeholder="9.80%"
            size="md"
            readOnly={!producto}
          />
        </Column>

        {/* Monto financiado — informativo */}
        {montoFinanciado > 0 && (
          <Column sm={4} md={8} lg={16}>
            <InlineNotification
              kind="info"
              title={`Monto a financiar: S/ ${formatCurrency(montoFinanciado)}`}
              subtitle="Valor del bien menos cuota inicial y bono."
              lowContrast
              hideCloseButton
            />
          </Column>
        )}

        {/* Plazo */}
        <Column sm={4} md={8} lg={16}>
          <FormGroup legendText={<span className="field-label-upper">PLAZO DE FINANCIAMIENTO (MESES)</span>}>
            <ContentSwitcher
              selectedIndex={selectedPlazoIdx >= 0 ? selectedPlazoIdx : 0}
              onChange={handlePlazoSwitch}
              size="md"
              className="plazo-switcher"
            >
              {PLAZOS_OPCIONES.map((p) => (
                <Switch key={p} name={String(p)} text={String(p)} />
              ))}
            </ContentSwitcher>
          </FormGroup>
        </Column>

        {/* Fecha de desembolso */}
        <Column sm={4} md={4} lg={8}>
          <FormGroup legendText={<span className="field-label-upper">FECHA DE DESEMBOLSO</span>}>
            <DatePicker
              datePickerType="single"
              value={form.fechaDesembolso}
              dateFormat="d/m/Y"
              onChange={(dates: Date[]) => {
                if (dates[0]) {
                  const d = dates[0];
                  const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                  onChange({ fechaDesembolso: iso });
                }
              }}
            >
              <DatePickerInput
                id="fecha-desembolso"
                labelText=""
                placeholder="dd/mm/aaaa"
                size="md"
              />
            </DatePicker>
          </FormGroup>
        </Column>

        {/* Día de pago */}
        <Column sm={4} md={4} lg={8}>
          <Select
            id="dia-pago"
            labelText={
              <span className="field-label-upper">
                DÍA DE PAGO <span className="required-mark">*</span>
              </span>
            }
            value={String(form.diaPago)}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              onChange({ diaPago: parseInt(e.target.value) })
            }
            size="md"
          >
            {DIAS_PAGO.map((d) => (
              <SelectItem key={d} value={String(d)} text={`Día ${d} de cada mes`} />
            ))}
          </Select>
        </Column>
      </Grid>
    </div>
  );
};
