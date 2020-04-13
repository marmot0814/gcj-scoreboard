import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import Box from '@material-ui/core/Box';

const styles = {
}

function Title(props) {
  return (
    <Box display="flex" height='20px' alignItems="center">
      <Box width='60px' fontSize='12px' fontWeight='bold' textAlign='center'>
        Rank
      </Box>
      <Box width='20px' p={1}/>
      <Box width='16px' />
      <Box width='220px' p={1}/>
      <Box width='30px' fontSize='12px' fontWeight='bold' textAlign='center' p={1}>
        Score
      </Box>
      <Box width='80px' fontSize='12px' fontWeight='bold' textAlign='center' p={1}>
        Penalty
      </Box>
    {
      props.tasks.map( (task, key) => 
        <Box 
          key={key}
          fontSize='10px'
          width={0}
          textAlign='center'
          flexGrow={ 1 / props.tasks.length }
          fontWeight='bold'
        >
          <a target="_blank" rel="noopener noreferrer" href={'https://codingcompetitions.withgoogle.com/codejam/round/' + props.cid + '/' + task.id} style={{color: '#000', textDecoration: 'none'}}>
          {task.title}
          </a>
        </Box>
      )
    }
    </Box>
  )
}

export default withStyles(styles)(Title)
