export const AUTH_TOKEN = 'auth-token';
export const TEAM_ID = 'team-id';
export const VERIFYING_AGE = 'veryfying-age';
export const LAST_BET_TIME = 'last-bet-time';
export const NUM_PAYMENTS = 'np';

const storage = {
  save: (key: string, value: string) => {
    localStorage.setItem(key, value);
  },
  get: (key: string) => {
    const res = localStorage.getItem(key);
    return res;
  },
  getAsync: async (key: string) => {
    return localStorage.getItem(key);
  },
  remove: (key: string) => {
    localStorage.removeItem(key);
  },
  clear: () => {
    localStorage.clear();
  },
};

export default storage;
