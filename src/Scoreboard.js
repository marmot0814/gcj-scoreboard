import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import Box from '@material-ui/core/Box';

import User from './User'

const styles = {
}

function Scoreboard(props) {
  return (
    <Box borderBottom={2}>
    {
      props.user_scores
        .map( (user, key) => 
          <User 
            key={key} 
            user={user} 
            friend={props.friends.find(name => name === user.displayname) !== undefined }
            toggleChange={props.toggleChange}
            rank={key+props.offset+1}
            cid={props.cid}
          />
      )
    }
    { props.padding ?
      [...Array(props.rowsPerPage - props.user_scores.length).keys()]
        .map( (user, key) => <Box height='40px' borderBottom={1} key={key} /> ) 
      : ''
    }
    </Box>
  )
}

export default withStyles(styles)(Scoreboard)
