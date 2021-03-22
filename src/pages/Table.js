import React, { useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import Contract from '../config/contract';


const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});


const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);


export default function GenericTable(props) {
  let value = props.name === "Teachers" ? 796 : 800
  const [open, setOpen] = React.useState(false);
  const [teachers, setTeachers] = React.useState([]);
  const [students, setStudents] = React.useState([]);

  const [name, setName] = React.useState('');
  const [id, setId] = React.useState('');

  const [account, setAccount] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setName('');
    setAccount('');
  };

  const handleSave = async () => {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts();
    const contract = await Contract();
    setLoading(true);
    try {
      if (props.name === 'Teachers') {
        const result = await contract.methods.addTeacher(account, name, id).send({ from: accounts[0] });
        console.log(typeof result.status)
        console.log(result)

        if (result.status) {
          fetchTeacher();
          setOpen(false);
          setName('');
          setAccount('');
          setLoading(false);
        }
        else
          alert("Error creating new Teacher")
        setLoading(false);
      }
      else {
        const result = await contract.methods.addStudent(account, name, id).send({ from: accounts[0] });
        if (result.status) {
          fetchStudent();
          setOpen(false);
          setName('');
          setAccount('');
          setLoading(false);
        }
        else
          alert("Error creating new Student")
        setLoading(false);
      }
    }
    catch (e) {
      alert("Error");
      setLoading(false);
    }

  };

  async function fetchTeacher() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts();
    const contract = await Contract();
    const allTeachers = await contract.methods.getAllTeachers().call({ from: accounts[0] });
    setTeachers(allTeachers);

  }
  async function fetchStudent() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts();
    const contract = await Contract();
    const allStudents = await contract.methods.getAllStudents().call({ from: accounts[0] });
    setStudents(allStudents);
  }

  useEffect(() => {
    if (props.name === 'Teachers')
      fetchTeacher();
    else
      fetchStudent();

  }, [props.name]);
  return (
    <React.Fragment>
      <Title>{props.name}
        <Button onClick={handleClickOpen} style={{ marginLeft: value }} variant="contained" color="primary">
          Add {props.name}
        </Button>
      </Title>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>University Id</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Public Address</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.name === 'Teachers' ? teachers.map((row, index) => (
            <TableRow key={index + 1}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{row[2]}</TableCell>
              <TableCell>{row[1]}</TableCell>
              <TableCell>{row[0]}</TableCell>
            </TableRow>
          )) : students.map((row, index) => (
            <TableRow key={index + 1}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{row[2]}</TableCell>
              <TableCell>{row[1]}</TableCell>
              <TableCell>{row[0]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          {`Add ${props.name === "Teachers" ? 'Teacher' : 'Student'} `}
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="University Id"
            type="text"
            fullWidth
            onChange={(event) => setId(event.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            onChange={(event) => setName(event.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Public Address"
            type="text"
            fullWidth
            onChange={(event) => setAccount(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button autoFocus disabled={loading} onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}