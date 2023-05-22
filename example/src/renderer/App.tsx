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
import advanceRoute from './examples/advanced';
import basicRoute from './examples/basic';
import AuthInfoScreen from './examples/config/AuthInfoScreen';
import hooksRoutes from './examples/hooks';

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
              <SubMenu key="sub1" icon={<GithubOutlined />} title="Basic">
                {basicRoute.map(({ path, title }, index) => {
                  console.log('path, title ', path, title);
                  return (
                    <Menu.Item key={`${index} ${title}`}>
                      <Link to={path}>{title}</Link>
                    </Menu.Item>
                  );
                })}
              </SubMenu>
              <SubMenu key="sub3" icon={<GithubOutlined />} title="Advanced">
                {advanceRoute.map(({ path, title }, index) => {
                  return (
                    <Menu.Item key={`${index} ${title}`}>
                      <Link to={path}>{title}</Link>
                    </Menu.Item>
                  );
                })}
              </SubMenu>
              <SubMenu key="sub2" icon={<GithubOutlined />} title="Hooks">
                {hooksRoutes.map(({ path, title }, index) => {
                  console.log('path, title---> ', path, title);
                  return (
                    <Menu.Item key={`${index} ${title}`}>
                      <Link to={path}>{title}</Link>
                    </Menu.Item>
                  );
                })}
              </SubMenu>
            </Menu>
          </Sider>
          <Layout className="site-layout">
            <Content style={{ flex: 1 }}>
              <Switch>
                <Route path="/" children={<AuthInfoScreen />} exact={true} />
                {basicRoute.map((route: any, index) => (
                  <Route
                    key={`${index}`}
                    path={route.path}
                    children={<route.component />}
                  />
                ))}
                {advanceRoute.map((route: any, index) => (
                  <Route
                    key={`${index}`}
                    path={route.path}
                    children={<route.component />}
                  />
                ))}
                {hooksRoutes.map((route: any, index) => (
                  <Route
                    key={`${index}`}
                    path={route.path}
                    children={<route.component />}
                  />
                ))}
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
