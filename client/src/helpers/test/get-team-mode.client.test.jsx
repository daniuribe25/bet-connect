import getTeamMode from '../get-team-mode';

test('should return correct string when given a team size', () => {
  expect(getTeamMode()).toBe('Quads');
  expect(getTeamMode(1)).toBe('Solos');
  expect(getTeamMode(2)).toBe('Duos');
  expect(getTeamMode(3)).toBe('Trios');
  expect(getTeamMode(4)).toBe('Quads');
})
