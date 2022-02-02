import { createStyles, makeStyles } from '@material-ui/core';
import MUIButton from '@material-ui/core/Button';
import { FunctionComponent, MouseEventHandler, ReactNode } from 'react';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: (props: StyleProps) => {
      const { color, hoverColor, textColor, disabled, disabledColor } = props;

      return {
        backgroundColor: disabled
          ? disabledColor || `${theme.palette.secondary.dark}`
          : color || theme.palette.secondary.main,
        borderRadius: theme.spacing(3),
        minWidth: '0',
        height: '34px',
        margin: '4px',

        '&:hover': {
          backgroundColor: disabled
            ? disabledColor || `${theme.palette.secondary.dark}`
            : hoverColor || '#4b89b3',
        },
        '& span': {
          fontSize: '12px',
          fontWeight: 'bold',
          letterSpacing: '0.3px',
          fontFamily: theme.typography.fontFamily,
          color: textColor || theme.palette.secondary.contrastText,
        },
      };
    },
  }),
);

// eslint-disable-next-line import/prefer-default-export
export const Button: FunctionComponent<ButtonProps> = (props: ButtonProps) => {
  const {
    color,
    hoverColor,
    textColor,
    disabled,
    disabledColor,
    children,
    ...rest
  } = props;

  const classes = useStyles({
    color,
    hoverColor,
    textColor,
    disabled,
    disabledColor,
  });

  return (
    <MUIButton {...{ disabled }} {...rest} {...{ classes }}>
      {children}
    </MUIButton>
  );
};

interface ButtonProps extends StyleProps {
  children?: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
  style?: any;
  className?: string;
  disabled?: boolean;
}

interface StyleProps {
  color?: string;
  hoverColor?: string;
  textColor?: string;
  disabled?: boolean;
  disabledColor?: string;
}
