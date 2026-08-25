import React, { useCallback, useReducer } from 'react';
import {
  ProgressIndicator,
  ProgressStep,
  Button,
  Loading,
  InlineNotification,
  Header,
  HeaderName,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SkipToContent,
} from '@carbon/react';
import {
  ArrowLeft,
  ArrowRight,
  Notification,
  UserAvatar,
  Chat,
  Renew,
} from '@carbon/icons-react';
import type { FormState, Paso, ProductoCodigo } from '../types/creditTypes';
import { FORM_STATE_INICIAL, PRODUCTO_META } from '../types/creditTypes';
import { useTarifario } from '../hooks/useTarifario';
import { useCreditoCalculator } from '../hooks/useCreditoCalculator';
import { Step1Producto } from './Step1Producto';
import { Step2Condiciones } from './Step2Condiciones';
import { Step3Personalizacion } from './Step3Personalizacion';
import { Step4Resultado } from './Step4Resultado';

// ── Reducer ──────────────────────────────────────────────────────────────────

type Action =
  | { type: 'UPDATE_FORM'; payload: Partial<FormState> }
  | { type: 'SET_PASO'; payload: Paso }
  | { type: 'RESET' };

interface State {
  form: FormState;
  paso: Paso;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'UPDATE_FORM':
      return { ...state, form: { ...state.form, ...action.payload } };
    case 'SET_PASO':
      return { ...state, paso: action.payload };
    case 'RESET':
      return { form: FORM_STATE_INICIAL, paso: 1 };
    default:
      return state;
  }
}

// ── Hero copy por paso ────────────────────────────────────────────────────────

const HERO_COPY: Record<Paso, { eyebrow: string; title: string; body: string }> = {
  1: {
    eyebrow: 'Simulador de crédito',
    title: 'Tu crédito ideal en minutos',
    body: 'Simula las condiciones de tu crédito antes de solicitarlo. Sin evaluación crediticia, sin compromiso.',
  },
  2: {
    eyebrow: 'Paso 2 de 4',
    title: 'Define el monto y el plazo',
    body: 'Ajusta el monto que necesitas y elige el plazo que mejor se adapte a tu presupuesto mensual.',
  },
  3: {
    eyebrow: 'Paso 3 de 4',
    title: 'Protege tu crédito',
    body: 'El seguro de desgravamen garantiza que tu crédito quede cubierto ante cualquier imprevisto.',
  },
  4: {
    eyebrow: 'Resultado',
    title: '¡Tu simulación está lista!',
    body: 'Revisa las condiciones estimadas, descarga tu cronograma y habla con un asesor cuando quieras.',
  },
};

// ── Pasos del Progress Indicator ─────────────────────────────────────────────

const STEP_LABELS = [
  { label: 'Producto',        description: 'Tipo de crédito' },
  { label: 'Condiciones',     description: 'Monto y plazo' },
  { label: 'Personalización', description: 'Opciones adicionales' },
  { label: 'Resultado',       description: 'Resumen de simulación' },
];

// ── Component ─────────────────────────────────────────────────────────────────

export const SimuladorForm: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, { form: FORM_STATE_INICIAL, paso: 1 });
  const { productos, tasasSeguro, loading, error } = useTarifario();
  const resultado = useCreditoCalculator(state.form, tasasSeguro);

  const setForm = useCallback((partial: Partial<FormState>) => {
    dispatch({ type: 'UPDATE_FORM', payload: partial });
  }, []);

  const setPaso = useCallback((p: Paso) => {
    dispatch({ type: 'SET_PASO', payload: p });
  }, []);

  const selectedProducto = productos.find(p => p.codigo === state.form.productoCodigo);

  const canContinue = useCallback((): boolean => {
    const { form } = state;
    switch (state.paso) {
      case 1: return form.productoCodigo !== null;
      case 2:
        return form.valorBien > 0 && form.cuotaInicialPct >= 0 &&
          form.plazoMeses > 0 && form.tea > 0 && !!form.fechaDesembolso;
      case 3: return true;
      default: return false;
    }
  }, [state]);

  const handleContinue = useCallback(() => {
    if (state.paso < 4) setPaso((state.paso + 1) as Paso);
  }, [state.paso, setPaso]);

  const handleBack = useCallback(() => {
    if (state.paso > 1) setPaso((state.paso - 1) as Paso);
  }, [state.paso, setPaso]);

  const handleSelectProducto = useCallback((codigo: ProductoCodigo) => {
    const prod = productos.find(p => p.codigo === codigo);
    dispatch({
      type: 'UPDATE_FORM',
      payload: { productoCodigo: codigo, tea: prod ? prod.teaMinima : FORM_STATE_INICIAL.tea },
    });
  }, [productos]);

  const handleContactarAsesor = useCallback(async () => {
    if (!resultado || !state.form.productoCodigo) return;
    try {
      await fetch('/api/contacto-asesor/v1/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productoCodigo: state.form.productoCodigo,
          montoFinanciado: resultado.montoFinanciado,
          plazoMeses: state.form.plazoMeses,
          cuotaEstimada: resultado.cuotaConSeguro,
          canalOrigen: 'WEB',
        }),
      });
      alert('¡Tu solicitud fue enviada! Un asesor se contactará contigo pronto.');
    } catch {
      alert('No se pudo enviar la solicitud. Inténtalo nuevamente.');
    }
  }, [resultado, state.form]);

  const hero = HERO_COPY[state.paso];

  // ── Loading / Error ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="sim-loading" role="status" aria-live="polite">
        <Loading description="Cargando simulador de crédito…" withOverlay={false} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="sim-loading">
        <InlineNotification kind="error" title="Error al cargar el simulador" subtitle={error} />
        <Button kind="ghost" size="sm" onClick={() => window.location.reload()} style={{ marginTop: '1rem' }}>
          Reintentar
        </Button>
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="sim-shell">

      {/* ── Shell Header ────────────────────────────────────────────────── */}
      <Header aria-label="ACME Banco — Simulador de Crédito" className="sim-header">
        <SkipToContent />
        <HeaderName prefix="ACME" href="/">BANCO</HeaderName>
        <HeaderGlobalBar>
          <HeaderGlobalAction aria-label="Notificaciones" tooltipAlignment="end">
            <Notification size={20} />
          </HeaderGlobalAction>
          <HeaderGlobalAction aria-label="Mi perfil" tooltipAlignment="end">
            <UserAvatar size={20} />
          </HeaderGlobalAction>
        </HeaderGlobalBar>
      </Header>

      {/* ── Main layout — Hero izquierda + Formulario derecha ───────────── */}
      <div className="sim-main" role="main">

        {/* ── Hero Panel (columna izquierda, fija) ─────────────────────── */}
        <aside className="sim-hero" aria-label="Información del paso actual">
          {/* Decorative illustration — invisible to screen readers */}
          <div className="sim-hero__illustration" aria-hidden="true">
            <svg width="280" height="220" viewBox="0 0 280 220" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Building silhouettes */}
              <rect x="20" y="80" width="40" height="140" fill="rgba(255,255,255,0.04)" />
              <rect x="28" y="60" width="24" height="160" fill="rgba(255,255,255,0.06)" />
              <rect x="70" y="100" width="50" height="120" fill="rgba(255,255,255,0.04)" />
              <rect x="80" y="70" width="30" height="150" fill="rgba(255,255,255,0.07)" />
              <rect x="130" y="50" width="60" height="170" fill="rgba(255,255,255,0.05)" />
              <rect x="145" y="30" width="30" height="190" fill="rgba(255,255,255,0.08)" />
              <rect x="200" y="90" width="45" height="130" fill="rgba(255,255,255,0.04)" />
              <rect x="210" y="65" width="25" height="155" fill="rgba(255,255,255,0.06)" />
              {/* Window grid lines */}
              <line x1="20" y1="100" x2="60" y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
              <line x1="20" y1="120" x2="60" y2="120" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
              <line x1="20" y1="140" x2="60" y2="140" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
              <line x1="40" y1="80" x2="40" y2="220" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
              {/* Teal accent circle */}
              <circle cx="240" cy="40" r="60" fill="rgba(0,157,154,0.08)" />
              <circle cx="240" cy="40" r="35" fill="rgba(0,157,154,0.06)" />
            </svg>
          </div>
          <div className="sim-hero__content">
            <span className="sim-hero__eyebrow">{hero.eyebrow}</span>
            <h1 className="sim-hero__title">{hero.title}</h1>
            <p className="sim-hero__body">{hero.body}</p>
          </div>
          <div className="sim-hero__accent" aria-hidden="true" />
        </aside>

        {/* ── Content Area (columna derecha, scrollable) ───────────────── */}
        <div className="sim-content">

          {/* Advisor Ribbon — nombre del producto seleccionado */}
          {state.form.productoCodigo && (
            <div className="sim-advisor-ribbon" role="complementary">
              <span className="sim-advisor-ribbon__label">
                {PRODUCTO_META[state.form.productoCodigo].label}
              </span>
            </div>
          )}

          {/* Step Form */}
          <div className="sim-step-form">

            {/* Progress Indicator */}
            <ProgressIndicator
              currentIndex={state.paso - 1}
              className="sim-progress"
              spaceEqually
            >
              {STEP_LABELS.map((step, idx) => (
                <ProgressStep
                  key={step.label}
                  label={step.label}
                  description={step.description}
                  disabled={idx > state.paso - 1}
                  onClick={() => {
                    if (idx < state.paso - 1) setPaso((idx + 1) as Paso);
                  }}
                />
              ))}
            </ProgressIndicator>

            {/* Step content */}
            <div className="sim-step-content" aria-live="polite">
              {state.paso === 1 && (
                <Step1Producto
                  productos={productos}
                  selected={state.form.productoCodigo}
                  onSelect={handleSelectProducto}
                />
              )}
              {state.paso === 2 && (
                <Step2Condiciones
                  form={state.form}
                  producto={selectedProducto}
                  onChange={setForm}
                />
              )}
              {state.paso === 3 && (
                <Step3Personalizacion
                  form={state.form}
                  producto={selectedProducto}
                  onChange={setForm}
                />
              )}
              {state.paso === 4 && resultado && (
                <Step4Resultado
                  form={state.form}
                  resultado={resultado}
                  onContactarAsesor={handleContactarAsesor}
                  onReset={() => dispatch({ type: 'RESET' })}
                />
              )}
              {state.paso === 4 && !resultado && (
                <div>
                  <InlineNotification
                    kind="error"
                    title="No se pudo calcular la simulación"
                    subtitle="Por favor revisa los datos ingresados."
                  />
                  <Button kind="ghost" size="sm" onClick={() => setPaso(2)} style={{ marginTop: '1rem' }}>
                    Volver a condiciones
                  </Button>
                </div>
              )}
            </div>

          </div>

          {/* Bottom Advisor Ribbon — solo paso 4 (ANTES del action footer sticky) */}
          {state.paso === 4 && (
            <div className="sim-bottom-ribbon">
              <div className="sim-bottom-ribbon__text">
                <strong className="sim-bottom-ribbon__heading">
                  ¿Quieres que un asesor te oriente?
                </strong>
                <span className="sim-bottom-ribbon__sub">
                  Cuéntanos tu caso y encontramos las mejores condiciones para ti.
                </span>
              </div>
              <div className="sim-bottom-ribbon__actions">
                <Button
                  kind="primary"
                  renderIcon={Chat}
                  onClick={handleContactarAsesor}
                  size="sm"
                >
                  Hablar con un asesor
                </Button>
                <Button
                  kind="ghost"
                  renderIcon={Renew}
                  onClick={() => dispatch({ type: 'RESET' })}
                  size="sm"
                >
                  Simular otro crédito
                </Button>
              </div>
            </div>
          )}

          {/* Action Footer — pasos 1-3 */}
          {state.paso < 4 && (
            <div className="sim-action-footer">
              {state.paso > 1 ? (
                <Button kind="secondary" renderIcon={ArrowLeft} onClick={handleBack} size="md">
                  Atrás
                </Button>
              ) : (
                <span />
              )}
              <Button
                kind="primary"
                renderIcon={ArrowRight}
                onClick={handleContinue}
                disabled={!canContinue()}
                size="md"
              >
                Continuar
              </Button>
            </div>
          )}

          {/* Action Footer — paso 4: solo Atrás */}
          {state.paso === 4 && (
            <div className="sim-action-footer">
              <Button kind="secondary" renderIcon={ArrowLeft} onClick={handleBack} size="md">
                Atrás
              </Button>
              <span />
            </div>
          )}

        </div>
        {/* /sim-content */}

      </div>
      {/* /sim-main */}

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="sim-footer" role="contentinfo">
        <span>© {new Date().getFullYear()} ACME Banco · Simulación referencial · Sin evaluación crediticia</span>
        <span className="sim-footer__right">IBM Carbon Design System · WCAG 2.1 AA</span>
      </footer>

    </div>
  );
};
