import React from 'react';
import {
  Grid,
  Column,
  Tile,
  Tag,
} from '@carbon/react';
import type { CarbonIconProps } from '@carbon/icons-react';
import { Home, Car, ShoppingCart, Enterprise, ChevronRight } from '@carbon/icons-react';
import type { Producto, ProductoCodigo } from '../types/creditTypes';
import { PRODUCTO_META, PRODUCTOS_SOPORTADOS } from '../types/creditTypes';

interface Props {
  productos: Producto[];
  selected: ProductoCodigo | null;
  onSelect: (codigo: ProductoCodigo) => void;
}

type CarbonIcon = React.ForwardRefExoticComponent<CarbonIconProps & React.RefAttributes<SVGSVGElement>>;

const iconMap: Record<string, CarbonIcon> = {
  home: Home,
  car: Car,
  'shopping-cart': ShoppingCart,
  store: Enterprise,
};

export const Step1Producto: React.FC<Props> = ({ productos, selected, onSelect }) => {
  // Filtrar productos no soportados por esta UI (ej: EDUCATIVO)
  const productosFiltrados = productos.filter(p => PRODUCTOS_SOPORTADOS.has(p.codigo));

  return (
    <div className="step1-producto">
      <div className="step-title-header">
        <h3 className="cds--type-heading-compact-02">
          ¿Qué tipo de crédito necesitas?
        </h3>
        <p className="cds--type-body-compact-01 step-subtitle">
          Selecciona el producto que mejor se adapta a tus necesidades.
        </p>
      </div>

      <Grid className="product-grid" narrow>
        {productosFiltrados.map((prod) => {
          const meta = PRODUCTO_META[prod.codigo];
          const IconComponent = iconMap[meta.iconKey] ?? Home;
          const isSelected = selected === prod.codigo;

          return (
            <Column key={prod.codigo} sm={4} md={4} lg={8}>
              <Tile
                className={`product-card${isSelected ? ' product-card--selected' : ''}`}
                onClick={() => onSelect(prod.codigo)}
                role="radio"
                aria-checked={isSelected}
                aria-label={meta.label}
                tabIndex={0}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect(prod.codigo);
                  }
                }}
              >
                <div className="product-card__content">
                  <div className="product-card__icon-wrap">
                    <IconComponent size={24} className="product-card__icon" />
                  </div>
                  <div className="product-card__text">
                    <h4 className="cds--type-heading-compact-01 product-card__title">
                      {meta.label}
                    </h4>
                    <p className="cds--type-body-compact-01 product-card__desc">
                      {meta.descripcion}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="product-card__check" aria-hidden="true">
                      <ChevronRight size={16} />
                    </div>
                  )}
                </div>
                {isSelected && (
                  <Tag type="blue" size="sm" className="product-card__badge">
                    Seleccionado
                  </Tag>
                )}
              </Tile>
            </Column>
          );
        })}
      </Grid>
    </div>
  );
};
