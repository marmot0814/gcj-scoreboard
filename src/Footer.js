import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import Box from '@material-ui/core/Box';

import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import TextField from '@material-ui/core/TextField';

const styles = {
}

function Footer(props) {

  return (
    <Box height='80px' display="flex" alignItems="center" >
      <Box p={1}>
        <TextField id="input" label="Search for a contestant" variant="outlined"
          onChange={ 
            (e) => { 
              props.onChange('input', e.target.value)
              props.onChange('page', 1)
            }
          } 
          value={props.input}
        />
      </Box>
      <Box flexGrow={0.9} />
      <Box fontSize='20px' p={1}>
        Rows per page: 
      </Box>
      <Box p={1}>
        <FormControl variant="outlined">
          <Select
            value={props.rowsPerPage}
            onChange={ (e) => props.onChange('rowsPerPage', e.target.value) }
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={30}>30</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box flexGrow={0.1} />
      <Box p={1} width='80px'>
        <TextField 
          variant="outlined" 
          onChange={ (e) => props.onChange('page', e.target.value) } 
          value={props.page}
        />
      </Box>
      <Box>
        {"of " + props.maxPage}
      </Box>
    </Box>
  )
}

export default withStyles(styles)(Footer)
