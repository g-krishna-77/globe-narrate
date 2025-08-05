import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, useTexture, Stars, Preload } from '@react-three/drei';
import { useRef, useState, Suspense, useEffect } from 'react';
import { Mesh, Vector3, BackSide, Vector2 } from 'three';

interface InteractiveGlobeProps {
  onLocationSelect: (coords: { lat: number; lon: number }) => void;
}

function EarthGlobe({ onLocationSelect }: { onLocationSelect: (coords: { lat: number; lon: number }) => void }) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // High-quality Earth textures for Google Earth-like appearance
  const earthTexture = useTexture('https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73909/world.topo.bathy.200412.3x5400x2700.jpg');
  const normalTexture = useTexture('https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73934/world.topo.bathy.200412.3x5400x2700.jpg');
  const specularTexture = useTexture('https://eoimages.gsfc.nasa.gov/images/imagerecords/74000/74518/world.topo.200407.3x5400x2700.jpg');
  
  const handleClick = (event: any) => {
    event.stopPropagation();
    
    if (event.point && meshRef.current) {
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
      args={[2, 128, 128]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <meshPhongMaterial
        map={earthTexture}
        normalMap={normalTexture}
        specularMap={specularTexture}
        normalScale={new Vector2(0.1, 0.1)}
        shininess={200}
        transparent={hovered}
        opacity={hovered ? 0.95 : 1.0}
      />
    </Sphere>
  );
}

function CloudLayer() {
  const cloudTexture = useTexture('https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57747/cloud_combined_2048.jpg');
  
  return (
    <Sphere args={[2.005, 64, 64]}>
      <meshLambertMaterial
        map={cloudTexture}
        transparent={true}
        opacity={0.3}
        depthWrite={false}
      />
    </Sphere>
  );
}

function AtmosphereGlow() {
  return (
    <Sphere args={[2.1, 64, 64]}>
      <meshBasicMaterial
        color="#87CEEB"
        transparent={true}
        opacity={0.15}
        side={BackSide}
      />
    </Sphere>
  );
}

function NightLights() {
  const nightTexture = useTexture('https://eoimages.gsfc.nasa.gov/images/imagerecords/55000/55167/earth_lights_lrg.jpg');
  
  return (
    <Sphere args={[1.99, 128, 128]}>
      <meshBasicMaterial
        map={nightTexture}
        transparent={true}
        opacity={0.6}
        blending={2} // AdditiveBlending
      />
    </Sphere>
  );
}

function StarField() {
  return (
    <Stars
      radius={300}
      depth={60}
      count={20000}
      factor={7}
      saturation={0}
      fade={true}
    />
  );
}

function LoadingFallback() {
  return (
    <Sphere args={[2, 32, 32]}>
      <meshStandardMaterial
        color="#4a90e2"
        roughness={0.3}
        metalness={0.1}
        transparent={true}
        opacity={0.9}
      />
    </Sphere>
  );
}

export default function InteractiveGlobe({ onLocationSelect }: InteractiveGlobeProps) {
  const [isDay, setIsDay] = useState(true);

  useEffect(() => {
    // Toggle day/night cycle every 30 seconds for demo
    const interval = setInterval(() => {
      setIsDay(prev => !prev);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden globe-glow">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ background: 'radial-gradient(circle, #0c1445 0%, #000000 100%)' }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Preload all />
        
        {/* Lighting setup for realistic Earth appearance */}
        <ambientLight intensity={0.2} color="#404080" />
        <directionalLight
          position={[5, 3, 5]}
          intensity={isDay ? 1.5 : 0.3}
          castShadow={false}
          color={isDay ? "#ffffff" : "#4080ff"}
        />
        <pointLight 
          position={[-5, -5, -5]} 
          intensity={0.4} 
          color="#4a90e2" 
        />
        
        <StarField />
        
        <Suspense fallback={<LoadingFallback />}>
          <EarthGlobe onLocationSelect={onLocationSelect} />
          <CloudLayer />
          {!isDay && <NightLights />}
          <AtmosphereGlow />
        </Suspense>
        
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={2.5}
          maxDistance={15}
          autoRotate={true}
          autoRotateSpeed={0.3}
          dampingFactor={0.05}
          enableDamping={true}
          rotateSpeed={0.5}
          zoomSpeed={0.8}
        />
      </Canvas>
      
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-4 left-4 text-primary-glow/80 text-sm font-medium backdrop-blur-sm bg-black/20 px-3 py-1 rounded-lg">
          🌍 Click anywhere on Earth to explore weather
        </div>
        <div className="absolute top-4 right-4 text-primary-glow/60 text-xs backdrop-blur-sm bg-black/20 px-2 py-1 rounded">
          {isDay ? '☀️ Day' : '🌙 Night'}
        </div>
        <div className="absolute bottom-4 right-4 text-muted-foreground/80 text-xs backdrop-blur-sm bg-black/20 px-2 py-1 rounded">
          Drag to rotate • Scroll to zoom
        </div>
        <div className="absolute bottom-4 left-4 text-muted-foreground/60 text-xs backdrop-blur-sm bg-black/20 px-2 py-1 rounded">
          High-resolution NASA imagery
        </div>
      </div>
    </div>
  );
}