import React from 'react';
import {
  Toggle,
  RadioTile,
  TileGroup,
  InlineNotification,
  Grid,
  Column,
} from '@carbon/react';
import type { FormState, Producto } from '../types/creditTypes';

interface Props {
  form: FormState;
  producto: Producto | undefined;
  onChange: (partial: Partial<FormState>) => void;
}

export const Step3Personalizacion: React.FC<Props> = ({ form, producto, onChange }) => {
  const isHipotecario = form.productoCodigo === 'HIPOTECARIO';

  return (
    <div className="step3-personalizacion">
      <div className="step-title-header">
        <h3 className="cds--type-heading-compact-02">
          Personaliza tu crédito
        </h3>
        <p className="cds--type-body-compact-01 step-subtitle">
          Ajusta las opciones adicionales según tus necesidades.
        </p>
      </div>

      <Grid narrow>
        {/* Seguro de desgravamen */}
        <Column sm={4} md={8} lg={16}>
          <div className="insurance-toggle-section">
            <Toggle
              id="seguro-toggle"
              labelText="Seguro de desgravamen obligatorio"
              toggled={form.seguroActivo}
              onToggle={(checked: boolean) => onChange({ seguroActivo: checked })}
              labelA="Desactivado"
              labelB="Activado"
              size="sm"
            />
            <p className="cds--type-body-compact-01 insurance-desc">
              Cubre el saldo del crédito ante fallecimiento o incapacidad permanente.
            </p>
          </div>
        </Column>

        {/* Modalidades de seguro */}
        {form.seguroActivo && (
          <Column sm={4} md={8} lg={16}>
            <TileGroup
              name="modalidad-seguro"
              legend="MODALIDAD DE SEGURO"
              valueSelected={form.modalidadSeguro}
              onChange={(value: string) =>
                onChange({ modalidadSeguro: value as 'SIN_DEVOLUCION' | 'CON_DEVOLUCION' })
              }
              className="insurance-tile-group"
            >
              <RadioTile
                id="tile-sin-devolucion"
                value="SIN_DEVOLUCION"
                className="insurance-tile"
              >
                <div className="insurance-tile__content">
                  <strong className="insurance-tile__title">Sin Devolución (Básico)</strong>
                  <p className="cds--type-body-compact-01">
                    Protección estándar y cuota mensual más baja. No reembolsable.
                  </p>
                  <span className="insurance-tile__rate cds--type-helper-text-01">
                    Tasa: 0.40% mensual sobre saldo
                  </span>
                </div>
              </RadioTile>
              <RadioTile
                id="tile-con-devolucion"
                value="CON_DEVOLUCION"
                className="insurance-tile"
              >
                <div className="insurance-tile__content">
                  <strong className="insurance-tile__title">Con Devolución (Premium)</strong>
                  <p className="cds--type-body-compact-01">
                    Devuelve hasta el 100% de las primas pagadas al finalizar el plazo.
                  </p>
                  <span className="insurance-tile__rate cds--type-helper-text-01">
                    Tasa: 0.72% mensual sobre saldo
                  </span>
                </div>
              </RadioTile>
            </TileGroup>
          </Column>
        )}

        {/* Aviso sin opciones adicionales para HIPOTECARIO */}
        {isHipotecario && (
          <Column sm={4} md={8} lg={16}>
            <InlineNotification
              kind="info"
              title="Opciones adicionales"
              subtitle={`El producto ${producto?.nombre ?? ''} no tiene opciones adicionales disponibles. Puedes continuar al resultado.`}
              lowContrast
              hideCloseButton
            />
          </Column>
        )}

        {/* Período de gracia — solo CONSUMO */}
        {form.productoCodigo === 'CONSUMO' && producto?.permitePeriodoGracia && (
          <Column sm={4} md={8} lg={16}>
            <InlineNotification
              kind="warning"
              title="Período de gracia disponible"
              subtitle="El Crédito de Consumo puede incluir un período de gracia de 30 o 60 días. Consulta con tu asesor para configurarlo."
              lowContrast
              hideCloseButton
            />
          </Column>
        )}
      </Grid>
    </div>
  );
};
