import React from 'react';
import './App.css';
import config from './config.json';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      guild: null,
      loading: true,
      pathname: window.location.pathname.slice(1),
      apiUrl: config.apiUrl,
    }
  }

  componentDidMount() {
    this.updateGuild();
  }

  async updateGuild() {
    // wait for response
    const routeResponse = await fetch(this.state.apiUrl + "/routes/" + this.state.pathname);
    // convert response from json
    const routePayload = await routeResponse.json();
    // take the Id in the response and make a request for it (slicing the first 6 characters off, because of the 'guild:' prefix)
    const guildResponse = await fetch(this.state.apiUrl + "/guilds/" + routePayload.result[0].guildId.slice(6));
    // convert response from json
    const guildPayload = await guildResponse.json();
    // set the state using that data
    this.setState({
      guild: guildPayload.result[0]
    });

    console.log(this.state.guild)
  }

  render() {
    if(this.state.guild === null) {
      return <p>loading...</p>
    }
    return (
      <div className="App">
        <GuildDashboard guild={ this.state.guild }></GuildDashboard>
      </div>
    );
  }
}

class GuildDashboard extends React.Component {
  render() {
    return(
    <div className="GuildDashboardContainer">
      <GuildHeader guild={ this.props.guild }></GuildHeader>
    </div>
    );
  }
}

function GuildHeader(props) {
  return(
    <div className="GuildHeader">
      <img className="GuildHeaderIcon" alt="guild-icon" src={ props.guild.iconUrl }/>
      <p className="GuildHeaderGuildTitle">{ props.guild.name }</p>
    </div>
  );
}

export default App;
