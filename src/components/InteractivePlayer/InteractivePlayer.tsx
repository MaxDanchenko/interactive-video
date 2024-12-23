import styled from '@emotion/styled';
import ReactPlayer from 'react-player';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Modal } from '@mui/material';

const InteractiveVideo: React.FC = () => {
  const [playing, setPlaying] = useState(true);
  const [showTask, setShowTask] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);
  const drawnPath = useRef<[number, number][]>([]);
  const targetPath = useRef<[number, number][]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleProgress = (progress: { playedSeconds: number }) => {
    const currentTime = progress.playedSeconds;

    if (Math.round(currentTime) === 24 && !showTask) {
      setPlaying(false);
      setShowTask(true);
    }
  };

  const drawDashedFigure = useCallback(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Draw dashed circle
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 3;

    const centerX = canvasRef.current.width / 2;
    const centerY = canvasRef.current.height / 2;
    const radius = 50;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Store target path (circle)
    targetPath.current = generateCirclePath(centerX, centerY, radius);
  }, []);

  const generateCirclePath = (centerX: number, centerY: number, radius: number): [number, number][] => {
    const points: [number, number][] = [];
    for (let angle = 0; angle < 360; angle += 5) {
      const radians = (angle * Math.PI) / 180;
      const x = centerX + radius * Math.cos(radians);
      const y = centerY + radius * Math.sin(radians);
      points.push([x, y]);
    }
    return points;
  };


  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    drawnPath.current = [[x, y]]; // Start a new path
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !canvasRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    drawnPath.current.push([x, y]);

    // Draw the path
    ctx.setLineDash([]); // Solid line for user drawing
    ctx.beginPath();
    const prevPoint = drawnPath.current[drawnPath.current.length - 2];
    if (prevPoint) {
      ctx.moveTo(prevPoint[0], prevPoint[1]);
    }
    ctx.lineTo(x, y);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const checkDrawing = useCallback(() => {
    // Simple comparison logic: Check if the user path matches the target path
    const matched = comparePaths(drawnPath.current, targetPath.current);
    if (matched) {
      alert('Great! You matched the figure!');
      setPlaying(true);
      setShowTask(false);
    } else {
      alert('Try again!');
    }
  }, []);

  const comparePaths = (userPath: [number, number][], targetPath: [number, number][]): boolean => {
    if (userPath.length < 10) return false; // Too short to be a valid shape

    let matchedPoints = 0;
    targetPath.forEach(([tx, ty]) => {
      if (userPath.some(([ux, uy]) => Math.hypot(tx - ux, ty - uy) < 10)) {
        matchedPoints++;
      }
    });

    // Consider the gesture valid if enough points match
    return matchedPoints / targetPath.length > 0.8; // 80% match
  };


  const startTimer = useCallback(() => {
    setTimeLeft(5);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          checkDrawing();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [checkDrawing]);


  useEffect(() => {
    if (showTask) {
      drawDashedFigure();
      startTimer();
    } else {
      clearTimer();
    }
    return () => clearTimer();
  }, [drawDashedFigure, showTask, startTimer]);

  return (
    <Container>
      <VideoWrapper>
        {showTask && (
          <Modal open={showTask}>
            <Box>
              <Canvas
                ref={canvasRef}
                width={window.innerWidth}
                height={window.innerHeight}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              />
              <Timer>{timeLeft} seconds left</Timer>
            </Box>
          </Modal>
        )}
        <ReactPlayer
          url="src/assets/video/mavka.mp4"
          onProgress={handleProgress}
          width="100%"
          height="100%"
          playing={playing}
          controls
        />
      </VideoWrapper>
    </Container>
  );
};

export default InteractiveVideo;


const Container = styled.div`
    position: relative;
    width: 100vw;
    height: 100vh;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`;

const VideoWrapper = styled.div`
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    width: 100%;
    height: 100%;
`;

const Canvas = styled.canvas`
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.1);
    width: 100vw;
    height: 100vh;
`;

const Timer = styled.div`
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
`;

