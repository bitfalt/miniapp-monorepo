import { Ideology } from "@/data/ideologies";

export const findClosestIdeology = (
  userStats: { econ: number; dipl: number; govt: number; scty: number },
  ideologies: Ideology[]
): Ideology => {
  let closestIdeology = ideologies[0];
  let minDistance = Infinity;

  for (const ideology of ideologies) {
    const distance =
      Math.pow(ideology.stats.econ - userStats.econ, 2) +
      Math.pow(ideology.stats.dipl - userStats.dipl, 2) +
      Math.pow(ideology.stats.govt - userStats.govt, 2) +
      Math.pow(ideology.stats.scty - userStats.scty, 2);

    if (distance < minDistance) {
      minDistance = distance;
      closestIdeology = ideology;
    }
  }

  return closestIdeology;
};