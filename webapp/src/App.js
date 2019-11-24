import React from 'react';
import './css/App.css';
import './css/GuildHeader.css';
import './css/InfoList.css';
import './css/AddMeButton.css';
import config from './config.json';
import CircularProgress from '@material-ui/core/CircularProgress';

// Import icons
//import statsIcon from './poll-24px.svg';
import channelIcon from './assets/forum-24px.svg';
import groupIcon from './assets/people-24px.svg';
import userIcon from './assets/person-24px.svg';
import emoteIcon from './assets/favorite-24px.svg';

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

    let backgroundImageUrl = null;
    try {
      backgroundImageUrl = guildPayload.result[0].webappConfig.backgroundImageUrl;
    } catch (error) {
      backgroundImageUrl = null;
      console.log(error);
    }

    backgroundImageUrl = guildPayload.result[0].webappConfig.backgroundImageUrl;
    console.log("uwu");

    if(backgroundImageUrl !== null) {
      console.log("null");
      // set the state using that data
      this.setState({
        guild: guildPayload.result[0],
        backgroundImageUrl: backgroundImageUrl
      });
    }
    else {
      // set the state using that data
      this.setState({
      guild: guildPayload.result[0],
      backgroundImageUrl: backgroundImageUrl
      });
      console.log("not null :)");
    }
  }

  render() {
    if(this.state.guild === null) {
      return (
        <div className="App">
          <div className="GuildDashboard"> { /* This class is being used to retain the same visual as after-loading */}
            <CircularProgress thickness={ 1.1 } />
          </div>
        </div>
      );
    }
    return (
      <div className="App"  style={{ backgroundImage: "url(https://i.redd.it/7ykufzphewl31.jpg)", backgroundSize: "cover", backgroundRepeat: "no-repeat" }}>
        <GuildDashboard guild={ this.state.guild }></GuildDashboard>
      </div>
    );
  }
}

class GuildDashboard extends React.Component {
  render() {
    let channelList = [];
    let groupList = [];
    let userList = [];
    let emoteList = [];

    return(
      <div className="GuildDashboard" style={{ backgroundColor: "rgba(255, 255, 255, 0.97)" }}>
        <GuildHeader guild={ this.props.guild }/>
        <div className="GuildDashboardDividerLine"/>
        <InfoList Title="Channels" Icon={ channelIcon}></InfoList>
        <div className="GuildDashboardDividerLine"/>
        <InfoList Title="Groups" Icon={ groupIcon }>{ groupList }</InfoList>
        <div className="GuildDashboardDividerLine"/>
        <InfoList Title="Users" Icon={ userIcon }>{ userList }</InfoList>
        <div className="GuildDashboardDividerLine"/>
        <InfoList Title="Emotes" Icon={ emoteIcon }>{ emoteList }</InfoList>
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
        <UserCountBubble Text={ "some online" } BubbleColor="#FFFFFF"/>
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
      <div>
        { props.children }
      </div>
    </div>
  );
}

function InfoListItem(props) {
  return(
    <div className="InfoListItem">
      <p style={{ float: "left", textAlign: "left"}}>{ props.LeftText }</p>
      <p style={{ float: "right", textAlign: "right"}}>{ props.RightText }</p>
    </div>
  );
}

export default App;
