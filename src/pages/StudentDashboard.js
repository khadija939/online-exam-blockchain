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
import StuListItems from './stuListItems';
import StuSubmissions from './StuSubmissions';
import Card from './Card';
import Button from '@material-ui/core/Button';
import { Switch, Route, useRouteMatch, useHistory } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';
import Contract from '../config/contract';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import QuestionCount from '../components/QuestionCount';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    formControl: {
        margin: theme.spacing(3),
    },
    button: {
        margin: theme.spacing(1, 1, 0, 0),
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
    const [balance, setBalance] = React.useState('');
    const [examId, setExamId] = React.useState();
    const [show, setShow] = React.useState(false);
    const [questionId, setQuestionId] = React.useState(0);
    const [disableGetExam, setDisableGetExam] = React.useState(false);
    const [exams, setExams] = React.useState();



    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleGetExam = async () => {
        if (typeof examId === 'string' || typeof examId === 'undefined')
            alert("Please Enter a number for examId")
        else {
            try {
                const contract = await Contract();
                const exam = await contract.methods.getExam(examId.toString()).call({ from: account });
                console.log(exam[3].length)
                setExams(exam);
                setDisableGetExam(true);
                setShow(true);
            }
            catch (e) {
                console.log(e)
                alert("Error getting exam");
            }
        }
    }

    useEffect(() => {
        async function fetchData() {
            const web3 = window.web3
            const accounts = await web3.eth.getAccounts();
            const contract = await Contract();
            const totalSupply = await contract.methods.balanceOf(accounts[0]).call();

            setAccount(accounts[0]);
            setBalance(totalSupply);

        }
        fetchData();
    })
    const [value, setValue] = React.useState('');
    const [error, setError] = React.useState(false);
    const [helperText, setHelperText] = React.useState('Choose wisely');

    const handleRadioChange = (event) => {
        setValue(event.target.value);
        setHelperText(' ');
        setError(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (value !== '') {
            try {
                const contract = await Contract();
                await contract.methods.submitAnswer(examId.toString(), questionId.toString(), value.toString()).send({ from: account });
                if (questionId + 1 < exams[3].length)
                    setQuestionId(questionId + 1);
                else
                    setShow(false);
                setDisableGetExam(false);
                setError(false);
            } catch (error) {
                console.log(error)
                alert("Error submitting answer")
            }
        } else {
            setHelperText('Please select an option.');
            setError(true);
        }
    };

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
                    <StuListItems />
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
                                        <Card title="Tokens Received" count={balance} />

                                    </Paper>
                                </Grid>
                            </Route>

                            <Route exact path={`${path}/exam`}>
                                <Grid item xs={12} md={4} >
                                    <Paper className={classes.paper}>
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id="name"
                                            label="Exam Id"
                                            type="number"
                                            fullWidth
                                            onChange={(event) => setExamId(event.target.valueAsNumber)}
                                        />
                                        <div align="center">
                                            <br />
                                            <Button disabled={disableGetExam} onClick={handleGetExam} position="right" variant="contained" color="primary">
                                                Get Exam
                                            </Button>
                                        </div>

                                    </Paper>
                                </Grid>
                                {show ?
                                    <Grid item xs={12} md={4} lg={6}>
                                        <Paper className={classes.paper}>
                                            <React.Fragment>
                                                <Title>Exam Details</Title>

                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Subject</TableCell>
                                                            <TableCell>Teacher</TableCell>
                                                            <TableCell>Duration</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        <TableRow key={0}>
                                                            <TableCell>{exams[0]}</TableCell>
                                                            <TableCell>{exams[1]}</TableCell>
                                                            <TableCell>{Math.round(exams[2] / 60)}</TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </React.Fragment>
                                        </Paper>
                                    </Grid> : null}
                                {show ?
                                    <Grid item xs={12} key={questionId} >
                                        <Paper className={classes.paper}>
                                            <QuestionCount
                                                counter={questionId + 1}
                                                total={exams[3].length}
                                                marks={exams[3][questionId].mark}
                                            />
                                            <form onSubmit={handleSubmit}>
                                                <FormControl component="fieldset" error={error} className={classes.formControl}>
                                                    <FormLabel component="legend">{exams[3][questionId].statement}</FormLabel>
                                                    <RadioGroup aria-label="quiz" name="quiz" value={value} onChange={handleRadioChange}>
                                                        <FormControlLabel value="1" control={<Radio />} label={exams[3][questionId].answers[0]} />
                                                        <FormControlLabel value="2" control={<Radio />} label={exams[3][questionId].answers[1]} />
                                                        <FormControlLabel value="3" control={<Radio />} label={exams[3][questionId].answers[2]} />
                                                        <FormControlLabel value="4" control={<Radio />} label={exams[3][questionId].answers[3]} />
                                                    </RadioGroup>
                                                    <FormHelperText>{helperText}</FormHelperText>
                                                    <Button type="submit" variant="outlined" color="primary" className={classes.button}>
                                                        Submit Answer
                                                    </Button>
                                                </FormControl>
                                            </form>
                                        </Paper>
                                    </Grid>
                                    : null}

                            </Route>

                            <Route exact path={`${path}/submissions`}>
                                <Grid item xs={12}>
                                    <Paper className={classes.paper}>
                                        <StuSubmissions name={'My Submissions'} />

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