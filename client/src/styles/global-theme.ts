import Palette from './colors';

const theme = {
  light: {
    text: {
      primary: Palette.blueNavy,
      secondary: Palette.blueSlate,
    },
    background: {
      primary: Palette.white,
      secondary: Palette.blueGrey,
    },
    icon: {
      primary: Palette.blueNavy,
      secondary: Palette.blueSlate,
    }
  },
  lightBlue: {
    text: {
      primary: Palette.blueNavy,
      secondary: Palette.blueSlate,
    },
    background: {
      primary: Palette.blueGrey,
    },
    icon: {
      primary: Palette.blueSlate,
    }
  },
  dark: {
    text: {
      primary: Palette.white,
      secondary: Palette.blueSlate,
      alternative: Palette.blueGrey,
    },
    background: {
      primary: Palette.blueNavy,
    },
    border: {
      primary: Palette.blueDenim,
      secondary: Palette.white,
    },
    icon: {
      primary: Palette.white,
      secondary: Palette.blueSlate,
      alternative: Palette.blueGrey,
    }
  },
  secondaryDark: {
    text: {
      primary: Palette.white,
    },
    background: {
      primary: Palette.blueDenim,
    },
  },
  darkest: {
    background: {
      primary: Palette.blueInk,
    }
  },
  success: {
    text: {
      primary: Palette.white,
      secondary: Palette.green,
    },
    background: {
      primary: Palette.green,
    },
    icon: {
      primary: Palette.white,
    }
  },
  info: {
    text: {
      primary: Palette.white,
      secondary: Palette.blue,
    },
    background: {
      primary: Palette.blue,
    },
    icon: {
      primary: Palette.white,
    }
  },
  warning: {
    text: {
      primary: Palette.white,
      secondary: Palette.red,
    },
    background: {
      primary: Palette.red,
    },
    icon: {
      primary: Palette.white,
    }
  },
  highlight: {
    text: {
      primary: Palette.white,
    },
    background: {
      primary: Palette.purple,
    },
    icon: {
      primary: Palette.white,
    }
  },
  winner: {
    text: {
      primary: Palette.white,
    },
    background: {
      primary: Palette.yellowGold,
    }
  }
}

export default theme;
