# Fórmulas de negocio — Simulador de Crédito (extracto PRD sección 5.5)

> Insumo para crear manualmente el Skill `reglas-negocio-credito` en Bob.

| Cálculo | Fórmula | Variables |
|---|---|---|
| Monto financiado | `M = ValorDelBien - CuotaInicial - Bono` | |
| Tasa periódica (TEM) | `TEM = (1 + TEA)^(1/12) - 1` | TEA configurada por producto |
| Cuota base | `Cuota = M × [i(1+i)^n] / [(1+i)^n - 1]` | M = monto financiado, i = TEM, n = plazo en meses |
| Interés del período | `Interes = SaldoPendiente × i` | |
| Capital amortizado | `Capital = CuotaBase - Interes` | |
| Saldo pendiente | `SaldoNuevo = SaldoAnterior - Capital` | |
| Seguro de desgravamen | `Seguro = SaldoPendiente × tasaSeguro` | tasaSeguro: 0.40% sin devolución, 0.72% con devolución |
| Pago total del período | `Pago = CuotaBase + Seguro` | |
| Fecha primera cuota | Regla basada en fecha de desembolso + día de pago | |

## Reglas especiales (solo Crédito al Consumo)

- **Cuotas dobles**: modifica el pago de los períodos configurados según la regla del producto (no aplica a Automotriz, Comercial, Hipotecario).
- **Período de gracia**: 30 o 60 días. Durante la gracia los intereses se siguen generando sobre el capital y se incorporan al cálculo de la cuota una vez finalizado el período. No aplica a Automotriz, Comercial, Hipotecario.

## Tasas TEA por producto (moneda nacional)

| Producto | TEA mínima | TEA máxima |
|---|---|---|
| Crédito al Consumo | 15.99% | 114.13% |
| Crédito Automotriz | 40.00% | 114.13% |
| Crédito Comercial | 45.00% | 114.13% |
| Crédito Hipotecario | 9.80% | 14.90% |

La TEA se calcula sobre base de 360 días.
