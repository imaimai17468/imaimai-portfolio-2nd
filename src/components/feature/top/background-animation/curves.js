import * as THREE from "three";

export const Circle = ({ centerX = 0, centerY = 0, radius = 5 }) => {
  return [
    [
      new THREE.Vector3(centerX + radius, centerY, 0),
      new THREE.Vector3(centerX + radius, centerY, radius),
      new THREE.Vector3(centerX - radius, centerY, radius),
      new THREE.Vector3(centerX - radius, centerY, 0),
    ],
    [
      new THREE.Vector3(centerX - radius, centerY, 0),
      new THREE.Vector3(centerX - radius, centerY, -radius),
      new THREE.Vector3(centerX + radius, centerY, -radius),
      new THREE.Vector3(centerX + radius, centerY, 0),
    ],
  ].map(([v0, v1, v2, v3]) => (
    <cubicBezierCurve3 key={`${v0.x}-${v1.x}-${v2.x}-${v3.x}`} v0={v0} v1={v1} v2={v2} v3={v3} />
  ));
};
