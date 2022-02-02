export type RowProps = {
  placement?: string | number | null;
  team?: string;
  score?: string | number | null;
  prize?: string;
  isCurrentUser?: boolean;
  isCurrentUsersTeam?: boolean;
  teamIsInTheMoney?: boolean;
}

export type Rankings = {
  data?: Array<RowProps>
}
