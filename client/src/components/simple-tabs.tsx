import React, { FunctionComponent, ReactNode } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
  id?: string;
}

type tab = {
  content: ReactNode;
  title: string;
};

interface SimpleTabsProps {
  tabs: Array<tab>;
  value: number;
  setValue: (value: number) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    height: 48,
  },
  tabStyle: {
    flex: 1,
    maxWidth: 'none',
  },
  box: {
    padding: 0,
    height: '100%',
    display: 'flex',
  },
  tabPanel: {
    flex: 1,
  },
}));

const TabPanel: FunctionComponent<TabPanelProps> = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  const css = useStyles();
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      className={css.tabPanel}
      {...other}
    >
      {value === index && (
        <Box p={3} className={css.box}>
          {children}
        </Box>
      )}
    </div>
  );
};

const a11yProps = (index: number): { id: string; 'aria-controls': string } => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};

// eslint-disable-next-line import/prefer-default-export
export const SimpleTabs: FunctionComponent<SimpleTabsProps> = (
  props: SimpleTabsProps,
) => {
  const { tabs, value, setValue } = props;
  const classes = useStyles();

  const handleChange = (event: any, newValue: number): void => {
    setValue(newValue);
    event.preventDefault();
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
          className={classes.header}
        >
          {tabs &&
            tabs.map((t, i) => (
              <Tab
                label={t.title}
                {...a11yProps(i)}
                className={classes.tabStyle}
                key={t.title}
              />
            ))}
        </Tabs>
      </AppBar>
      {tabs &&
        tabs.map((t, i) => (
          <TabPanel value={value} index={i} key={t.title}>
            {t.content}
          </TabPanel>
        ))}
    </div>
  );
};
