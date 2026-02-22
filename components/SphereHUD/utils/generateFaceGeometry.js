import * as THREE from 'three';

/**
 * Generates hexagonal face positions distributed on a sphere.
 * Each face is a regular hexagon tangent to the sphere surface.
 *
 * @param {number} radius - Sphere radius (default 1.5)
 * @param {number} totalFaces - Number of hexagonal faces (default 30)
 * @returns {Array<{center, normal, vertices, textPosition, faceRadius}>}
 */
export function generateFaceGeometry(radius = 1.5, totalFaces = 30) {
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  // Scale face radius inversely with count so they don't overlap
  const faceRadius = 0.22 * Math.sqrt(30 / totalFaces);

  const faces = [];

  for (let i = 0; i < totalFaces; i++) {
    // Fibonacci sphere distribution
    const y = 1 - (i / (totalFaces - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;

    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;

    // Center on sphere surface
    const center = new THREE.Vector3(x * radius, y * radius, z * radius);

    // Normal = outward direction
    const normal = center.clone().normalize();

    // Build tangent frame (U, V perpendicular to normal)
    const up = Math.abs(normal.y) < 0.99
      ? new THREE.Vector3(0, 1, 0)
      : new THREE.Vector3(1, 0, 0);

    const u = new THREE.Vector3().crossVectors(up, normal).normalize();
    const v = new THREE.Vector3().crossVectors(normal, u).normalize();

    // Regular hexagon: 6 vertices in tangent plane
    const vertices = [];
    for (let j = 0; j < 6; j++) {
      const a = (Math.PI / 3) * j;
      const px = center.x + faceRadius * (Math.cos(a) * u.x + Math.sin(a) * v.x);
      const py = center.y + faceRadius * (Math.cos(a) * u.y + Math.sin(a) * v.y);
      const pz = center.z + faceRadius * (Math.cos(a) * u.z + Math.sin(a) * v.z);
      vertices.push(new THREE.Vector3(px, py, pz));
    }

    // Text position: offset outward from center along normal
    const textPosition = center.clone().add(normal.clone().multiplyScalar(faceRadius * 0.5));

    faces.push({
      center: [center.x, center.y, center.z],
      normal: [normal.x, normal.y, normal.z],
      vertices,
      textPosition: [textPosition.x, textPosition.y, textPosition.z],
      faceRadius,
    });
  }

  return faces;
}
