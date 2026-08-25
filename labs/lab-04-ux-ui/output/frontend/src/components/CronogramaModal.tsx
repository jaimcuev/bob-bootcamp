import React from 'react';
import {
  Modal,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
} from '@carbon/react';
import type { PeriodoCronograma } from '../types/creditTypes';

interface Props {
  open: boolean;
  onClose: () => void;
  cronograma: PeriodoCronograma[];
  productoLabel: string;
}

const headers = [
  { key: 'numero',       header: '#' },
  { key: 'fecha',        header: 'Fecha' },
  { key: 'saldoInicial', header: 'Saldo Inicial' },
  { key: 'interes',      header: 'Interés' },
  { key: 'capital',      header: 'Capital' },
  { key: 'seguro',       header: 'Seguro' },
  { key: 'cuotaTotal',   header: 'Cuota Total' },
  { key: 'saldoFinal',   header: 'Saldo Final' },
];

function fmt(n: number): string {
  return `S/ ${n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export const CronogramaModal: React.FC<Props> = ({ open, onClose, cronograma, productoLabel }) => {
  const rows = cronograma.map((p) => ({
    id: String(p.numero),
    numero: p.numero,
    fecha: p.fecha,
    saldoInicial: fmt(p.saldoInicial),
    interes: fmt(p.interes),
    capital: fmt(p.capital),
    seguro: fmt(p.seguro),
    cuotaTotal: fmt(p.cuotaTotal),
    saldoFinal: fmt(p.saldoFinal),
  }));

  return (
    <Modal
      open={open}
      onRequestClose={onClose}
      modalHeading={`Cronograma de pagos — ${productoLabel}`}
      passiveModal
      size="lg"
      className="cronograma-modal"
      aria-label={`Cronograma de pagos de ${productoLabel}`}
    >
      <DataTable rows={rows} headers={headers} isSortable>
        {({ rows: tableRows, headers: tableHeaders, getTableProps, onInputChange }) => (
          <TableContainer>
            <TableToolbar>
              <TableToolbarContent>
                <TableToolbarSearch
                  onChange={onInputChange}
                  placeholder="Buscar período..."
                  persistent
                />
              </TableToolbarContent>
            </TableToolbar>
            <Table {...getTableProps()} size="sm">
              <TableHead>
                <TableRow>
                  {tableHeaders.map((header) => (
                    <TableHeader key={header.key}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableRows.map((row) => (
                  <TableRow key={row.id}>
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>{cell.value}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
    </Modal>
  );
};
