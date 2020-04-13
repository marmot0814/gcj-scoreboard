import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import Box from '@material-ui/core/Box';

const styles = {
}

function Header(props) {
  return (
    <Box display="flex" p={1} alignItems="flex-end">
      <Box p={1}>
        <div style={{fontSize: '30px'}}>
          {props.title}
        </div>
      </Box>
      <Box p={1}>
        <div style={{fontSize: '12px', color: '#cccccc'}}>
        {"Updated at " + props.updateTime}
        </div>
      </Box>
    </Box>
  )
}

export default withStyles(styles)(Header)
