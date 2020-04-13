import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import Box from '@material-ui/core/Box';
import DoneIcon from '@material-ui/icons/Done';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';


import countries from './data/countries.json'

const styles = {
  starIcon: {
    fontSize:'15px',
    color: 'yellow'
  },
  starBorderIcon: {
    fontSize: '15px' 
  }
}

function countryFlag(country) {
  let src = ""
  if (country === "Decline to Answer")
    src = "https://cartocdn-gusc.global.ssl.fastly.net/trials/api/v1/map/cc084f64eb25a86897f24f943774e441:1535119233066/0/5/16/14.png"
  else 
    src = "https://www.countryflags.io/" + countries[country] + "/shiny/16.png"
  return <img src={src} style={{width: '16px'}} alt={country} />
}

function time(task) {
  if (task.total_attempts === 0)
    return '';
  if (task.penalty_micros === "00:00:00")
    return task.total_attempts + " attempt" + (task.total_attempts === 1 ? '' : 's')
  return task.penalty_micros + ' +' + task.penalty_attempts
}

function icon(c) {
  if (c === 'A')
    return <DoneIcon style={{fontSize: '24px', "color":"green"}} />
  if (c === '-')
    return <span style={{fontSize: '24px', color: '#cccccc'}}>—</span>
  if (c === '?')
    return <HelpOutlineIcon style={{fontSize: '24px'}}/>
  return ''
}

function User(props) {
  const { classes } = props

  const toggleChangeFriends = React.useCallback(() =>
    props.toggleChange('friends', props.user.displayname)
  , [props])


  return (
    <Box display="flex" height='40px' alignItems="center" borderBottom={1} bgcolor={props.friend ? '#FFFFBF' : '#FFFFFF'}>
      <Box width='60px' fontSize='12px' textAlign='center'>
        <div>{props.rank}</div>
        { props.rank !== props.user.rank && <div>({props.user.rank})</div> }
      </Box>
      <Box width='20px' p={1}>
        {
        props.friend ?
          <StarIcon className={classes.starIcon} onClick={toggleChangeFriends} /> :
          <StarBorderIcon className={classes.starBorderIcon} onClick={toggleChangeFriends} />
        }
      </Box>
      <Box height={16} width='16px'>
        {countryFlag(props.user.country)}
      </Box>
      <Box p={1} width='220px' fontSize='12px'>
        <a target="_blank" rel="noopener noreferrer" href={'https://codingcompetitions.withgoogle.com/codejam/submissions/' + props.cid + '/' + props.user.b64displayname} style={{ color: '#000', textDecoration: 'none' }}>{props.user.displayname}</a>
      </Box>
      <Box fontSize='12px' p={1} width='30px' textAlign='center' fontWeight='bold'>
        {props.user.score_1}
      </Box>
      <Box fontSize='10px' p={1} width='80px' textAlign='center' color='grey.800'>
        {props.user.score_2}
      </Box>
      {
        props.user.task_info.map( (task, idx) => 
          <Box 
            bgcolor={idx % 2 ? '#ffffff' : '#f9f9f9' }
            height={40}
            width={0}
            display="flex"
            alignItems="center"
            key={idx}
            flexGrow={1 / props.user.task_info.length}
          >
            <Box flexGrow={0.1} />
            <Box width='60px' fontSize='10px' textAlign='center' color='grey.600'>
              {time(task)}
            </Box>
            {
              task.tests.split("").map( (c, key) => 
                <Box key={key} width='24px' textAlign='center' flexGrow={0.8/task.tests.length}>{icon(c)}</Box>
              )
            }
            <Box flexGrow={0.1} />
          </Box> 
        )
      }
    </Box>
  )
}

export default withStyles(styles)(User)
