import { createStyles, makeStyles } from '@material-ui/core';
import { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import intercomImage from 'assets/images/intercom_icon.png';
import { setStoreProperty } from 'redux/slices/session-slice';

const useStyles = makeStyles(() =>
  createStyles({
    launcherCont: {
      position: 'absolute',
      bottom: '-5px',
      right: '10px',
      zIndex: 999,
    },
    launcherImg: {
      width: '65px',
      height: '65px',
    },
  }),
);

const IntercomLauncher: FunctionComponent = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const showIntercom = (): void => {
    dispatch(setStoreProperty(['openIntercom', true]));
  };

  return (
    <div
      className={classes.launcherCont}
      onClick={showIntercom}
      onKeyPress={showIntercom}
      tabIndex={0}
      role="button"
    >
      <img className={classes.launcherImg} src={intercomImage} alt="" />
    </div>
  );
};

export default IntercomLauncher;
