import { useCallback, useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner'; // Import QrScanner library

const useQrScanner = () => {
  const [isScannerActive, setScannerActive] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);

  /**
   * Stop the scanner, destroy the QrScanner instance, and stop the video stream.
   */
  const stopScanner = useCallback(() => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }

    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }

    setScannerActive(false);
    setIsProcessing(false);
    console.log('Scanner stopped');
  }, []);

  /**
   * Start the scanner by initializing QrScanner and attaching a video stream to the video element.
   */
  const startScanner = useCallback(async () => {
    if (!videoRef.current) {
      console.error('Video element is not initialized');
      return;
    }

    try {
      // Access camera stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } }, // Prefer back camera
      });

      if (!stream.getVideoTracks().length) {
        console.warn('No video tracks found in stream');
        return;
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        console.log('Video playing with dimensions:', {
          width: videoRef.current.videoWidth,
          height: videoRef.current.videoHeight,
        });
      }

      // Initialize QrScanner
      const qrScanner = new QrScanner(videoRef.current!, async (result) => {
        if (isProcessing) return; // Prevent duplicate scans while processing
        setIsProcessing(true);
        console.log('QR Code detected:', result);
        setScanResult(result); // Save the scan result
        stopScanner(); // Stop scanner after a successful scan
      });

      qrScannerRef.current = qrScanner;
      qrScanner.start();
      setScannerActive(true);
      console.log('QR Scanner started');
    } catch (err) {
      console.error('Error starting camera or QR scanner:', err);
    }
  }, [stopScanner, isProcessing]);

  /**
   * Cleanup on unmount to ensure resources are released.
   */
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, [stopScanner]);

  return {
    isScannerActive,
    scanResult,
    videoRef,
    startScanner,
    stopScanner,
  };
};

export default useQrScanner;
