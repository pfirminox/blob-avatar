import { useFrame, useThree } from "@react-three/fiber";
import { useContext, useRef } from "react";
import { Group, Quaternion, Vector3 } from "three";
import { CanvasContext } from "../App";
import { isWithinAngleRange } from "./Utils";

/* INFO - Spring like interpolation system

velocity += (target - current) * stiffness
velocity *= damping
current += velocity

*/

export default (props: { 
        rootRef: Group, 
        constrainRef: Group, 
        helper: Group
        rawInput: number[]}) => 
{
    const { camera, size } = useThree();
    const canvasContext = useContext(CanvasContext);
    const { rootRef, constrainRef, helper } = props;
    const prevPosition = useRef(canvasContext?.position);
    const speed = useRef(new Vector3());
    const direction = useRef(new Vector3());
    const rawDirection = useRef(new Vector3());
    const targetScale = useRef(new Vector3(1, 1, 1));
    const springScale = useRef(new Vector3());
    const targetVelocity = useRef(new Vector3());
    const springVelocity = useRef(new Vector3());

    const ProcessMovingSpeed = () =>{
        if (!canvasContext || !prevPosition.current) return;

        speed.current = new Vector3(
            (canvasContext.position[0] - prevPosition.current[0]) / size.width,
            (canvasContext.position[1] - prevPosition.current[1]) / size.height,
            0
        );

        prevPosition.current = [...canvasContext.position];

        // --- Spring physics ---
        const stiffness = 0.2; // how strong the spring pulls back
        const damping = 0.8;   // how much energy is lost per frame
        const magnitude = 0.2;
        const springSpeed = 0.5;
        const maxOffset = 0.01;

        const speedLen = speed.current.length();
        if (speedLen > 0) {
            targetVelocity.current.set(
                speed.current.x,
                -speed.current.y,
                speed.current.z
            ).multiplyScalar(magnitude);
        } else {
            let target = new Vector3().subVectors(new Vector3(), rootRef.position);
            targetVelocity.current.set(target.x, target.y, target.z); // return to normal
        }

        // force = (target - current) * stiffness
        const force = new Vector3().subVectors(targetVelocity.current, new Vector3()).multiplyScalar(stiffness);

        springVelocity.current.add(force);          // integrate force
        springVelocity.current.multiplyScalar(damping); // apply damping.

        rootRef.position.add(springVelocity.current.clone().multiplyScalar(springSpeed).clampScalar(-maxOffset, maxOffset));

    }
    const ProcessStretchSquash = () => {
        const speedLen = speed.current.length();
        // Update targetScale based on speed
        if (speedLen > 0) {
            targetScale.current.set(
                Math.max(1, Math.min(1.5, 1 + speedLen * 5)),   // X stretch
                Math.max(0.8, Math.min(1, 1 - speedLen * 5)),   // Y squash
                1
            );
        } else {
            targetScale.current.set(1, 1, 1); // return to normal
        }

        // --- Spring physics ---
        const stiffness = 0.2; // how strong the spring pulls back
        const damping = 0.8;
        const springSpeed = 0.5;  // how much energy is lost per frame

        // force = (target - current) * stiffness
        const force = new Vector3().subVectors(targetScale.current, rootRef.scale).multiplyScalar(stiffness);

        springScale.current.add(force);          // integrate force
        springScale.current.multiplyScalar(damping); // apply damping

        rootRef.scale.add(springScale.current.clone().multiplyScalar(springSpeed)); // update scale
    }
    const ProcessRotation = () => {
        if (speed.current.length() == 0) return;

        const rawAngle = Math.atan2(-speed.current.y, speed.current.x); // screen Y inverted
        const currentAngle = helper.rotation.z; // screen Y inverted
        const {within, diffDeg} = isWithinAngleRange(rawAngle, currentAngle, 60);

        direction.current = !within? speed.current : direction.current.lerp(speed.current, 0.2);

        const angle = Math.atan2(-direction.current.y, direction.current.x); // screen Y inverted
        const quat = new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), angle);

        if(!within){
            rootRef.setRotationFromQuaternion(quat);
        }
        else{
            rootRef.quaternion.slerp(quat, 0.2); // smooth lerp
        }

        //Cancel out the inner object rotation
        constrainRef.quaternion.copy(rootRef.quaternion).invert(); 
    }
    useFrame((state) => {
        if (!rootRef || !constrainRef || !helper) return

        ProcessMovingSpeed();
        ProcessStretchSquash();
        ProcessRotation();
    })
    const Log = () => {
     /*   if(!helper.current) return;
        const rawAngle = Math.atan2(-rawDirection.current.y, rawDirection.current.x); // screen Y inverted
        const currentAngle = helper.current.rotation.z; // screen Y inverted

        const {within, diffDeg} = isWithinAngleRange(rawAngle, currentAngle, 10)
        
        console.log(rawAngle, currentAngle);
        console.log(`delta = ${diffDeg.toFixed(2)}°  within ±10°? ${within}`);*/
        console.log(speed.current, springVelocity.current);
    }
    return (<>
        {/*Log()*/}
    </>);
}