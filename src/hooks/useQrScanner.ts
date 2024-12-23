import { useRef, useState } from 'react';

const useQrScanner = () => {
  const [isScannerActive, setScannerActive] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const startScanner = async () => {
    console.log('Starting scanner...');
    if (!videoRef.current) {
      console.error('Video element is not initialized');
      return;
    }

    try {
      // Try to access the back camera first
      let stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } }, // Prefer the back camera
      });

      // Check if the stream contains any video tracks
      if (!stream.getVideoTracks().length) {
        console.warn('No back camera found. Switching to front camera...');
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'user' } }, // Fallback to the front camera
        });
      }

      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setScannerActive(true);
      console.log('Camera started');
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
    console.log('Camera stopped');
  };

  return {
    isScannerActive,
    scanResult,
    videoRef,
    startScanner,
    stopScanner,
    setScanResult, // Expose setScanResult if you need manual result handling
  };
};

export default useQrScanner;
