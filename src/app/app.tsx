import React from 'react';
import { Alert, Button } from '@mui/material';
import { WebCamDialog } from './WebCamDialog';
import { DataTable } from './DataTable';
import { findInatObservation } from '../utils/requests';

export const App = () => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [data, setData] = React.useState<any[]>([]);
  const [error, setError] = React.useState('');

  const onFindVoucherNumber = (voucherNumber: string) => {
    setModalOpen(false);

    const hasVoucherNum = data.find(
      (row) => row.voucherNumber === voucherNumber
    );
    if (hasVoucherNum) {
      return;
    }
    const newData = [
      ...data,
      { voucherNumber, iNatNumber: null, loading: true },
    ];
    setData(newData);

    (async () => {
      const id = await findInatObservation(voucherNumber);
      const updatedData = newData.map((row) => {
        if (row.voucherNumber === voucherNumber) {
          row.loading = false;
          row.iNatNumber = id;
        }
        return row;
      });

      setData(updatedData);
    })();
  };

  return (
    <div style={{ position: 'relative' }}>
      <h1>iNat number lookup</h1>

      <Button
        variant='contained'
        onClick={() => setModalOpen(true)}
        style={{ position: 'absolute', top: 0, right: 0 }}
      >
        Read QR Code
      </Button>

      <p>
        Click the button at the top right to load any Mycomap BC QR Code and
        find the corresponding iNat observation.
      </p>

      {error && <Alert severity='error'>{error}</Alert>}

      {modalOpen && (
        <WebCamDialog
          onFindVoucherNumber={onFindVoucherNumber}
          onClose={() => setModalOpen(false)}
          onError={(err: string) => {
            setError(err);
            setModalOpen(false);
          }}
        />
      )}

      {data.length > 0 && <DataTable data={data} />}
    </div>
  );
};
