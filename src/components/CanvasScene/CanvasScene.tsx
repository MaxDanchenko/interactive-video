import { Canvas } from '@react-three/fiber';
import Hort from './Hort.tsx';


const CanvasScene = () => {

  return (
    <Canvas
      camera={{
        position: [0, 4, 4],
        fov: 50,
        rotation: [-0.7, 0, 0],
      }}
      style={{ width: 'inherit', height: 'inherit' }}
    >
      {/* Lights */}
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <ambientLight intensity={1} />

      <Hort
        position={[0, -1, 0]}
        scale={[2, 2, 2]}
        rotation={[-1, 0, 0]}
      />
    </Canvas>
  );
};

export default CanvasScene;
