export const MINIMUM_CANDIDATE_AGE = 18;

export function isAdultOn(birthDate: Date, onDate: Date): boolean {
  const boundary = new Date(
    Date.UTC(
      onDate.getUTCFullYear() - MINIMUM_CANDIDATE_AGE,
      onDate.getUTCMonth(),
      onDate.getUTCDate(),
    ),
  );
  return birthDate <= boundary;
}
