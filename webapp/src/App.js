import React, { useImperativeHandle } from 'react';
import './App.css';
import './GuildHeader.css';
import './InfoList.css';
import './AddMeButton.css';
import config from './config.json';
import CircularProgress from '@material-ui/core/CircularProgress';

// Import icons
//import statsIcon from './poll-24px.svg';
import channelIcon from './forum-24px.svg';
import groupIcon from './people-24px.svg';
import userIcon from './person-24px.svg';
import emoteIcon from './favorite-24px.svg';

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
      return (
        <div className="App">
          <div className="GuildDashboard"> { /* This class is being used to retain the same visual as after-loading */}
            <CircularProgress thickness="1.1"/>
          </div>
        </div>
      );
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
      <InfoList Title="Channels" Icon={ channelIcon }></InfoList>
      <div className="GuildDashboardDividerLine"></div>
      <InfoList Title="Groups" Icon={ groupIcon }></InfoList>
      <div className="GuildDashboardDividerLine"></div>
      <InfoList Title="Users" Icon={ userIcon }></InfoList>
      <div className="GuildDashboardDividerLine"></div>
      <InfoList Title="Emotes" Icon={ emoteIcon }></InfoList>
      <div className="AddMeButton">
          <button>I want this too!</button>
        </div>
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
        <UserCountBubble Text={ "some" +  " online" } BubbleColor="#FFFFFF"/>
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

function InfoList(props) {
  return(
    <div className="InfoList">
      <img src={ props.Icon } alt=""/>
      <p className="InfoListTitle">{ props.Title }</p>
      <div InfoListItemContainer>
        <InfoListItem leftText="World population" rightText=">1,000,000"/>
        <InfoListItem leftText="World population" rightText=">1,000,000"/>
        <InfoListItem leftText="World population" rightText=">1,000,000"/>
      </div>
    </div>
  );
}

function InfoListItem(props) {
  return(
    <div className="InfoListItem">
      <p style={{ float: "left", textAlign: "left"}}>{ props.leftText }</p>
      <p style={{ float: "right", textAlign: "right"}}>{ props.rightText }</p>
    </div>
  );
}

export default App;
