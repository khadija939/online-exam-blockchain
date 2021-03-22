import React from 'react';
import Typography from '@material-ui/core/Typography';
import Title from './Title';

export default function Card(props) {
  return (
    <React.Fragment>
      <Title>Total {props.title}</Title>
      <Typography component="p" variant="h4">
        {props.count}
      </Typography>

      {/* <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          View balance
        </Link>
      </div> */}
    </React.Fragment>
  );
}