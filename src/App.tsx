'use client';

import { createContext, Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import React from 'react';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { KernelSize } from 'postprocessing';
import { ACESFilmicToneMapping } from 'three';
const Blob = React.lazy(() => import('./modules/Blob'));

export const CanvasContext = createContext<{
    setPosition: (position: number[]) => void ,
    position: number[],
    size: number[] } | 
    undefined>(undefined);

export default function App() {
    const [canvasPosition, setCanvasPosition] = useState([0,0]);
    const [canvasSize, setCanvasSize] = useState([250,250]);

    const SetCanvasPosition = (position: number[]) => {
        setCanvasPosition(position);
    }

    useEffect(()=>{
        if (!window) return;

        setCanvasPosition([window.innerWidth/2 - canvasSize[0]/2, window.innerHeight/2 - canvasSize[1]/2]);
    },[])
    return (
        <div
            style={{
                position: "absolute", // parent container positioning
                top: canvasPosition[1],
                left: canvasPosition[0],
                width: `${canvasSize[0]}px`,
                height: `${canvasSize[1]}px`/*,
                backgroundColor: 'rgba(0, 255, 0, 0.1)'*/
            }}
        >
            <Canvas gl={{
                    preserveDrawingBuffer: true,
                    toneMapping: ACESFilmicToneMapping,
                    alpha:true}}>
                <PerspectiveCamera position={[0, 0, 4]} fov={35} makeDefault />
                <Environment preset={'forest'} />
                <CanvasContext.Provider value={{
                    setPosition: (value) => SetCanvasPosition(value), 
                    position: canvasPosition,
                    size: canvasSize}} >
                    <Suspense fallback={null}>
                        <Blob />
                    </Suspense>
                </CanvasContext.Provider>
                <EffectComposer>
                    <Bloom 
                        intensity={0.3}
                        luminanceThreshold={0.9}
                        luminanceSmoothing={0.025}
                        kernelSize={KernelSize.MEDIUM}
                        mipmapBlur={false}
                    />
                </EffectComposer>
            </Canvas>
        </div>
    );
}