import jsQR from 'jsqr';
import React, { useEffect, useCallback, useLayoutEffect, useRef } from 'react';
import { IconButton } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';

let video: HTMLVideoElement;
let canvas: any;
let canvasElement: any;

function drawLine(
  begin: { x: number; y: number },
  end: { x: number; y: number },
  color: string
) {
  canvas.beginPath();
  canvas.moveTo(begin.x, begin.y);
  canvas.lineTo(end.x, end.y);
  canvas.lineWidth = 4;
  canvas.strokeStyle = color;
  canvas.stroke();
}

type WebCamProps = {
  onFindVoucherNumber: (voucherNumber: string) => void;
  onClose: () => void;
  onError: (err: string) => void;
};

export const WebCamDialog = ({
  onFindVoucherNumber,
  onClose,
  onError,
}: WebCamProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const dataRef = useRef<{ stream: MediaStream; found: boolean } | null>(null);

  const tick = useCallback(() => {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvasElement.hidden = false;
      canvasElement.height = video.videoHeight;
      canvasElement.width = video.videoWidth;
      canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
      var imageData = canvas.getImageData(
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );
      var code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code) {
        drawLine(
          code.location.topLeftCorner,
          code.location.topRightCorner,
          '#0066cc'
        );
        drawLine(
          code.location.topRightCorner,
          code.location.bottomRightCorner,
          '#0066cc'
        );
        drawLine(
          code.location.bottomRightCorner,
          code.location.bottomLeftCorner,
          '#0066cc'
        );
        drawLine(
          code.location.bottomLeftCorner,
          code.location.topLeftCorner,
          '#0066cc'
        );

        if (/BC\d{2}-\d{5}/.test(code.data) && !dataRef.current?.found) {
          dataRef.current!.found = true;
          onFindVoucherNumber(code.data);
        }
      }
    }

    requestAnimationFrame(tick);
  }, [canvasRef]);

  useLayoutEffect(() => {
    const media = navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
    });

    if (media) {
      media
        .then((stream) => {
          dataRef.current = {
            stream,
            found: false,
          };

          canvasElement = canvasRef.current!;
          canvas = canvasElement.getContext('2d');

          video = videoRef.current!;
          video.srcObject = stream;
          video.setAttribute('playsinline', 'true'); // required to tell iOS safari we don't want fullscreen
          video.play();

          requestAnimationFrame(tick);
        })
        .catch((error) => {
          onError(error.toString());
        });
    } else {
      console.log('no media', media);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (dataRef.current?.stream) {
        dataRef.current?.stream?.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <Dialog open={true}>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        Scan QR Code
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ margin: 0, padding: 0, marginBottom: -10 }}>
        <video ref={videoRef} style={{ display: 'none' }}></video>
        <canvas ref={canvasRef}></canvas>
      </DialogContent>
    </Dialog>
  );
};
