import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import scoreboard from './data/scoreboard.json'
import countries from './data/countries.json'
import Header from './Header'
import Title from './Title'
import Scoreboard from './Scoreboard'
import Footer from './Footer'
import Filter from './Filter'

const styles = {
  container: {
    width: '1800px',
    margin: '0 auto',
  }
}

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      input: localStorage.getItem('input') || '',
      friends: (localStorage.getItem('friends') && localStorage.getItem('friends').split(',')) || [],
      page: localStorage.getItem('page') || 1,
      rowsPerPage: localStorage.getItem('rowsPerPage') || 10,
      filterOpen: false,
      filterInput: localStorage.getItem('filterInput') || '',
      countryList: (localStorage.getItem('countryList') && localStorage.getItem('countryList').split(',')) || [],
    }
  }

  onChange = (id, value) => {
    localStorage.setItem([id], value)
    this.setState({ [id]: value });
  }

  toggleChange = (list, target) => {
    if (this.state[list].find( item => item === target)) {
      this.setState({ [list]: this.state[list].filter( item => item !== target )})
      localStorage.setItem(list, this.state[list].filter( item => item !== target ))
    } else {
      this.setState({ [list]: [...this.state[list], target] })
      localStorage.setItem(list, [...this.state[list], target])
    }
  }

  input_filter = (user_score) => 
    user_score.displayname.toLowerCase().indexOf(this.state.input.toLowerCase()) !== -1

  country_filter = (user_score) => 
    this.state.countryList.length === 0 || this.state.countryList.find(c => c === user_score.country)

  process = (user_scores) => {
    return user_scores
        .filter( this.input_filter )
        .filter( this.country_filter )
  }

  render() {
    const { classes } = this.props
    const { page, rowsPerPage, friends, input, filterOpen, filterInput, countryList } = this.state

    return (
      <div className={classes.container}>
        <Header
          title={scoreboard.challenge.title}
          updateTime={scoreboard.update_time}
        />
        <Title tasks={scoreboard.challenge.tasks} cid={scoreboard.challenge.id} />
        <Scoreboard
          user_scores={scoreboard.user_scores.filter( user => friends.includes(user.displayname) )}
          toggleChange={this.toggleChange}
          friends={friends}
          offset={0}
          cid={scoreboard.challenge.id}
        />
        <Scoreboard 
          user_scores={
            this.process(scoreboard.user_scores)
              .slice((((page || 1) - 1) || 0) * rowsPerPage, (((page || 1) - 0) || 1) * rowsPerPage)
          }
          toggleChange={this.toggleChange}
          friends={friends}
          rowsPerPage={rowsPerPage}
          padding={true}
          offset={(((page || 1) - 1) || 0) * rowsPerPage}
          cid={scoreboard.challenge.id}
        />
        <Footer 
          input={input}
          onChange={this.onChange} 
          page={page}
          maxPage={Math.ceil(this.process(scoreboard.user_scores).length / rowsPerPage)}
          rowsPerPage={rowsPerPage}
        />
        <Filter
          countries={countries}
          filterOpen={filterOpen}
          filterInput={filterInput}
          countryList={countryList}
          onChange={this.onChange}
          toggleChange={this.toggleChange}
        />
      </div>
    )
  }
}

export default withStyles(styles)(App)
