import React from 'react';
import './css/App.css';
import './css/GuildHeader.css';
import './css/InfoList.css';
import './css/GreenButton.css';
import './css/LandingPage.css';
import './css/GuildDashboard.css';
import config from './config.json';
import CircularProgress from '@material-ui/core/CircularProgress';

// Import aasets
//import statsIcon from './poll-24px.svg';
import logo from './assets/WatcherBot-logos_transparent.png';
import channelIcon from './assets/forum-24px.svg';
import userIcon from './assets/person-24px.svg';
//import groupIcon from './assets/people-24px.svg';
//import emoteIcon from './assets/favorite-24px.svg';
import unfoldMoreIcon from './assets/unfold_more-24px.svg';
import unfoldLessIcon from './assets/unfold_less-24px.svg';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      guild: null,
      noRoute: false,
      landingPage: false,
      loading: true,
      pathname: window.location.pathname.slice(1),
      apiUrl: config.apiUrl,
    }
  }

  componentDidMount() {
    this.updateGuild();
  }

  async updateGuild() {
    // check if pathname is empty, then it's the landing-page
    if(this.state.pathname === "") {
      this.setState({
        landingPage: true,
      })
      return;
    }

    //#region Route-Request
    // wait for response
    const routeResponse = await fetch(this.state.apiUrl + "/routes/" + this.state.pathname);
    // convert response from json
    const routePayload = await routeResponse.json();

    // if the route does not exist, the function will exit
    if(routePayload.result[0] === undefined) {
      this.setState({
        noRoute: true, // this will show the "no-route"-page
      });
      return;
    }
    //#endregion

    //#region Guild-Request
    // get guildId from route
    const guildId = routePayload.result[0].guildId;

    // take the Id in the response and make a request for it (slicing the first 6 characters off, because of the 'guild:' prefix)
    const guildResponse = await fetch(this.state.apiUrl + "/guilds/" + guildId);
    // convert response from json
    var guild = await guildResponse.json();
    guild = guild.result;
    console.log(guild);

    // if the backgroundimage doesn't exist, set it to an empty string
    if(guild.webappConfig === undefined || guild.webappConfig === null || guild.webappConfig.backgroundImageUrl === undefined || guild.webappConfig.backgroundImageUrl === null) {
      guild.webappConfig = {
        backgroundImageUrl: "",
      };
    }
    //#endregion

    //#region Last-week-request
    for(let i = 0; i < guild.channels.length; i++) {
      let lastWeekResponse = await fetch(this.state.apiUrl + "/channels/?start=" + ((Date.now()) - 604800000) + "&channel=" + guild.channels[i].channelId + "&guild=" + guild.guildId);
      let messageCount = await lastWeekResponse.json();
      messageCount = messageCount.result;
      guild.channels[i].messageCount = messageCount;
    }

    //#endregion

    //#region Beautify
    // Making the text more human-readable
    guild.members.map(member => {
      if(member.presence.status === 'online') {
        member.presence.status = 'Online';
      }
      else if(member.presence.status === 'dnd') {
        member.presence.status = "Do Not Disturb"
      }
      else if(member.presence.status === 'offline') {
        member.presence.status = 'Offline'
      }
      else if(member.presence.status === 'idle') {
        member.presence.status = 'Idle';
      }
      return member;
    });
    //#endregion


    // set the state using the guild-data
    this.setState({
      guild: guild,
    });
  }

  render() {
    if(this.state.landingPage === true) {
      return(
        <div className="App">
          <LandingPage></LandingPage>
        </div>
      );
    }
    else if(this.state.noRoute) {
      return(
        <div className="App">
          <div className="GuildDashboard">
            <p style={{ margin: "0 auto" }}>That route doesn't exist. If you believe this is an error, contact us!</p>
          </div>
        </div>
      );
    }
    else if(this.state.guild === null || this.state.guild === undefined) {
      return (
        <div className="App">
          <div className="GuildDashboard"> { /* This class is being used to retain the same visual as after-loading */}
            <CircularProgress thickness={ 1.1 } />
          </div>
        </div>
      );
    }
    else {
      return (
        <div className="App"  style={{ backgroundImage: "url(" + this.state.guild.webappConfig.backgroundImageUrl + ")", backgroundSize: "cover", backgroundRepeat: "no-repeat", height: "unset" }}>
          <GuildDashboard guild={ this.state.guild }></GuildDashboard>
        </div>
      );
    }
  }
}

class GuildDashboard extends React.Component {
  render() {
    // Add channels with messages in the last 7 days to the list for displaying
    let channelList = [];
    this.props.guild.channels.forEach(channel => {
      if(channel.messageCount > 0) {
        channelList.push(<InfoListItem key={channel._id} LeftText={ "#" + channel.name } RightText={ channel.messageCount + " messages" }/>);
      }
    });
    // if there is no channels in the list, display a message instead
    if(channelList.length === 0) {
      channelList = [<InfoListItem key={ 0 } LeftText="No messages"/>]
    }

    let newList = [];
    let userList = this.props.guild.members.forEach((member) => {
      if(member.presence.status.toLowerCase() === 'online') {
        newList.push(<InfoListItem key={ member._id } LeftText={ member.username } RightText={ member.presence.status }/>);
      }
    });
    userList = newList;
    //let groupList = [];
    //let emoteList = [];

    return(
      <div className="GuildDashboard" style={{ backgroundColor: "rgba(255, 255, 255, 0.97)" }}>
        <GuildHeader guild={ this.props.guild }/>
        <div className="GuildDashboardDividerLine"/>
        <InfoList Title="Most used channels (last 7 days)" Icon={ channelIcon }>{ channelList }</InfoList>
        <div className="GuildDashboardDividerLine"/>
        {/* <InfoList Title="Groups" Icon={ groupIcon }>{ groupList }</InfoList>
        <div className="GuildDashboardDividerLine"/> */ } 
        <InfoList Title={ userList.length + " users online" } Icon={ userIcon }>{ userList }</InfoList>
        {/* <div className="GuildDashboardDividerLine"/>
        <InfoList Title="Emotes" Icon={ emoteIcon }>{ emoteList }</InfoList> */}
        <div className="GuildDashboardDividerLine"/>
        <GreenButton href="/" style={{ padding: "50px" }}>I want this too!</GreenButton>
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

class InfoList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: props.Collapsed || true,
    }
  }

  render() {
    // what to show, if it's not collapsed
    let renderList = this.props.children;
    let collapseIcon = unfoldMoreIcon;

    // what to show instead when it's collapsed
    if(this.state.collapsed) {
      renderList = renderList.slice(0,3);
      collapseIcon = unfoldLessIcon;
    }

    return(
      <div className="InfoList">
        <img src={ this.props.Icon } alt=""/>
        <p className="InfoListTitle">{ this.props.Title }</p>
        <img className="CollapseButton" src={ collapseIcon } alt="" onClick={ () => {
          // set collapsed to the opposite
          this.setState({ collapsed: !this.state.collapsed });
        }}/>
        <div>
          { renderList }
        </div>
      </div>
    ); 
  }
}

function InfoListItem(props) {
  return(
    <div className="InfoListItem">
      <p style={{ float: "left", textAlign: "left"}}>{ props.LeftText }</p>
      <p style={{ float: "right", textAlign: "right"}}>{ props.RightText }</p>
    </div>
  );
}

function GreenButton(props) {
  return(
    <a href={ props.href }>
      <div className="GreenButton">
        <button onClick={ props.onClick }>
          { props.children }
        </button>
      </div>
    </a>
  );
}

function LandingPage(props) {
  return(
    <div className="LandingPage">
      <p className="LandingPageCornerText">WatcherBot</p>
      <div className="LandingPageContentContainer">
        <img className="LandingPageBigLogo" alt="logo" src={ logo }/>
        <p className="LandingPageTitle">Feel the heartbeat of your server</p>
        <GreenButton href={ config.inviteUrl }>
          Add to Discord
        </GreenButton>
      </div>
    </div>
  );
}

export default App;
