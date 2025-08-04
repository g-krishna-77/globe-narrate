import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import { useRef } from 'react';
import { Mesh } from 'three';

interface InteractiveGlobeProps {
  onLocationSelect: (coords: { lat: number; lon: number }) => void;
}

function Globe({ onLocationSelect }: { onLocationSelect: (coords: { lat: number; lon: number }) => void }) {
  const meshRef = useRef<Mesh>(null);
  
  const handleClick = (event: any) => {
    event.stopPropagation();
    
    if (event.point) {
      // Convert 3D point to lat/lon coordinates
      const { x, y, z } = event.point;
      const lat = Math.asin(y) * (180 / Math.PI);
      const lon = Math.atan2(z, x) * (180 / Math.PI);
      
      onLocationSelect({ lat, lon });
    }
  };

  return (
    <Sphere
      ref={meshRef}
      args={[2, 64, 64]}
      onClick={handleClick}
    >
      <meshStandardMaterial
        color="#4a90e2"
        roughness={0.1}
        metalness={0.1}
        transparent
        opacity={0.9}
        wireframe={false}
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
        transparent
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
      >
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
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
          autoRotate
          autoRotateSpeed={0.5}
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