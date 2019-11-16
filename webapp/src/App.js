import React from 'react';
import './App.css';
import refreshIcon from './refresh-24px.svg';
import { tsExpressionWithTypeArguments } from '@babel/types';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      guilds: null,
      loading: true,
    }

    let retrievedGuilds = this.getGuilds();

    this.setState(
      
    );
  }

  getGuilds() {
    // backend request
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
}

function RefreshButton(props) {
  return(
    <div className="RefreshButton" onClick={ props.onClick }>
      <img src={ refreshIcon }></img>
    </div>
  );
}

export default App;
