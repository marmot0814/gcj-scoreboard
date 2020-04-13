import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import Box from '@material-ui/core/Box';

import Checkbox from '@material-ui/core/Checkbox';

const styles = {
  dialogPaper: {
    minHeight: '80vh',
    maxHeight: '80vh',
    minWidth: '600px',
    maxWidth: '90vw',
  },
}

function Filter(props) {
  
  const { onChange } = props

  React.useEffect((props) => {
    document.body.addEventListener('keydown', function(event) {
      var key = event.keyCode || event.charCode || 0;
      if (key === 88 && event.ctrlKey)
        onChange('filterOpen', true)
    });

    return () => {
      document.body.removeEventListener('keydown', () => {})
    }
  }, [onChange])

  const { classes } = props

  return (
    <Dialog
      classes={{ paper: classes.dialogPaper }}
      onClose={ () => props.onChange('filterOpen', false) }
      fullWidth={true}
      open={props.filterOpen}
    >
      <DialogTitle>
        <TextField
          variant="outlined"
          label="Country"
          fullWidth
          onChange={ (e) => props.onChange('filterInput', e.target.value) }
          value={props.filterInput}
        />
      </DialogTitle>
      <DialogContent>
        <Box display='flex' flexWrap="wrap">
        {
        Object.keys(props.countries)
          .map( (key, id) =>
            <Box 
              key={id}
              display={ key.toLowerCase().indexOf(props.filterInput.toLowerCase()) !== -1 ? 'flex' : 'none' }
              flexDirection='row' 
              alignItems='center' 
              width='250px' 
              bgcolor={ props.countryList.indexOf(key) !== -1 ? '#B6EFFF' : ''}
            >
              <Box width='42px'>
                <Checkbox 
                  checked={ props.countryList.indexOf(key) !== -1 }
                  onChange={ (e) => props.toggleChange('countryList', key) }
                  color="primary"
                />
              </Box>
              <img src={process.env.PUBLIC_URL + 'country/' + props.countries[key] + '.png'} alt={key} />
              <Box p={1} fontSize='12px'>
                {key}
              </Box>
             </Box>
          )
        }
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default withStyles(styles)(Filter)
