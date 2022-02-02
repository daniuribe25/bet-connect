import updateScoreboardTeamsDisplayed from './helpers';

const one = { isUsersTeam: false, teamName: 'Team 1' };
const two = { isUsersTeam: false, teamName: 'Team 2' };
const three = { isUsersTeam: false, teamName: 'Team 3' };
const four = { isUsersTeam: false, teamName: 'Team 4' };
const five = { isUsersTeam: false, teamName: 'Team 5' };
const six = { isUsersTeam: false, teamName: 'Team 6' };
const seven = { isUsersTeam: false, teamName: 'Team 7' };
const eight = { isUsersTeam: false, teamName: 'Team 8' };

test('should return new array with 2 teams in front and 2 behind users team', () => {
  expect(updateScoreboardTeamsDisplayed(
    [one, two, three, {...four, isUsersTeam: true }, five, six, seven, eight]
  )).toStrictEqual([two, three, {...four, isUsersTeam: true }, five, six]);
  expect(updateScoreboardTeamsDisplayed(
    [one, two, {...three, isUsersTeam: true }, four, five, six, seven, eight]
  )).toStrictEqual([one, two, {...three, isUsersTeam: true }, four, five]);
  expect(updateScoreboardTeamsDisplayed(
    [one, two, three, four, five, {...six, isUsersTeam: true }, seven, eight]
  )).toStrictEqual([four, five, {...six, isUsersTeam: true }, seven, eight]);
})

test('should return first 3 teams from array if current users team is not in list', () => {
  expect(updateScoreboardTeamsDisplayed(
    [one, two, three, four, five, six, seven, eight]
  )).toStrictEqual([one, two, three]);
})

test('should return 2 teams in front if users team is last', () => {
  expect(updateScoreboardTeamsDisplayed(
    [one, two, three, four, five, six, seven, {...eight, isUsersTeam: true}]
  )).toStrictEqual([six, seven, {...eight, isUsersTeam: true}]);
})

test('should return 2 teams in front and 1 behind if users team is second to last', () => {
  expect(updateScoreboardTeamsDisplayed(
    [one, two, three, four, five, six, {...seven, isUsersTeam: true}, eight]
  )).toStrictEqual([five, six, {...seven, isUsersTeam: true}, eight]);
})

test('should return 2 teams behind if users team is first', () => {
  expect(updateScoreboardTeamsDisplayed(
    [{...one, isUsersTeam: true }, two, three, four, five, six, seven, eight]
  )).toStrictEqual([{...one, isUsersTeam: true }, two, three]);
})

test('should return 2 teams behind and 1 in front users team is in 2nd', () => {
  expect(updateScoreboardTeamsDisplayed(
    [one, {...two, isUsersTeam: true }, three, four, five, six, seven, eight]
  )).toStrictEqual([one, {...two, isUsersTeam: true }, three, four]);
})
