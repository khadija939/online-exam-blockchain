import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import quizQuestions from '../components/QuizQuestions';
import Quiz from '../components/Quiz';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';


export default function ScrollDialog() {
    const [open, setOpen] = React.useState(false);
    const [scroll, setScroll] = React.useState('paper');
    const [state, setState] = React.useState({
        counter: 0,
        questionId: 1,
        question: quizQuestions[0].question,
        answerOptions: quizQuestions[0].answers,
        answer: 'Microsoft',
        answersCount: {},
        result: ''
    });
    const handleClickOpen = (scrollType) => () => {
        setOpen(true);
        setScroll(scrollType);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const descriptionElementRef = React.useRef(null);
    React.useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    return (
        <div>
            <Button onClick={handleClickOpen('paper')}>scroll=paper</Button>
            <Button onClick={handleClickOpen('body')}>scroll=body</Button>
            <Dialog
                open={open}
                onClose={handleClose}
                scroll={scroll}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">Subscribe</DialogTitle>
                <DialogContent dividers={scroll === 'paper'}>
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
        </div>
    );
}
