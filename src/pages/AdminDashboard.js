import React, { useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MenuIcon from '@material-ui/icons/Menu';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import AdminListItems from './adminListItems';
import Table from './Table';
import TeacherExams from './TeacherExams';
import Card from './Card';

import { Switch, Route, useRouteMatch, useHistory } from 'react-router-dom';

import Contract from '../config/contract';


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

export default function Dashboard() {
  let history = useHistory();
  let { path } = useRouteMatch();
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const [account, setAccount] = React.useState('');
  const [totalSupply, setTotalSupply] = React.useState('');
  const [students, setStudents] = React.useState('');
  const [teachers, setTeachers] = React.useState('');

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    async function fetchData() {
      const web3 = window.web3
      const accounts = await web3.eth.getAccounts();
      const contract = await Contract();
      const totalSupply = await contract.methods.remainingSupply().call();
      const allStudents = await contract.methods.getTotalStudentsCount().call();
      const allTeachers = await contract.methods.getTotalTeachersCount().call();

      setAccount(accounts[0]);
      setTotalSupply(totalSupply);
      setStudents(allStudents);
      setTeachers(allTeachers);

    }
    fetchData();
  })

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            {account}
          </Typography>
          <IconButton color="inherit" onClick={() => history.push('/')}>
            <PowerSettingsNewIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
         
        </div>
        <Divider />
        <List>
          <AdminListItems />
        </List>
        <Divider />
      </Drawer>

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>

            <Switch>
              <Route exact path={`${path}`}>
                <Grid item xs={12} md={4} lg={4}>
                  <Paper className={classes.paper}>
                    <Card title="Teachers" count={teachers} />
                  </Paper>
                </Grid>

                <Grid item xs={12} md={4} lg={4}>
                  <Paper className={classes.paper}>
                    <Card title="Students" count={students} />

                  </Paper>
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                  <Paper className={classes.paper}>
                    <Card title="Tokens Remaining" count={totalSupply} />

                  </Paper>
                </Grid>
              </Route>

              <Route exact path={`${path}/teachers`}>
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <Table name={'Teachers'} />
                  </Paper>
                </Grid>

              </Route>

              <Route exact path={`${path}/students`}>
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <Table name={'Students'} />
                  </Paper>
                </Grid>
              </Route>

              <Route exact path={`${path}/exams`}>
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <TeacherExams name={'Exams'} admin={true} />
                  </Paper>
                </Grid>
              </Route>

            </Switch>

          </Grid>
        </Container>
      </main>
    </div>
  );
}