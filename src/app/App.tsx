'use client';

import React, { createContext, Ref, RefObject, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import Blob from './modules/Blob';

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
                height: `${canvasSize[1]}px`,
            }}
        >
            <Canvas>
                <PerspectiveCamera position={[0, 0, 4]} fov={35} makeDefault />
                <Environment preset={'city'} />
                <CanvasContext.Provider value={{
                    setPosition: (value) => SetCanvasPosition(value), 
                    position: canvasPosition,
                    size: canvasSize}} >
                    <Blob />
                </CanvasContext.Provider>
            </Canvas>
        </div>
    );
}
