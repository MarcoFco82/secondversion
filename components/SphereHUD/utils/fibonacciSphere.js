/**
 * Distributes N points uniformly on a sphere using the Fibonacci/golden angle algorithm.
 * @param {number} n - Number of points
 * @param {number} radius - Sphere radius
 * @returns {Array<[number, number, number]>} Array of [x, y, z] positions
 */
export function fibonacciSphere(n, radius = 1.5) {
  const points = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2; // y goes from 1 to -1
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;

    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;

    points.push([x * radius, y * radius, z * radius]);
  }

  return points;
}
