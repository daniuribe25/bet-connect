import {
  Checkbox as MUICheckbox,
  createStyles,
  darken,
  FormControlLabel,
  makeStyles,
} from '@material-ui/core';
import { FunctionComponent } from 'react';

const useStyles = makeStyles(() =>
  createStyles({
    _checkboxRoot: (props: StyleProps) => {
      const { color } = props;
      if (!color) return {};
      return {
        transform: 'scale(0.8)',
        color: darken(color, 0.3),
      };
    },
    checked: (props: StyleProps) => {
      const { color } = props;
      if (!color) return {};
      return {
        '& *': {
          color,
        },
      };
    },
  }),
);

const CheckBox: FunctionComponent<CheckBoxProps> = (props: CheckBoxProps) => {
  const { name, color, checked, onChange, className, style } = props;
  const css = useStyles({ color });

  return (
    // @ts-ignore
    <FormControlLabel
      style={style}
      control={
        <MUICheckbox
          classes={{
            // eslint-disable-next-line no-underscore-dangle
            root: css._checkboxRoot,
            checked: `${css.checked} ${className && className}`,
          }}
          {...{ onChange, checked, name }}
        />
      }
    />
  );
};

export default CheckBox;

interface CheckBoxProps extends StyleProps {
  name?: string;
  checked: boolean;
  onChange?: (x: any) => any;
  style?: any;
}

interface StyleProps {
  color?: string;
  className?: string;
}
