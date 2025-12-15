import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, CircularProgress } from '@mui/material';
import { downloadCSV } from '../utils/data';

export type DataTableProps = {
  data: any[];
};

export const DataTable = ({ data }: DataTableProps) => {
  const str = data.length === 1 ? 'observation found' : 'observations found';

  const downloadBtn = (
    <Button variant='outlined' onClick={() => downloadCSV(data)}>
      Download CSV
    </Button>
  );

  const getINatCell = (row: any) => {
    if (row.loading) {
      return <CircularProgress size={20} />;
    }
    if (row.iNatNumber) {
      return (
        <a
          href={`https://www.inaturalist.org/observations/${row.iNatNumber}`}
          target='_blank'
          rel='noreferrer'
        >
          {row.iNatNumber}
        </a>
      );
    }
    return 'Not found';
  };

  return (
    <>
      <p>
        <b>{data.length}</b> {str}. {downloadBtn}
      </p>

      <TableContainer component={Paper} sx={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Voucher Number</b>
              </TableCell>
              <TableCell>
                <b>iNat Number</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row: any) => (
              <TableRow key={row.voucherNumber}>
                <TableCell>{row.voucherNumber}</TableCell>
                <TableCell>{getINatCell(row)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
