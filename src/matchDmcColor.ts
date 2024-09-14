import dmcColors from "./dmc-colors.json";

function colorDistance(color1: string, color2: string): number {
  const [r1, g1, b1] = color1
    .slice(1)
    .match(/.{1,2}/g)!
    .map((hex) => Number.parseInt(hex, 16));
  const [r2, g2, b2] = color2
    .slice(1)
    .match(/.{1,2}/g)!
    .map((hex) => Number.parseInt(hex, 16));

  return Math.hypot(r2 - r1, g2 - g1, b2 - b1);
}

export function matchDmcColor(color: string): {
  color: { id: string; name: string; color: string };
  distance: number;
} {
  const distances = dmcColors.map((dmc) => ({
    color: dmc,
    distance: colorDistance(color, `#${dmc.color}`),
  }));
  distances.sort((a, b) => a.distance - b.distance);
  return distances[0];
}
