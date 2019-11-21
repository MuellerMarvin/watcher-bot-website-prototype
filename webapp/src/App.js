import React from 'react';
import './App.css';
import './GuildHeader.css';
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
    <div className="GuildDashboard">
      <GuildHeader guild={ this.props.guild }></GuildHeader>
      <div className="GuildDashboardDividerLine"></div>
    </div>
    );
  }
}

function GuildHeader(props) {
  return(
    <div className="GuildHeader">
      <div className="GuildHeaderTitleContainer">
        <div className="GuildHeaderIcon">
          <img alt="guild-icon" src={ props.guild.iconUrl }/>
        </div>
        <div className="GuildHeaderGuildTitle">
        <p>{ props.guild.name }</p>
        </div>
      </div>
      <div className="GuildHeaderInfoContainer">
        <UserCountBubble Text={ props.guild.memberCount + " members" } BubbleColor="#373737"/>
        <UserCountBubble Text="Online" BubbleColor="#FFFFFF"/>
      </div>
    </div>
  );
}

function UserCountBubble(props) {
  return(
    <div className="UserCountBubble">
      <div style={{ borderRadius: '50%', color: props.BubbleColor }}></div>
      <p>{ props.Text }</p>
    </div>
  );
}

export default App;
