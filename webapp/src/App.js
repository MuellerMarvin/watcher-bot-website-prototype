import React from 'react';
import './App.css';
import refreshIcon from './refresh-24px.svg';
import { tsExpressionWithTypeArguments } from '@babel/types';
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

  UpdateGuilds() {
    let guilds = [];
    fetch(config.apiUrl + "/guilds").then((res) => { console.log(res); });
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

function RefreshButton(props) {
  return(
    <div className="RefreshButton" onClick={ props.onClick }>
      <img src={ refreshIcon }></img>
    </div>
  );
}

export default App;
