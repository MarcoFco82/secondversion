import * as THREE from 'three';

/**
 * Generates face geometry data for N projects distributed on a sphere.
 * Each face is an equilateral triangle tangent to the sphere surface.
 *
 * @param {number} n - Number of faces (projects)
 * @param {number} radius - Sphere radius (default 1.5)
 * @returns {Array<{center, normal, vertices, textPosition, faceRadius}>}
 */
export function generateFaceGeometry(n, radius = 1.5) {
  if (n === 0) return [];

  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const K = 1.3;
  const faceRadius = Math.min(K / Math.sqrt(n), radius * 0.6);

  const faces = [];

  for (let i = 0; i < n; i++) {
    // Fibonacci sphere distribution
    const y = n === 1 ? 0 : 1 - (i / (n - 1)) * 2;
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

    // Equilateral triangle vertices in tangent plane
    const angles = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3];
    const vertices = angles.map((a) => {
      const px = center.x + faceRadius * (Math.cos(a) * u.x + Math.sin(a) * v.x);
      const py = center.y + faceRadius * (Math.cos(a) * u.y + Math.sin(a) * v.y);
      const pz = center.z + faceRadius * (Math.cos(a) * u.z + Math.sin(a) * v.z);
      return new THREE.Vector3(px, py, pz);
    });

    // Text position: offset outward from center along normal
    const textPosition = center.clone().add(normal.clone().multiplyScalar(faceRadius * 0.4));

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
