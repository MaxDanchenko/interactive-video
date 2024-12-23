import { useCallback, useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';

const useQrScanner = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isValidationProcessing = useRef(false);
  const hasScanned = useRef(false);

  const [isScannerActive, setIsScannerActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  const handleCloseScanner = useCallback(() => {
    setIsScannerActive(false);
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement || !isScannerActive || isValidationProcessing.current || hasScanned.current) {
      return;
    }

    const qrScanner = new QrScanner(videoElement, async (result) => {
      isValidationProcessing.current = true;
      hasScanned.current = true;

      setScanResult(result);

      setTimeout(() => {
        setIsScannerActive(false);
        setScanResult(null);
        qrScanner.stop();
      }, 15000);

      isValidationProcessing.current = false;
      hasScanned.current = false;
    });

    setIsLoading(true);

    qrScanner
      .start()
      .then(() => setIsLoading(false))
      .catch((error) => {
        console.error('Error starting QR Scanner:', error);
        setIsLoading(false);
      });

    return () => {
      qrScanner.stop();
      isValidationProcessing.current = false;
      hasScanned.current = false;
      setIsLoading(false);
    };
  }, [isScannerActive]);

  return {
    videoRef,
    isScannerActive,
    isLoading,
    scanResult,
    handleCloseScanner,
    setIsScannerActive,
  };
};

export default useQrScanner;
