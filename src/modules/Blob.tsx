import { Plane, useAnimations } from "@react-three/drei"
import { useContext, useEffect, useRef, useState } from "react"
import { Group, LoopOnce, Vector2 } from "three"
import { CanvasContext } from "../App"
import UseDragDynamics from "./UseDragDynamics"
import { useChromeGLTF } from "./useChromeGLTF"

export default () => {
    const gltf = useChromeGLTF("assets/blob.glb", "assets/draco/")
    const canvasContext = useContext(CanvasContext);
    const isDragging = useRef(false);
    const rootRef = useRef<Group>(null!);
    const constrainRef = useRef<Group>(null!);
    const meshRef = useRef<Group>(null!);
    const helperRef = useRef<Group>(null!);
    const rawInput = useRef([0,0]);
    const {actions, mixer} = useAnimations(gltf?.animations ?? [], gltf?.scene)
    const [currentAnimations, setCurrentAnimations] = useState(['Idle', 'Blink']);
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        if (!window) return;
        if (!canvasContext) return;

        const onPointerMove = (e: PointerEvent) => {
            if (!isDragging.current) return;

            let newCanvasPosition = new Vector2(
                canvasContext.position[0] + e.movementX,
                canvasContext.position[1] + e.movementY
            );

            canvasContext.setPosition([newCanvasPosition.x, newCanvasPosition.y]);
        };

        const onPointerUp = () => {
            isDragging.current = false;
        };

        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", onPointerUp);

        return () => {
            window.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("pointerup", onPointerUp);
        };
    }, [canvasContext])

    const playWithRandomDelay = () => {
        // random delay between 1s and 3s (adjust as you like)
        const delay = Math.random() * 3 + 3;

        timeoutRef.current = setTimeout(() => {
        if (actions['TurnAround']) {
            actions['TurnAround'].reset().play();
        }
        }, delay * 1000);
    };

    useEffect(()=>{
        if(!gltf || !actions) return;

        currentAnimations.forEach(anim =>{
            actions[anim]?.play();
        })

        if(actions['TurnAround']){
            actions['TurnAround'].setLoop(LoopOnce, 0);
            actions['TurnAround'].clampWhenFinished = true;
        }

        playWithRandomDelay();

        mixer.addEventListener("finished", () => {
            playWithRandomDelay(); // schedule next play
        });

    }, [actions])

    const onPointerDown = (e: PointerEvent) => {
        e.stopPropagation();
        isDragging.current = true;
    }

    if (!gltf || !gltf.scene) return null

    return (
        <>
            <group ref={rootRef}>
                <group ref={constrainRef}>
                    <primitive
                        ref={meshRef}
                        object={gltf.scene}
                        rotation={[0, 20 * Math.PI / 180, 0]}
                        position={[0, -0.5, 0]}
                        onPointerDown={(e: PointerEvent) => onPointerDown(e)}></primitive>
                    </group>
                <group ref={helperRef} visible={false}>
                    <Plane position={[0.5, 0,0]} args={[1,.02]}>
                        <meshBasicMaterial color="red" />
                    </Plane>
                </group>
            </group>
            <UseDragDynamics
                rootRef={rootRef.current}
                constrainRef={constrainRef.current}
                helper={helperRef.current}
                rawInput={rawInput.current} />;
        </>
    )
}