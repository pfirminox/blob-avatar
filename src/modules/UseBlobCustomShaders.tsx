import { MeshTransmissionMaterial } from "@react-three/drei";
import { useEffect } from "react";
import { MeshPhysicalMaterial, type Group, type Material, type Mesh } from "three";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

export default (props: {gltf:  GLTF}) =>{
    const {gltf} = props;
    useEffect(()=>{
        if(!gltf) return;
        console.log(gltf);

        gltf.scene.traverse((child: any)=>{
            if(child.isMesh)
                if(((child as Mesh).material as Material).name == 'BodyMaterial'){
                    let newMaterial = new MeshPhysicalMaterial({
                        transmission: 1,
                        transparent: true,      // full glass effect
                        thickness: 0.2,
                        roughness: 0.35,
                        metalness: 0,
                        color: 'rgba(79, 111, 255, 1)',
                        specularColor: 'rgba(133, 186, 255, 1)',
                        sheenColor: 'rgba(89, 161, 255, 1)',
                        specularIntensity: 5.0,
                        sheen: 5.0,
                        sheenRoughness: 0.1,
                    })
                    child.material = newMaterial;
                }
        });
    }, [gltf])
    return <></>;
}