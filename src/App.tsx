import CanvasScene from './components/CanvasScene/CanvasScene.tsx';
import QrScannerComponent from './components/QrScanner';
import { useState } from 'react';
import styled from '@emotion/styled';

const App = () => {
  const [showHort, setShowHort] = useState(true);

  return (
    <Wrapper>
      <QrScannerComponent setShowHort={setShowHort} />

      {1 && (
        <CanvasWrapper showHort={showHort}>
          <CanvasScene />
        </CanvasWrapper>
      )}
    </Wrapper>
  );
};

export default App;

const Wrapper = styled.main`

`;
const CanvasWrapper = styled.div<{ showHort: boolean }>`
    display: ${({ showHort }) => (showHort ? 'block' : 'none')};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;
    width: 90vw;
    height: 40vh;
`;