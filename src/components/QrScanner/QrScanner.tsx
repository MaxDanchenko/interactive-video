
import styled from '@emotion/styled';
import useQrScanner from '../../hooks/useQrScanner.ts';

const QrScannerComponent = () => {
  const {
    isScannerActive,
    scanResult,
    videoRef,
    startScanner,
    stopScanner,
  } = useQrScanner();

  return (
    <Wrapper>
      {!isScannerActive && (
        <StartButton onClick={startScanner}>Start Scanner</StartButton>
      )}
      {isScannerActive && (
        <div>
          <video
            ref={videoRef}
            playsInline
            muted
            style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <Overlay>
            <BlurredTop />
            <BlurredBottom />
            <BlurredLeft />
            <BlurredRight />
          </Overlay>
          <ScanFrame>
            <CornerMarker className="top-left" />
            <CornerMarker className="top-right" />
            <CornerMarker className="bottom-left" />
            <CornerMarker className="bottom-right" />
          </ScanFrame>
          <StopButton onClick={stopScanner}>Stop Scanner</StopButton>
        </div>
      )}
      {scanResult && <ResultMessage>Scanned Result: {scanResult}</ResultMessage>}
    </Wrapper>
  );
};

export default QrScannerComponent;

const Wrapper = styled.div`
    position: relative;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: black;
`;

const StartButton = styled.button`
    padding: 10px 20px;
    background-color: #00cc00;
    color: white;
    font-size: 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
`;

const StopButton = styled(StartButton)`
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: #cc0000;
`;

const ResultMessage = styled.div`
    margin-top: 20px;
    color: white;
    font-size: 18px;
    text-align: center;
`;

// Reuse Overlay, Blurred sections, ScanFrame, and CornerMarker styles
const Overlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
`;

const BlurredTop = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(50vh - 150px);
    backdrop-filter: blur(2px);
    background-color: rgba(0, 0, 0, 0.2);
`;

const BlurredBottom = styled(BlurredTop)`
    top: auto;
    bottom: 0;
`;

const BlurredLeft = styled.div`
    position: absolute;
    top: calc(50vh - 150px);
    left: 0;
    width: calc(50vw - 150px);
    height: 300px;
    backdrop-filter: blur(2px);
    background-color: rgba(0, 0, 0, 0.2);
`;

const BlurredRight = styled(BlurredLeft)`
    left: auto;
    right: 0;
`;

const ScanFrame = styled.div`
    position: absolute;
    width: 80vw;
    height: 80vw;
    max-width: 300px;
    max-height: 300px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
`;

const CornerMarker = styled.div`
  position: absolute;
  width: 50px;
  height: 50px;
  border: 3px solid #00cc00;
  pointer-events: none;

  &.top-left {
    top: 0;
    left: 0;
    border-right: none;
    border-bottom: none;
  }

  &.top-right {
    top: 0;
    right: 0;
    border-left: none;
    border-bottom: none;
  }

  &.bottom-left {
    bottom: 0;
    left: 0;
    border-right: none;
    border-top: none;
  }

  &.bottom-right {
    bottom: 0;
    right: 0;
    border-left: none;
    border-top: none;
  }
`;
