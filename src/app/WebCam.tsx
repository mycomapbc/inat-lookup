import jsQR from 'jsqr';
import React, { useEffect, useCallback, useLayoutEffect, useRef } from 'react';

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
};

export const WebCam = ({ onFindVoucherNumber }: WebCamProps) => {
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
      } else {
        // outputMessage.hidden = false;
        // outputData.parentElement.hidden = true;
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
          console.error('Error accessing media devices.', error);
        });
    } else {
      console.log('no media', media);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (dataRef.current!.stream) {
        dataRef.current!.stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div>
      <video ref={videoRef} style={{ display: 'none' }}></video>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};
