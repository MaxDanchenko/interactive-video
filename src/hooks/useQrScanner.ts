import { useRef, useState } from 'react';

const useQrScanner = () => {
  const [isScannerActive, setScannerActive] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startScanner = async () => {
    if (!videoRef.current) return;

    try {
      videoRef.current.srcObject = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      videoRef.current.play();
      setScannerActive(true);
    } catch (err) {
      console.error('Error starting camera stream:', err);
    }
  };

  const stopScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
    setScannerActive(false);
  };

  const handleScan = (result: string) => {
    console.log('Scanned Result:', result);
    setScanResult(result);
    stopScanner();
  };

  return {
    isScannerActive,
    scanResult,
    videoRef,
    startScanner,
    stopScanner,
    handleScan,
  };
};

export default useQrScanner;
