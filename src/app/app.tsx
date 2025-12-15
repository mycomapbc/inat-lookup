import React, { useEffect } from 'react';
import { Button } from '@mui/material';
import { WebCam } from './WebCam';

export const App = () => {
  const [running, setRunning] = React.useState(false);
  const [data, setData] = React.useState<any[]>([]);

  const onFindVoucherNumber = (voucherNumber: string) => {
    setRunning(false);
    setData((prevData: any[]) => [
      ...prevData,
      { voucherNumber, iNatNumber: null },
    ]);
  };

  return (
    <div>
      <h1>iNat number lookup</h1>

      <Button variant='contained' onClick={() => setRunning(true)}>
        Start webcam
      </Button>

      {running && <WebCam onFindVoucherNumber={onFindVoucherNumber} />}

      <table>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.voucherNumber}</td>
              <td>{item.iNatNumber || 'Loading...'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
