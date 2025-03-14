import { GithubOutlined, SettingOutlined } from '@ant-design/icons';
import { createAgoraRtcEngine } from 'agora-electron-sdk';
import { Layout, Menu } from 'antd';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import React, { Component } from 'react';
import {
  Link,
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom';

import './App.global.scss';

import Advanced from './examples/advanced';
import Basic from './examples/basic';
import AuthInfoScreen from './examples/config/AuthInfoScreen';
import Hooks from './examples/hook';

const DATA = [Basic, Advanced, Hooks];

const { Content, Footer, Sider } = Layout;

class App extends Component {
  state = {
    version: { version: undefined, build: undefined },
    collapsed: false,
    showFooter: true,
  };

  componentDidMount() {
    const engine = createAgoraRtcEngine();
    this.setState({ version: engine.getVersion() });
  }

  render() {
    const { version } = this.state;
    return (
      <Router>
        <Layout hasSider style={{ height: '100vh' }}>
          <Sider
            collapsible
            onCollapse={(e) =>
              this.setState({
                collapsed: e,
              })
            }
            style={{
              overflow: 'auto',
              height: '100vh',
              position: 'fixed',
              left: 0,
              top: 0,
              bottom: 0,
            }}
          >
            <div className="logo" />
            <Menu
              theme="dark"
              defaultSelectedKeys={['1']}
              mode="inline"
              //@ts-ignore
              items={((): ItemType[] => {
                let list = [
                  {
                    key: '1',
                    label: <Link to="/">Setting</Link>,
                    icon: <SettingOutlined />,
                  },
                ];
                DATA.map((value, index) => {
                  let subMenu = {
                    key: `sub${index}`,
                    label: <>{value.title}</>,
                    icon: <GithubOutlined />,
                    children: [] as ItemType[],
                  };
                  value.data.map(({ name }) => {
                    subMenu.children.push({
                      key: name,
                      label: <Link to={`/${name}`}>{name}</Link>,
                      icon: <SettingOutlined />,
                    });
                  });
                  list.push(subMenu);
                });
                return list;
              })()}
            ></Menu>
          </Sider>
          <Layout
            className="site-layout"
            style={{ marginLeft: this.state.collapsed ? 0 : 200 }}
          >
            <Content>
              <Switch>
                <Route path="/" children={<AuthInfoScreen />} exact={true} />
                {DATA.map((value) => {
                  return value.data.map(({ name, component }) => {
                    const RouteComponent = component;
                    return (
                      <Route
                        key={name}
                        path={`/${name}`}
                        children={<RouteComponent />}
                      />
                    );
                  });
                })}
                <Route path="*">
                  <Redirect to="/" />
                </Route>
              </Switch>
            </Content>
            {this.state.showFooter && (
              <Footer
                style={{ textAlign: 'center', cursor: 'pointer' }}
                onClick={() => {
                  this.setState({
                    showFooter: !this.state.showFooter,
                  });
                }}
              >
                {`Powered by Agora RTC SDK ${version.version} ${version.build}`}
              </Footer>
            )}
          </Layout>
        </Layout>
      </Router>
    );
  }
}

export default App;
