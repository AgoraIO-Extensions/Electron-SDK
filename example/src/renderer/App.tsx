import { GithubOutlined, SettingOutlined } from '@ant-design/icons';
import { createAgoraRtcEngine } from 'agora-electron-sdk';
import { Layout, Menu } from 'antd';
import React from 'react';
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
const { SubMenu } = Menu;

class App extends React.Component {
  state = {
    collapsed: false,
    version: { version: undefined, build: undefined },
  };

  componentDidMount() {
    const engine = createAgoraRtcEngine();
    this.setState({ version: engine.getVersion() });
  }

  onCollapse = (collapsed: any) => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  render() {
    const { collapsed, version } = this.state;
    return (
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
            <div className="logo" />
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
              <Menu.Item key="1" icon={<SettingOutlined />}>
                <Link to="/">Setting</Link>
              </Menu.Item>
              {DATA.map((value, index) => {
                return (
                  <SubMenu
                    key={`sub${index}`}
                    icon={<GithubOutlined />}
                    title={value.title}
                  >
                    {value.data.map(({ name }) => {
                      return (
                        <Menu.Item key={name}>
                          <Link to={`/${name}`}>{name}</Link>
                        </Menu.Item>
                      );
                    })}
                  </SubMenu>
                );
              })}
            </Menu>
          </Sider>
          <Layout className="site-layout">
            <Content style={{ flex: 1 }}>
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
            <Footer style={{ textAlign: 'center' }}>
              {`Powered by Agora RTC SDK ${version.version} ${version.build}`}
            </Footer>
          </Layout>
        </Layout>
      </Router>
    );
  }
}

export default App;
