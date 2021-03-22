import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';

import PeopleIcon from '@material-ui/icons/People';
import ReceiptIcon from '@material-ui/icons/Receipt';
import { useHistory } from 'react-router-dom';

function StuListItems() {
  let history = useHistory();

  return (
    <>
      <ListItem button onClick={() => history.push('/studentDashboard')}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>

      <ListItem button onClick={() => history.push('/studentDashboard/exam')}>
        <ListItemIcon>
          <ReceiptIcon />
        </ListItemIcon>
        <ListItemText primary="Take Exam" />
      </ListItem>

      <ListItem button onClick={() => history.push('/studentDashboard/submissions')}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Submissions" />
      </ListItem>
    </>
  )
};

export default StuListItems;