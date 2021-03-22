import React from 'react';
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
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Slide from '@material-ui/core/Slide';
import quizQuestions from '../components/QuizQuestions';
import Quiz from '../components/Quiz';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';


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


// Generate Order Data
function createData(id, date, subject, teacher, students, coins) {
    return { id, date, subject, teacher, students, coins };
}

const rows = [
    createData(0, '16 Mar, 2019', 'English', 'Paul McCartney', '10', '1000'),
    createData(1, '16 Mar, 2019', 'English', 'Paul McCartney', '10', '1000'),
    createData(2, '16 Mar, 2019', 'English', 'Paul McCartney', '10', '1000')
];



export default function GenericTable(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const [open2, setOpen2] = React.useState(false);
    
    const [state, setState] = React.useState({
        counter: 0,
        questionId: 1,
        question: quizQuestions[0].question,
        answerOptions: quizQuestions[0].answers,
        answer: 'Microsoft',
        answersCount: {},
        result: ''
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClose2 = () => {
        setOpen2(false);
    };

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
                        <TableCell>Total Students</TableCell>
                        <TableCell>Tokens Rewarded</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (

                        <TableRow key={row.id} >
                            <TableCell>{row.id}</TableCell>
                            <TableCell>{row.subject}</TableCell>
                            <TableCell>{row.teacher}</TableCell>
                            <TableCell>{row.students}</TableCell>
                            <TableCell>{row.coins}</TableCell>
                            <TableCell>
                                <Button onClick={handleClickOpen} variant="contained" color="primary">
                                    View Submissions
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
                            English Exam Submissions
                        </Typography>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <List>
                    <ListItem button onClick={()=> setOpen2(true)}>
                        <ListItemText primary="Submission 1" secondary="Student name" />
                    </ListItem>
                    <Divider />
                    <ListItem button>
                        <ListItemText primary="Submission 2" secondary="Student name" />
                    </ListItem>
                </List>
            </Dialog>

            <Dialog
                open={open2}
                onClose={handleClose2}
                scroll={'paper'}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">Student's name Submission</DialogTitle>
                <DialogContent dividers={'paper'}>
                    <List>
                        <ListItem >
                            <Quiz
                                answer={state.answer}
                                answerOptions={state.answerOptions}
                                questionId={state.questionId}
                                question={state.question}
                                questionTotal={quizQuestions.length}
                            />
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <Quiz
                                answer={state.answer}
                                answerOptions={state.answerOptions}
                                questionId={state.questionId + 1}
                                question={state.question}
                                questionTotal={quizQuestions.length}
                            />
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <Quiz
                                answer={'Nintendo'}
                                answerOptions={state.answerOptions}
                                questionId={state.questionId + 1}
                                question={state.question}
                                questionTotal={quizQuestions.length}
                            />
                        </ListItem>
                    </List>
                </DialogContent>
            </Dialog>



        </React.Fragment>
    );
}