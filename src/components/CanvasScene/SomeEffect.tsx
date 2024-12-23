// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { PointMaterial, Points } from '@react-three/drei';
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';


const SomeEffect = () => {
  const pointsRef = useRef();
  const [positions] = useState(() => {
    const particles = 500; // Number of particles
    const positions = new Float32Array(particles * 3);
    for (let i = 0; i < particles; i++) {
      const angle = Math.random() * 2 * Math.PI; // Random angle
      const radius = Math.random() * 5; // Random radius
      const x = Math.cos(angle) * radius;
      const y = Math.random() * 2; // Random vertical offset
      const z = Math.sin(angle) * radius;
      positions.set([x, y, z], i * 3);
    }
    return positions;
  });

  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions}>
      <PointMaterial size={0.05} color="yellow" />
    </Points>
  );
};

export default SomeEffect;