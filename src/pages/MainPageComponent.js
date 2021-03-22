import React from 'react';
import '../main.css';

import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link } from 'react-router-dom';

const stuImage = require('../assets/images/student.png')
const teacherImage = require('../assets/images/teacher.png')
const adminImage = require('../assets/images/admin.png')


const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    cardGrid: {
        paddingTop: theme.spacing(20),
        paddingBottom: theme.spacing(8),
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
}));

export default function Main() {
    const classes = useStyles();

    return (
        <React.Fragment>
            <CssBaseline />
            <main>
                <Container className={classes.cardGrid} maxWidth="md">
                    <Grid container spacing={4}>

                        <Grid item key={1} xs={12} sm={6} md={4}>
                            <div className='col-12 col-sm-3'>
                                <Link to='/studentDashboard'>
                                    <span className='Student-circle'>
                                        <img src={stuImage} alt="Teacher" />
                                    </span>
                                </Link>
                                <p style={{ marginLeft: 60, color: 'grey' }}>Student Portal</p>
                            </div>
                        </Grid>

                        <Grid item key={2} xs={12} sm={6} md={4}>
                            <div className='col-12 col-sm-3'>
                                <Link to='/teacherDashboard'>
                                    <span className='Teacher-circle'>
                                        <img src={teacherImage} alt="Teacher" />
                                    </span>
                                </Link>
                                <p style={{ marginLeft: 65, color: 'grey' }}>Teacher Portal</p>
                            </div>
                        </Grid>

                        <Grid item key={3} xs={12} sm={6} md={4}>
                            <div className='col-12 col-sm-3'>
                                <Link to='/adminDashboard'>
                                    <span className='Admin-circle'>
                                        <img src={adminImage} alt="Teacher" />
                                    </span>
                                </Link>
                                <p style={{ marginLeft: 70, color: 'grey' }}>Admin Portal</p>
                            </div>
                        </Grid>

                    </Grid>
                </Container>
            </main>
        </React.Fragment>
    );
}