import React, { Component } from "react";

import {
  SHARE_ID
} from "../utils/settings";
import ApiHandler from "./ApiHandler";
import Logger from "./logger";
import Utils from "../utils/index";
import Config from './config'


export default class App extends Component {
  constructor(props) {
    super(props);

    this.initLogger();
    this.apiHandler = null;
    this.state = {
      serverUrl: "",
      deviceId: "",
      logs: [],
      users: [],
      connected: false
    };
    this.ws = null;
    this.enableAudioMixing = false;
  }

  initLogger() {
    Logger.on("log", ({ ts, level, m, type }) => {
      let { logs } = this.state;
      logs.push({ ts, level, m, type });
      // this.setState(logs);
      console.log(`${ts} [${type}][${level}] ${m}`);
    });
  }

  componentDidMount() {
    let configs = Config.get()
    let deviceId = configs.deviceId || ""
    let serverUrl = configs.serverUrl || ""

    this.setState({deviceId, serverUrl})

  }

  update(uid, viewId, role) {
    let { users } = this.state;
    users = users || []
    if (viewId === "None") {
      users.forEach(u => {
        if(u.uid === uid) {
          this.apiHandler.rtcEngine.destroyRender(role === "local" ? "local" : uid)
          delete u.uid
          delete u.role
          updated = true;
        }
      })
    } else {
      let updated = false;
      for (let i = 0; i < users.length; i++) {
        let user = users[i];
        if (user.viewId === viewId) {
          user.role = role;
          user.uid = uid;
          updated = true;
          break;
        }
      }
      if (!updated) {
        throw `canvas ${viewId} not exist`;
      }
    }
    this.setState({ users });
  }

  subscribeDataRequestCalls = apiHandler => {
    let respType = 6;
    let events = ["getImageOfView"];

    events.forEach(e => {
      apiHandler.dataRequest.on(e, (device, cmd, sequence, info) => {
        let result = 0;
        let error = 0;
        var canvas;
        switch (e) {
          case "getImageOfView":
            canvas = document.querySelector(`#${info.id} canvas`);
            result = canvas.toDataURL("image/jpeg", 0.2);
            break;
        }
        apiHandler.callResult(
          respType,
          device,
          cmd,
          sequence,
          {
            error,
            return: result
          },
          {}
        );
      });
    });
  };

  subscribeNonApiCalls = apiHandler => {
    let respType = 7;
    let events = ["createView", "removeView", "removeAllView", "removeAllView"];

    events.forEach(e => {
      apiHandler.asyncNonApi.on(e, (device, cmd, sequence, info) => {
        let result = 0;
        let error = 0;
        switch (e) {
          case "removeAllViews":
          case "removeAllView":
            this.setState({ users: [] });
            break;
          case "createView":
            let viewId = `view-${new Date().getTime()}`;
            this.state.users.push({
              viewId
            });
            this.setState({ users: this.state.users });
            result = viewId;
            break;
          case "removeView":
            break;
        }
        apiHandler.callResult(
          respType,
          device,
          cmd,
          sequence,
          {
            error,
            return: result
          },
          {}
        );
      });
    });
  };

  subscribeApiCalls = apiHandler => {
    let respType = 5;
    let events = ["setupLocalVideo", "setupRemoteVideo", "getVersion", "getUserInfoByUserAccount", "getUserInfoByUid"];

    events.forEach(e => {
      apiHandler.asyncApi.on(e, (device, cmd, sequence, info) => {
        let result = 0;
        let error = 0;
        let tmp
        switch (e) {
          case "setupLocalVideo":
            this.update(info.canvas.uid, info.canvas.view, "local");
            break;
          case "setupRemoteVideo":
            this.update(info.canvas.uid, info.canvas.view, "remote");
            break;
          case "getVersion":
            tmp = apiHandler.rtcEngine.getVersion() || {}
            result = `version:${tmp.version}-build:${tmp.build}`
            break
          case "getUserInfoByUserAccount":
            tmp = apiHandler.rtcEngine.getUserInfoByUserAccount(info.userAccount) || {}
            result = JSON.stringify(tmp)
            break
          case "getUserInfoByUid":
            tmp = apiHandler.rtcEngine.getUserInfoByUid(info.uid) || {}
            result = JSON.stringify(tmp)
            break
        }
        apiHandler.callResult(
          respType,
          device,
          cmd,
          sequence,
          {
            error,
            return: result
          },
          {}
        );
      });
    });
  };

  gracefulCloseWS = () => {
    if(!this.ws) {
      return Promise.resolve()
    }
    return new Promise((resolve) => {
      try {
        this.ws.onclose = () => {
          Logger.info(`socket closed`, "socket")
          this.setState({connected: false})
          this.ws = null
          resolve()
        }
        this.ws.close()
      }catch(e) {
        this.ws = null
        resolve()
      }
    })
  }

  onConnect = async () => {
    let {deviceId, serverUrl} = this.state
    if(!deviceId || !serverUrl) {
      alert('device id & server url are mandatory')
    }
    let url = `${serverUrl}${deviceId}`
    Logger.info(
      <span>
        connecting to {url}
      </span>,
      "socket"
    );

    Config.set('deviceId', deviceId)
    Config.set('serverUrl', serverUrl)

    await this.gracefulCloseWS()

    let ws = new WebSocket(
      url
    );
    ws.onopen = () => {
      Logger.info(`connected.`, "socket");
      this.setState({connected: true})
      this.apiHandler = new ApiHandler(deviceId, ws);
      this.subscribeApiCalls(this.apiHandler);
      this.subscribeNonApiCalls(this.apiHandler);
      this.subscribeDataRequestCalls(this.apiHandler);
    };

    ws.onmessage = e => {
      Logger.info(
        `<-- ${Utils.readableMessage(e.data)}`,
        Utils.getProperty(e.data, "type")
      );
      this.apiHandler.handleMessage(e.data);
    };

    ws.onclose = e => {
      Logger.info(`socket closed`)
      this.setState({connected: false})
      this.ws = null
      this.onConnect()
    }
    
    ws.onerror = e => {
      Logger.error(`socket connect failed: ${e.type}`, "socket")
    }
    
    this.ws = ws;
  }

  onDisconnect = async () => {
    await this.gracefulCloseWS()
  }

  onInputChange = (e, name) => {
    let data = this.state
    let value = e.currentTarget.value
    data[name] = value
    this.setState({state: data})
  }

  render() {
    return (
      <div>
        <div className="row">
          <div
            className="columns"
            style={{ padding: "20px", height: "100%", margin: "0" }}
          >
            <div className="column is-three-quarters">
              <div className="field is-grouped">
                <div className="control is-expanded">
                  <input
                    className="input"
                    type="text"
                    value={this.state.serverUrl}
                    placeholder="Wayang Server"
                    onChange={e => this.onInputChange(e, 'serverUrl')}
                  />
                </div>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    value={this.state.deviceId}
                    placeholder="Device ID"
                    onChange={e => this.onInputChange(e, 'deviceId')}
                  />
                </div>
              </div>
            </div>
            <div className="column is-one-quarters">
              <div className="field is-grouped">
                {!this.state.connected ? (
                  <div className="control">
                    <a className="button is-info" onClick={this.onConnect}>Connect</a>
                  </div>
                ) : (
                  <div className="control">
                    <a className="button is-danger" onClick={this.onDisconnect}>Disconnect</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div
            className="columns"
            style={{ padding: "20px", height: "100%", margin: "0" }}
          >
            <div className="column is-two-quarters window-container">
              {this.state.users.map((item, key) => {
                if (item.viewId && item.role) {
                  return (
                    <Window
                      key={key}
                      uid={item.uid}
                      viewId={item.viewId}
                      rtcEngine={
                        this.apiHandler ? this.apiHandler.rtcEngine : null
                      }
                      role={item.role}
                    />
                  );
                }
              })}
            </div>
            <div
              className="column is-two-quarter"
              style={{ overflowY: "auto" }}
            >
              {/* {this.state.logs.map((item, idx) => {
                let style = {};
                let className = `${item.level} logitem`;
                let typeText = Utils.readableType(item.type);
                switch (item.type) {
                  case 1:
                    style.backgroundColor = "Cyan";
                    break;
                  case 3:
                    style.backgroundColor = "DarkTurquoise";
                    break;
                  case 4:
                    style.backgroundColor = "Gold";
                    break;
                  case 5:
                    style.backgroundColor = "HotPink";
                    break;
                  case 7:
                    style.backgroundColor = "LemonChiffon";
                }
                return (
                  <div
                    key={idx}
                    className={className}
                    style={{ width: "100%" }}
                  >
                    {item.ts} | <span style={style}>{typeText}</span>{" "}
                    <span>{item.m}</span>
                  </div>
                );
              })} */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class Window extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  componentDidMount() {
    let dom = document.querySelector(`#${this.props.viewId}`);
    if (this.props.role === "local") {
      dom && this.props.rtcEngine.setupLocalVideo(dom);
    } else if (this.props.role === "localVideoSource") {
      dom && this.props.rtcEngine.setupLocalVideoSource(dom);
      this.props.rtcEngine.setupViewContentMode("videosource", 1);
      this.props.rtcEngine.setupViewContentMode(String(SHARE_ID), 1);
    } else if (this.props.role === "remote") {
      dom && this.props.rtcEngine.subscribe(this.props.uid, dom);
      this.props.rtcEngine.setupViewContentMode(this.props.uid, 1);
    } else if (this.props.role === "remoteVideoSource") {
      dom && this.props.rtcEngine.subscribe(this.props.uid, dom);
      this.props.rtcEngine.setupViewContentMode("videosource", 1);
      this.props.rtcEngine.setupViewContentMode(String(SHARE_ID), 1);
    }
  }

  componentWillUnmount() {
    if (this.props.role === "local") {
      this.props.rtcEngine.destroyRender('local');
    } else if (this.props.role === "localVideoSource") {
      this.props.rtcEngine.destroyRender('localVideoSource');
    } else if (this.props.role === "remote" || this.props.role === "remoteVideoSource") {
      this.props.rtcEngine.destroyRender(this.props.uid);
    }
  }

  render() {
    return (
      <div className="window-item">
        <div className="video-item" id={this.props.viewId} />
      </div>
    );
  }
}
