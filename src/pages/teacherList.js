import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';

import ReceiptIcon from '@material-ui/icons/Receipt';
import { useHistory } from 'react-router-dom';

function StuListItems() {
  let history = useHistory();

  return (
    <>
      <ListItem button onClick={() => history.push('/teacherDashboard')}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>

      <ListItem button onClick={() => history.push('/teacherDashboard/exam')}>
        <ListItemIcon>
          <ReceiptIcon />
        </ListItemIcon>
        <ListItemText primary="Exams" />
      </ListItem>

      {/* <ListItem button onClick={() => history.push('/teacherDashboard/submissions')}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Exam Submissions" />
      </ListItem> */}
    </>
  )
};

export default StuListItems;