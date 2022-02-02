/* eslint-disable default-case */
/* eslint-disable no-useless-escape */
import psnLogo from 'assets/images/psn_icon_white.svg';
import xblLogo from 'assets/images/xbox_icon_white.svg';
import battlenetLogo from 'assets/images/pc_icon_white.svg';
import { hiddenErrorMessages } from '../hooks/use-alerts';
import {
  AlertType,
  CategoriesType,
  GameModes,
  User,
  UserPlayerTag,
} from './pl-types';

export const errorTranslator = (err: string): string => {
  if (err.includes('Invalid value provided for token:')) {
    return 'Invalid credentials: if you forgot your password please press the blue help button in the bottom right corner to get help resseting your password';
  }
  if (err.includes('found null. In field "phone": Unknown field')) {
    return 'Phone not registered in the system, please sign up';
  }
  if (err.includes('Unique error id:')) {
    const newMsg = err.split(':');
    if (newMsg.length !== 2) return err;
    return `Oops. Sorry about that! We encountered an error here. Please try that action again. If it does not work, please log out and log back in. Thank you for your patience. We're still in Beta and fixing a lot of issues each day! Error ID: ${newMsg[1]}`;
  }

  return err;
};

export const handleMessages = (
  enqueueSnackbar: any,
  alerts: AlertType,
): void => {
  alerts?.messages?.forEach((message: any) => {
    if (
      message.text !== 'is required' &&
      !hiddenErrorMessages.some((m) => message.text.includes(m))
    ) {
      enqueueSnackbar(errorTranslator(message.text), {
        variant: message.type,
        autoHideDuration: message.duration || 8000,
      });
    }
  });
};

export const uuidv4 = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const buildMessages = (
  messages: Array<string>,
  type: string,
): { id: string; messages: Array<{ text: string; type: any }> } => ({
  id: uuidv4(),
  messages: messages.map((m) => ({ text: m, type })),
});

export const getBetAnte = (
  pickedCategory: CategoriesType,
  isMain: boolean,
  // eslint-disable-next-line consistent-return
): number => {
  switch (pickedCategory) {
    case 'rookie':
      return isMain ? 3 : 1;
    case 'legend':
      return isMain ? 5 : 3;
    case 'diamond':
      return isMain ? 10 : 5;
  }
};

// eslint-disable-next-line consistent-return
export const getMapFromGameMode = (gameMode: GameModes): string => {
  switch (gameMode) {
    case GameModes.None:
      return 'Select Mode';
    case GameModes.Verdansk:
      return 'VERDANSK';
    case GameModes.Caldera:
      return 'CALDERA';
    case GameModes.Rebirth:
      return 'REBIRTH_ISLAND';
  }
};

export const getGameModeFromMap = (gameMode: string): GameModes => {
  switch (gameMode.toUpperCase()) {
    case 'CALDERA':
      return GameModes.Caldera;
    case 'REBIRTH_ISLAND':
    case 'REBIRTH ISLAND':
      return GameModes.Rebirth;
    case 'VERDANSK':
      return GameModes.Verdansk;
    default:
      return GameModes.None
  }
};

export const getModeFromTeamSize = (teamSize: number): string => {
  switch (teamSize) {
    case 1:
      return 'Solos';
    case 2:
      return 'Duos';
    case 3:
      return 'Trios';
    case 4:
      return 'Quads';
    default:
      return '';
  }
};

export const getMapAndSquadSizeCopy = (gameMode: GameModes, squadSize: number): string => {
  const teamSize = getModeFromTeamSize(squadSize);
  let mode = ''
  switch (gameMode) {
    case GameModes.Rebirth:
      mode = 'Rebirth';
      break;
    case GameModes.Verdansk:
      mode = 'Verdansk';
      break;
    case GameModes.Caldera:
      mode = 'Caldera';
      break;
    default:
      mode = '';
  }
  return `${mode} ${teamSize}`
}

export const getPlacementSufix = (amount: number): string => {
  const lastNumber = `${amount}`[`${amount}`.length - 1];
  if (amount < 20 && amount > 10) {
    return 'th';
  }
  switch (+lastNumber) {
    case 3:
      return 'rd';
    case 2:
      return 'nd';
    case 1:
      return 'st';
    default:
      return 'th';
  }
};

export const availablePlatforms = ['xbl', 'psn', 'battlenet'];

export const getUserPlatform = (user: any): { platform: string, username: string, icon: any | null } => {
  if (!user) return { platform: '', username: '', icon: xblLogo }
  const platform = availablePlatforms.find((plt: string) => user[`${plt}PlatformUsername`]) || 'XBL';
  let icon = null;
  switch (platform.toUpperCase()) {
    case 'XBL':
      icon = xblLogo;
      break;
    case 'BATTLENET':
      icon = battlenetLogo;
      break;
    default:
      icon = psnLogo;
      break;
  }
  return { platform: platform.toUpperCase(), username: user[`${platform}PlatformUsername`], icon };
}

export const makeVerificationCode = (length: number): string => {
  let result = '';
  const characters = '0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const phoneBrowser = (): string => {
  const isChromeIOS = /CriOS/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  const isChrome = /Google Inc/.test(navigator.vendor);
  const isFirefox = /Fx/.test(navigator.userAgent);
  let isMobile = false;
  // eslint-disable-next-line no-restricted-globals
  ((a) => {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a,
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4),
      )
    )
      isMobile = true;
  })(navigator.userAgent || navigator.vendor);
  if ((isChromeIOS || (!isAndroid && isChrome)) && isMobile) return 'chrome';

  const isSafari =
    /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
  if (isSafari && isMobile && !isFirefox) return 'safari';
  return '';
};

export const findMe = (
  teamUsers: Array<UserPlayerTag>,
  currentUser: User,
): UserPlayerTag | undefined => {
  return teamUsers?.find((u) => u?.userId === currentUser?.id);
};

export const formatTime = (time: number): string => {
  // Hours, minutes and seconds
  const hrs = ~~(time / 3600);
  const mins = ~~((time % 3600) / 60);
  const secs = ~~time % 60;

  // Output like '1:01' or '4:03:59' or '123:03:59'
  let ret = '';
  if (hrs > 0) {
    ret += `${hrs}h${mins < 10 ? '0' : ''}`;
  }
  ret += `${mins}m${secs < 10 ? '0' : ''}`;
  ret += `${secs}s`;
  return ret;
};

export const handleInviteFriend = async (
  enqueueSnackbar: any,
): Promise<string | void> => {
  try {
    await navigator.share({
      title: 'PL Connect',
      text: 'Sign up and earn $25 to play with free',
      url: 'https://connect.playerslounge.co/',
    });
    enqueueSnackbar('Invite sent successfully', { variant: 'success' });
  } catch (err: any) {
    if (err.message.includes('navigator.share')) {
      enqueueSnackbar(
        'The invite link has been copied to your clipboard. Send it to your friends!',
        { variant: 'success' },
      );
      if (navigator?.clipboard)
        navigator.clipboard?.writeText('https://lounge.co/');
    } else {
      enqueueSnackbar(`Error: ${err.message}`, { variant: 'error' });
    }
  }
};
