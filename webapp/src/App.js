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
    if(this.state.pathname == "") {
      this.setState({
        landingPage: true,
      })
    }

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

    // get guildId from route
    const guildId = routePayload.result[0].guildId.slice(6);

    // take the Id in the response and make a request for it (slicing the first 6 characters off, because of the 'guild:' prefix)
    const guildResponse = await fetch(this.state.apiUrl + "/guilds/" + guildId);
    // convert response from json
    var guild = await guildResponse.json();
    guild = guild.result[0];

    // if the backgroundimage doesn't exist, set it to an empty string
    if(guild.webappConfig === undefined || guild.webappConfig === null || guild.webappConfig.backgroundImageUrl === undefined || guild.webappConfig.backgroundImageUrl == null) {
      guild.webappConfig = {
        backgroundImageUrl: "",
      };
    }

    // get the channels sorted by most messages to least
    const channelResponse = await fetch(this.state.apiUrl + "/channels/" + guildId);
    // retrieve the data from the json
    const channelPayload = await channelResponse.json();
    // add the data to the guild-object, if there are any channels to show
    if(channelPayload.result !== undefined && channelPayload.result !== null) {
      guild.channels = channelPayload.result
    }
    else {
      guild.channels = [{
        name: "There are no channels to show",
        messageCount: "",
      }];
    }

    // set the state using the guild-data
    this.setState({
      guild: guild,
    });
  }

  render() {
    if(this.state.landingPage == true) {
      return(
        <div className="App">

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
        <div className="App"  style={{ backgroundImage: "url(" + this.state.guild.webappConfig.backgroundImageUrl + ")", backgroundSize: "cover", backgroundRepeat: "no-repeat" }}>
          <GuildDashboard guild={ this.state.guild }></GuildDashboard>
        </div>
      );
    }
  }
}

class GuildDashboard extends React.Component {
  render() {
    let channelList = this.props.guild.channels.map((channel) => {
      return(<InfoListItem LeftText={ "#" + channel.name } RightText={ channel.messageCount + " messages" }/>);
    });
    let groupList = [];
    let userList = [];
    let emoteList = [];

    return(
      <div className="GuildDashboard" style={{ backgroundColor: "rgba(255, 255, 255, 0.97)" }}>
        <GuildHeader guild={ this.props.guild }/>
        <div className="GuildDashboardDividerLine"/>
        <InfoList Title="Most used channels" Icon={ channelIcon }>{ channelList }</InfoList>
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
