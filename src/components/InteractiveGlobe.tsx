import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import { useRef, useState } from 'react';
import { Mesh, Vector3 } from 'three';

interface InteractiveGlobeProps {
  onLocationSelect: (coords: { lat: number; lon: number }) => void;
}

function Globe({ onLocationSelect }: { onLocationSelect: (coords: { lat: number; lon: number }) => void }) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const handleClick = (event: any) => {
    event.stopPropagation();
    
    if (event.point && meshRef.current) {
      // Convert 3D point to lat/lon coordinates
      const point = event.point as Vector3;
      const { x, y, z } = point;
      
      // Normalize the point to unit sphere
      const length = Math.sqrt(x * x + y * y + z * z);
      const normalizedY = y / length;
      const normalizedX = x / length;
      const normalizedZ = z / length;
      
      // Convert to lat/lon
      const lat = Math.asin(Math.max(-1, Math.min(1, normalizedY))) * (180 / Math.PI);
      const lon = Math.atan2(normalizedZ, normalizedX) * (180 / Math.PI);
      
      onLocationSelect({ lat, lon });
    }
  };

  const handlePointerOver = () => setHovered(true);
  const handlePointerOut = () => setHovered(false);

  return (
    <Sphere
      ref={meshRef}
      args={[2, 64, 64]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <meshStandardMaterial
        color={hovered ? "#5ba3f5" : "#4a90e2"}
        roughness={0.3}
        metalness={0.1}
        transparent={true}
        opacity={0.9}
      />
    </Sphere>
  );
}

function Stars() {
  return (
    <mesh>
      <sphereGeometry args={[100, 64, 64]} />
      <meshBasicMaterial
        color="#000015"
        side={2}
        transparent={true}
        opacity={0.8}
      />
    </mesh>
  );
}

export default function InteractiveGlobe({ onLocationSelect }: InteractiveGlobeProps) {
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden globe-glow">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow={false}
        />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#4a90e2" />
        
        <Stars />
        <Globe onLocationSelect={onLocationSelect} />
        
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={8}
          autoRotate={true}
          autoRotateSpeed={0.5}
          dampingFactor={0.1}
          enableDamping={true}
        />
      </Canvas>
      
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-4 left-4 text-primary-glow/80 text-sm font-medium">
          Click anywhere on the globe to explore weather
        </div>
        <div className="absolute bottom-4 right-4 text-muted-foreground text-xs">
          Drag to rotate • Scroll to zoom
        </div>
      </div>
    </div>
  );
}