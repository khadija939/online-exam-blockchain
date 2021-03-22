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
import { makeStyles, withStyles } from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Slide from '@material-ui/core/Slide';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Contract from '../config/contract';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import QuestionCount from '../components/QuestionCount';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);


const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function QuestionComponent(props) {

    const updateQuestion = (value) => {
        props.setNewQuestion({ ...props.newQuestion, question: value });
    }

    const option1 = (value) => {
        props.setNewQuestion({ ...props.newQuestion, option1: value });
    }

    const option2 = (value) => {
        props.setNewQuestion({ ...props.newQuestion, option2: value });
    }
    const option3 = (value) => {
        props.setNewQuestion({ ...props.newQuestion, option3: value });
    }
    const option4 = (value) => {
        props.setNewQuestion({ ...props.newQuestion, option4: value });
    }
    const correctIndex = (value) => {
        props.setNewQuestion({ ...props.newQuestion, correctIndex: value });
    }
    const marks = (value) => {
        props.setNewQuestion({ ...props.newQuestion, marks: value });
    }
    return (
        <React.Fragment>
            <div style={{ flex: 1, borderWidth: 2, borderColor: 'black' }}>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Question Statement"
                    type="text"
                    fullWidth
                    required
                    onChange={(event) => updateQuestion(event.target.value)}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Option1"
                    type="text"
                    fullWidth
                    required
                    onChange={(event) => option1(event.target.value)}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Option2"
                    type="text"
                    fullWidth
                    required
                    onChange={(event) => option2(event.target.value)}

                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Option3"
                    type="text"
                    fullWidth
                    required
                    onChange={(event) => option3(event.target.value)}

                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Option4"
                    type="text"
                    fullWidth
                    required
                    onChange={(event) => option4(event.target.value)}

                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Correct Index"
                    type="number"
                    fullWidth
                    required
                    onChange={(event) => correctIndex(event.target.value)}
                    InputProps={{ inputProps: { min: 1, max: 4 } }}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Marks"
                    type="number"
                    fullWidth
                    required
                    onChange={(event) => marks(event.target.value)}
                />
                <br />
                <br />
            </div>
        </React.Fragment>
    )
}

export default function GenericTable(props) {

    const classes = useStyles();
    const [loading, setLoading] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [subject, setSubject] = React.useState('');
    const [duration, setDuration] = React.useState(0);
    const [students, setStudents] = React.useState([]);
    const [submissions, setSubmissions] = React.useState([]);

    const [selectedStudents, setSelectedStudents] = React.useState([]);
    const [examId, setExamId] = React.useState(0);
    const [subId, setSubId] = React.useState(0);

    const [examIndex, setExamIndex] = React.useState(0);

    const [openStudent, setOpenStudent] = React.useState(false);
    const [openQuestion, setOpenQuestion] = React.useState(false);

    const [tokenReceived, setTokenReceived] = React.useState(false);

    const [open2, setOpen2] = React.useState(false);
    const [openNewExam, setOpenNewExam] = React.useState(false);


    const [newQuestion, setNewQuestion] = React.useState();
    const [exams, setExams] = React.useState([]);

    async function fetchExams() {
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts();
        const contract = await Contract();
        const allExams = await contract.methods.getAllExams().call({ from: accounts[0] });
        setExams(allExams);
    }

    async function fetchStudents() {
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts();
        const contract = await Contract();
        const allStudents = await contract.methods.getAllStudents().call({ from: accounts[0] });
        setStudents(allStudents);
    }
    useEffect(() => {
        fetchExams();
        fetchStudents();
    }, [props.name]);

    const handleClickOpen = async (index) => {
        setExamIndex(index);
        const web3 = window.web3
        const contract = await Contract();
        const accounts = await web3.eth.getAccounts();
        const result = await contract.methods.getResult(exams[index].examId.toString()).call({ from: accounts[0] });
        setSubmissions(result);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClose2 = () => {
        setOpen2(false);
    };

    const handleClickNewExam = () => {
        setOpenNewExam(true);
    };
    const handleClickNewExamClose = () => {
        setOpenNewExam(false);
    }
    const handleCloseStudentOpen = (id) => {
        setExamId(id);
        setOpenStudent(true);
    }
    const handleCloseStudent = () => {
        setSelectedStudents([]);
        setOpenStudent(false);
    }
    const handleOpenQuestion = (id) => {
        setExamId(id);
        setOpenQuestion(true);
    }
    const handleCloseQuestion = () => {
        setOpenQuestion(false);
    }
    const handleAddStudent = async () => {
        if (selectedStudents.length < 1)
            alert("selectedStudents cannot be empty");
        else {
            setLoading(true);
            const web3 = window.web3
            const accounts = await web3.eth.getAccounts();
            const contract = await Contract();
            let onlyAddress = selectedStudents.map(stu => stu.userAddress)
            console.log(onlyAddress)
            const result = await contract.methods.addStudentsToExam(examId, onlyAddress).send({ from: accounts[0] });
            if (result.status === true) {
                setOpenStudent(false)
                fetchExams();
                setLoading(false);
            } else {
                alert("error adding students")
                setLoading(false);
            }
        }
    }
    const handleAddQuestion = async () => {
        console.log(newQuestion)
        try {
            if (newQuestion === undefined)
                alert("Empty field not allowed");
            else if (newQuestion.question === undefined || newQuestion.question === '')
                alert("Question statement cannot be empty");
            else if (newQuestion.option1 === undefined || newQuestion.option1 === '')
                alert("option1 cannot be empty");
            else if (newQuestion.option2 === undefined || newQuestion.option2 === '')
                alert("option2 cannot be empty");
            else if (newQuestion.option3 === undefined || newQuestion.option3 === '')
                alert("option3 cannot be empty");
            else if (newQuestion.option4 === undefined || newQuestion.option4 === '')
                alert("option4 cannot be empty");
            else if (newQuestion.correctIndex === undefined || newQuestion.correctIndex === '')
                alert("correctIndex cannot be empty");
            else if (newQuestion.marks === undefined || newQuestion.marks === '')
                alert("correctIndex cannot be empty");
            else {
                const { marks, correctIndex, question, option1, option2, option3, option4 } = newQuestion;
                setLoading(true);
                const web3 = window.web3
                const accounts = await web3.eth.getAccounts();
                const contract = await Contract();
                const result = await contract.methods
                    .addQuestion(examId, marks, correctIndex, question, option1, option2, option3, option4).send({ from: accounts[0] });
                if (result.status === true) {
                    setOpenQuestion(false)
                    fetchExams();
                    setLoading(false);
                } else {
                    alert("error adding question")
                    setLoading(false);
                }
            }
        }
        catch (e) {
            console.log(e)
            alert("Error!!!");
            setLoading(false);

        }
    }

    const handleCreateExam = async () => {
        if (subject === '')
            alert("subject cannot be empty");
        else if (typeof duration !== 'number')
            alert("duration must be a number");

        // else if (newQuestions.length < 1)
        //     alert("newQuestions cannot be empty");
        else {
            let sec = duration * 60;
            setLoading(true);
            const web3 = window.web3
            const accounts = await web3.eth.getAccounts();
            const contract = await Contract();
            const result = await contract.methods.createExam(subject, 0, sec).send({ from: accounts[0] });
            if (result.status === true) {
                setOpenNewExam(false)
                fetchExams();
                setLoading(false);
            } else {
                alert("error creating exam")
                setLoading(false);
            }
        }
    };

    const handleStartTime = async (id) => {
        try {
            const web3 = window.web3
            const accounts = await web3.eth.getAccounts();
            const contract = await Contract();
            const result = await contract.methods.startExam(id).send({ from: accounts[0] });
            if (result.status === true) {
                fetchExams();
            } else
                alert("error starting exam")
        } catch (error) {
            console.log(error)
            alert("Error!!!")
        }

    };

    const transferTokens = async () => {
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts();
        const contract = await Contract();
        let receiver = submissions[subId].student.toString();
        let tokens = submissions[subId].examSubmission.reduce((acc, curr) => { return Number(acc) + Number(curr.markObtained) }, 0);
        let Id = exams[examIndex].examId.toString();
        await contract.methods.transfer(receiver, tokens.toString(), Id).send({ from: accounts[0] });
        setOpen2(false);
    }

    return (
        <React.Fragment>
            <Title>{props.name}
                {
                    props.admin ? null :
                        <Button onClick={handleClickNewExam} style={{ marginLeft: 800 }} variant="contained" color="primary">
                            Create New Exam
                        </Button>
                }
            </Title>

            <Table size="large">
                <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Exam Id</TableCell>
                        <TableCell>Subject</TableCell>
                        <TableCell>Teacher</TableCell>
                        <TableCell>Total Questions</TableCell>
                        <TableCell>Total Students</TableCell>
                        <TableCell>Duration</TableCell>
                        <TableCell align={props.admin ? 'left' : 'center'}>Actions</TableCell>
                        {
                            props.admin ? null :
                                <>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                </>
                        }

                    </TableRow>
                </TableHead>
                <TableBody>
                    {exams.map((row, index) => (

                        <TableRow key={index + 1} >
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{row.examId}</TableCell>
                            <TableCell>{row.subject}</TableCell>
                            <TableCell>{row.teacher}</TableCell>
                            <TableCell>{row.questions.length}</TableCell>
                            <TableCell>{row.studentsCount.length}</TableCell>
                            <TableCell>{Math.round(row.duration / 60) + ' mins'}</TableCell>
                            {props.admin ? null :
                                <>
                                    <TableCell>
                                        <Button disabled={row.studentsCount.length > 0} onClick={() => handleCloseStudentOpen(row.examId)} color="primary">
                                            Add Students
                                </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button disabled={Number(row.startTime) > 0} onClick={() => handleOpenQuestion(row.examId)} color="primary">
                                            Add Questions
                                </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button onClick={() => handleStartTime(row.examId)} disabled={(row.studentsCount.length < 1) || (row.questions.length < 1) || (Number(row.startTime) > 0)} color="primary">
                                            Start Exam
                                </Button>
                                    </TableCell>
                                </>
                            }
                            <TableCell>
                                <Button onClick={() => handleClickOpen(index)} color="primary">
                                    View Submissions
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Add new Exam dialog */}
            <Dialog onClose={handleClickNewExamClose} aria-labelledby="customized-dialog-title" open={openNewExam}>
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    {`Create New Exam`}
                </DialogTitle>
                <DialogContent dividers>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Subject"
                        type="text"
                        fullWidth
                        required
                        onChange={(event) => setSubject(event.target.value)}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="duration"
                        label="Duration in Min"
                        type="number"
                        fullWidth
                        required
                        helperText="Must be a number."
                        InputProps={{ inputProps: { min: 10 } }}
                        onChange={(event) => setDuration(event.target.valueAsNumber)}

                    />

                </DialogContent>
                <DialogActions>
                    <Button autoFocus disabled={loading} onClick={handleCreateExam} color="primary">
                        CREATE
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add Students Dialog */}
            <Dialog fullWidth={true} maxWidth={'sm'} onClose={handleCloseStudent} aria-labelledby="customized-dialog-title" open={openStudent}>
                <DialogTitle id="customized-dialog-title" onClose={handleCloseStudent}>
                    {`Add Students`}
                </DialogTitle>
                <DialogContent dividers>
                    <Autocomplete
                        id="combo-box-demo"
                        multiple
                        options={students}
                        size="large"
                        getOptionLabel={(option) => option.UniId}
                        onChange={(event, value) => {
                            console.log(value)
                            if (value.length < 1) setSelectedStudents([]);
                            else setSelectedStudents(value);
                        }}
                        renderInput={(params) => <TextField {...params} label="Add Students" />}
                    />

                </DialogContent>
                <DialogActions>
                    <Button autoFocus disabled={loading} onClick={handleAddStudent} color="primary">
                        ADD
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add Question Dialog */}
            <Dialog fullWidth={true} maxWidth={'sm'} onClose={handleCloseQuestion} aria-labelledby="customized-dialog-title" open={openQuestion}>
                <DialogTitle id="customized-dialog-title" onClose={handleCloseQuestion}>
                    {`Add Question`}
                </DialogTitle>
                <DialogContent dividers>
                    <QuestionComponent newQuestion={newQuestion} setNewQuestion={setNewQuestion} />

                    {/*
                    
                    <Button onClick={handleClickQuestion} style={{ marginTop: 20 }} variant="contained" color="primary">
                        Add Question
                    </Button> */}
                </DialogContent>
                <DialogActions>
                    <Button autoFocus disabled={loading} onClick={handleAddQuestion} color="primary">
                        ADD
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Submissions Dialog */}
            <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                            {open ? `${exams[examIndex].subject.toUpperCase()} Exam Submissions` : 'loading'}
                        </Typography>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <List>
                    {
                        submissions.map((sub, index) => {
                            return (
                                <>
                                    <ListItem disabled={sub.examSubmission.length < 1} button onClick={async () => {
                                        const web3 = window.web3
                                        const contract = await Contract();
                                        const accounts = await web3.eth.getAccounts();
                                        console.log("aa: ", accounts[0])
                                        const Received = await contract.methods.checkTokenReceived(sub.student, exams[index].examId.toString()).call({ from: accounts[0] });
                                        setTokenReceived(Received);

                                        setOpen2(true)
                                        setSubId(index);
                                    }}>
                                        <ListItemText primary={`Submission ${index + 1}`} secondary={sub.stuId} />
                                    </ListItem>
                                    <Divider />
                                </>
                            )
                        })
                    }
                </List>
            </Dialog>

            <Dialog
                open={open2}
                onClose={handleClose2}
                scroll={'paper'}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
                fullWidth={true}
                maxWidth={'md'}
            >
                <DialogTitle id="scroll-dialog-title">{open2 ? `${submissions[subId].stuId} Submission` : 'loading...'}</DialogTitle>
                <DialogContent dividers={'paper'}>
                    {open2 ? <Grid item xs={12} key={0} >
                        <Paper className={classes.paper}>
                            {
                                exams[examIndex].questions.map((question, index) => {
                                    return (
                                        <>
                                            <QuestionCount
                                                counter={index + 1}
                                                total={exams[examIndex].questions.length}
                                                marks={submissions[subId].examSubmission[index].markObtained}
                                                result={true}
                                            />
                                            <FormControl component="fieldset" className={classes.formControl}>
                                                <FormLabel component="legend">{question.statement}</FormLabel>
                                                <RadioGroup aria-label="quiz" name="quiz" value={submissions[subId].examSubmission[index].answerIndex} >
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
                </DialogContent>
                <DialogActions>
                    {open2 ?
                        props.admin ? null :
                            tokenReceived ? null :
                                <Button autoFocus onClick={transferTokens} disabled={loading} color="primary">
                                    {`Transfer ${submissions[subId].examSubmission.reduce((acc, curr) => { return Number(acc) + Number(curr.markObtained) }, 0)} Tokens`}
                                </Button>
                        : null
                    }
                </DialogActions>
            </Dialog>



        </React.Fragment>
    );
}