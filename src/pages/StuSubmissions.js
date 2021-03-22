import React, { useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Slide from '@material-ui/core/Slide';
import Contract from '../config/contract';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import QuestionCount from '../components/QuestionCount';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';


const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    root: {
        display: 'flex',
    },
    formControl: {
        margin: theme.spacing(3),
    },
    button: {
        margin: theme.spacing(1, 1, 0, 0),
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});




export default function GenericTable(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [exams, setExams] = React.useState([]);
    const [totalMarks, setTotalMarks] = React.useState([]);
    const [obtMarks, setObtMarks] = React.useState([]);
    const [examIndex, setExamIndex] = React.useState('');
    const [mySubmissions, setMySubmissions] = React.useState();

    const handleClickOpen = (id) => {
        setExamIndex(id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        async function fetchData() {
            const web3 = window.web3
            const accounts = await web3.eth.getAccounts();
            const contract = await Contract();
            const allExams = await contract.methods.getAllExams().call({ from: accounts[0] });
            let myExams = allExams.filter(exam => exam.studentsCount.includes(accounts[0]));
            let totalMarks = allExams.map(exam => exam.questions.reduce((accumulator, currentValue) => { return Number(currentValue.mark) + Number(accumulator) }, 0));
            let marks = [];
            let submissions = {};
            for (const exam of myExams) {
                const result = await contract.methods.getResult(exam.examId.toString()).call({ from: accounts[0] });
                const mySubmissions = result.filter(res => res.student === accounts[0])
                submissions[exam.examId] = mySubmissions;
                let obtainedMarks = mySubmissions.map(exam => exam.examSubmission.reduce((accumulator, currentValue) => { return Number(currentValue.markObtained) + Number(accumulator) }, 0));
                marks.push(obtainedMarks[0])
            }
            setObtMarks(marks);
            setMySubmissions(submissions);
            console.log(submissions)
            setTotalMarks(totalMarks);
            setExams(myExams);

        }
        fetchData();
    }, [props.name])


    return (
        <React.Fragment>
            <Title>{props.name}
            </Title>

            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Subject</TableCell>
                        <TableCell>Teacher</TableCell>
                        <TableCell>Total Marks</TableCell>
                        <TableCell>Marks Obtained</TableCell>
                        <TableCell>Action</TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {exams.map((row, index) => (

                        <TableRow key={index + 1} >
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{row.subject}</TableCell>
                            <TableCell>{row.teacher}</TableCell>
                            <TableCell>{totalMarks[index] === undefined ? 0 : totalMarks[index]}</TableCell>
                            <TableCell>{obtMarks[index] === undefined ? 0 : obtMarks[index]}</TableCell>
                            <TableCell>
                                <Button disabled={mySubmissions[exams[index].examId][0].examSubmission.length < 1} onClick={() => handleClickOpen(index)} variant="contained" color="primary">
                                    View Submission
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                            {open ? `${exams[examIndex].subject.toUpperCase()} Exam Submission` : 'loading'}
                        </Typography>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                {open ? <Grid item xs={12} key={0} >
                    <Paper className={classes.paper}>
                        {
                            exams[examIndex].questions.map((question, index) => {
                                return (
                                    <>
                                        <QuestionCount
                                            counter={index + 1}
                                            total={exams[examIndex].questions.length}
                                            marks={mySubmissions[exams[examIndex].examId][0].examSubmission[index].markObtained}
                                            result={true}
                                        />
                                        <FormControl component="fieldset" className={classes.formControl}>
                                            <FormLabel component="legend">{question.statement}</FormLabel>
                                            <RadioGroup aria-label="quiz" name="quiz" value={mySubmissions[exams[examIndex].examId][0].examSubmission[index].answerIndex} >
                                                <FormControlLabel value="1" control={<Radio />} label={question.answers[0]} />
                                                <FormControlLabel value="2" control={<Radio />} label={question.answers[1]} />
                                                <FormControlLabel value="3" control={<Radio />} label={question.answers[2]} />
                                                <FormControlLabel value="4" control={<Radio />} label={question.answers[3]} />
                                            </RadioGroup>
                                        </FormControl>
                                    </>
                                )
                            })
                        }

                    </Paper>
                </Grid> : null}
            </Dialog>
        </React.Fragment>
    );
}