import { FunctionComponent, useState } from 'react';
import { createStyles, makeStyles, MenuItem, Menu } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
      cursor: 'pointer',
    },
    selectorRoot: {
      display: 'flex',
      flexDirection: 'column',
    },
    title: {
      fontSize: '13px',
      color: '#FFFFFF',
      fontWeight: 500,
    },
    value: {
      color: '#0C273A',
      backgroundColor: '#FFFFFF',
      fontSize: '11px',
      height: '14px',
      borderRadius: '3px',
      textAlign: 'center',
      marginTop: '-2px',
    },
    icon: {
      color: '#FFFFFF',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
  }),
);

const ModeDropDown: FunctionComponent<ModeDropDownProps> = (
  props: ModeDropDownProps,
) => {
  const { color, value, onChange, list } = props;
  const styles = useStyles({ color });
  const [anchorEl, setAnchorEl] = useState(null);
  const selected = list.find((x) => x.id === value);

  const handleClick = (e: any): void => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = (id: any): void => {
    setAnchorEl(null);
    onChange(id);
  };

  return (
    <>
      <div
        className={styles.root}
        onClick={handleClick}
        onKeyPress={handleClick}
        tabIndex={0}
        role="button"
      >
        <div className={styles.selectorRoot}>
          <span className={styles.title}>Warzone</span>
          <span className={styles.value}>
            {selected?.text || 'Select Mode'}
          </span>
        </div>
        <div className={styles.icon}>
          <ArrowDropDownIcon />
        </div>
      </div>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => handleClose(selected?.id)}
      >
        {list.map((el: any) => (
          <MenuItem key={el.id} onClick={() => handleClose(el.id)}>
            {el.text}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ModeDropDown;

interface ModeDropDownProps extends StyleProps {
  list: Array<any>;
  value: string | number;
  onChange: (x: any) => any;
}

interface StyleProps {
  color?: string;
}
