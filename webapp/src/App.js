import React from 'react';
import './App.css';
import refreshIcon from './refresh-24px.svg';
const config = require('./config');

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      guilds: [],
      loading: true,
    }
  }
  
  componentDidMount() {
    this.UpdateGuilds();
  }

  /* updates the list of guilds in the state */
  UpdateGuilds() {
    // define a new empty list of guilds
    let guilds = [];

    // request all guild-Ids
    fetch(config.apiUrl + "/guilds")
    // then convert it from json to objects
    .then(res => res.json())
    // use that data and take each guild id
    .then((data) => {
      data.result.forEach(guildId => {
        // request each guild from the api
        fetch(config.apiUrl + "/guilds/" + guildId)
        // convert it to an object
        .then(res => res.json())
        .then((data) => {
          // extract if from the single-item array and push it to the guilds list
          guilds.push(data.result[0]);
        });
      });
    });

    // replace the state with the updated list of guilds
    this.setState({
      guilds: guilds
    });
  }

  render() {
    return(
      <div className="App">
        <GuildList guilds={ this.state.guilds }></GuildList>
      </div>
    );
  }
}

function GuildList(props) {
  var guildList = [];
  props.guilds.forEach(guild => {
    guildList.push(<GuildListItem guild={ guild }></GuildListItem>)
  });
  return guildList;
}

function GuildListItem(props) {
  return(<div className="GuildListItem"></div>);
}

/* function RefreshButton(props) {
  return(
    <div className="RefreshButton" onClick={ props.onClick }>
      <img src={ refreshIcon } alt="refreshIcon"></img>
    </div>
  );
} */

export default App;
