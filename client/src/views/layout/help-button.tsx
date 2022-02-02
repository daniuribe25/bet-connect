import { FunctionComponent, ReactNode } from 'react';
import {
  createStyles,
  makeStyles,
  Typography,
  Theme,
  WithStyles,
  withStyles,
  StyleRules,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Link from '@material-ui/core/Link';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/root-reducer';
import { setStoreProperty } from 'redux/slices/session-slice';

const styles = (theme: Theme): StyleRules =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
      color: theme.palette.grey[500],
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    title: {
      'padding-right': '2rem',
    },
  });

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: ReactNode;
  onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography className={classes.title} variant="h6">
        {children}
      </Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
    color: theme.palette.grey[500],
    backgroundColor: '#fff',
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}))(MuiDialogActions);

const getSteps = (): Array<string> => {
  return [
    'Login into your account',
    'Locate your CoD Gametag',
    'Go to your linked accounts',
    'Pick your platform',
    'Make yor info visible',
  ];
};

const publicPath = './assets';
// eslint-disable-next-line consistent-return
const getStepContent = (step: number): any => {
  // eslint-disable-next-line default-case
  switch (step) {
    case 0:
      return {
        instructions: 'Head to the login page and login with your account',
        link: {
          url: 'https://profile.callofduty.com/cod/login',
          description: 'CoD Login page',
        },
        imgSrc: null,
      };
    case 1:
      return {
        instructions:
          'Find the following menu, with your CoD gametag on the top right.',
        link: null,
        imgSrc: `${publicPath}/tutorial_0000_name_top_right.png`,
      };
    case 2:
      return {
        instructions: 'Click on the option that says "linked accounts"',
        link: null,
        imgSrc: `${publicPath}/tutorial_0005_linked_accounts.png`,
      };
    case 3:
      return {
        instructions:
          "Select your platform and follow each platform's own instructions to link that account",
        link: null,
        imgSrc: `${publicPath}/tutorial_0010_pick_account.png`,
      };
    case 4:
      return {
        instructions:
          'In the "Searchable" and "Data Visible" fields, select the "All" from the dropdown.',
        link: null,
        imgSrc: `${publicPath}/tutorial_0015_pick_options.png`,
      };
  }
};

const useTutorialStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: '#fff',
    },
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    actionsContainer: {
      marginBottom: theme.spacing(2),
    },
    resetContainer: {
      padding: theme.spacing(3),
    },
    img: {
      width: '100%',
    },
    footerButton: {
      margin: 'auto',
    },
  }),
);

const TutorialStep: FunctionComponent<any> = ({ index }: any) => {
  const classes = useTutorialStyles();
  const data: any = getStepContent(index);

  return (
    <>
      <Typography>{data.instructions}</Typography>

      {data.link !== null ? (
        <Link color="secondary" variant="h6" href={data.link.url}>
          {data.link.description}
        </Link>
      ) : null}

      {data.imgSrc !== null ? (
        <img src={data.imgSrc} className={classes.img} alt="instructions" />
      ) : null}
    </>
  );
};

const Tutorial: FunctionComponent<any> = ({ open, onClose }: any) => {
  const classes = useTutorialStyles();
  const steps = getSteps();

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle id="customized-dialog-title" onClose={onClose}>
        How to make your warzone profile public
      </DialogTitle>
      <DialogContent dividers>
        <div className={classes.root}>
          <Stepper className={classes.root} orientation="vertical">
            {steps.map((label, index) => (
              <Step active key={label}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  <TutorialStep index={index} />
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={onClose}
          color="secondary"
          className={classes.footerButton}
        >
          My Account is now public!
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const HelpButton: FunctionComponent = () => {
  const dispatch = useDispatch();
  const { openFaq } = useSelector(({ session }: RootState) => session);

  const handleOpenFaq = (open: boolean): void => {
    dispatch(setStoreProperty(['openFaq', open]));
  };

  return (
    <>
      <Tutorial open={openFaq} onClose={() => handleOpenFaq(false)} />
    </>
  );
};

export default HelpButton;
