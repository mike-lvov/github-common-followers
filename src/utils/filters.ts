import { TFollower } from "../types/User";

export const findCommonFollowers = (firstFollowers: TFollower[], secondFollowers: TFollower[]) => {
  const firstFollowerIds = firstFollowers.map(follower => follower.id);

  return secondFollowers.filter(follower => firstFollowerIds.includes(follower.id));
}