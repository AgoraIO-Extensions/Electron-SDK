import { Input, Row, Card, Form, Button, Checkbox } from 'antd';
import { AgoraEnv } from 'agora-electron-sdk';
import config from '../../../config/agora.config';

console.log('config', config);

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const onFinish = (values: any) => {
  console.log('Success:', values);

  config.appId = values.appId;
  config.channelId = values.channelId;
  config.token = values.token;
  config.uid = +values.uid;
  config.pluginPath = values.pluginPath;

  config.SDKLogPath = values.SDKLogPath;

  config.enableSDKLogging = values.enableSDKDebugLogging;
  config.enableSDKDebugLogging = values.enableSDKLogging;
  AgoraEnv.enableDebugLogging = values.enableSDKDebugLogging;
  AgoraEnv.enableLogging = values.enableSDKLogging;
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};

const AuthInfoScreen = () => {
  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
      }}
    >
      <Row justify="center" align="middle">
        <Card title="Auth Info" style={{ width: 800 }}>
          <Form
            {...layout}
            name="basic"
            initialValues={config}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="App ID"
              name="appId"
              rules={[
                {
                  required: true,
                  message: 'Please input your App ID!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Channel ID"
              name="channelId"
              rules={[
                {
                  required: true,
                  message: 'Please input your channel id!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Token (Optional)"
              name="token"
              rules={[
                {
                  required: false,
                  message: 'Please input your token!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="UID"
              name="uid"
              rules={[
                {
                  required: false,
                  message: 'Please input your uid!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Plugin Path"
              name="pluginPath"
              rules={[
                {
                  required: false,
                  message: 'Please input your plugin path!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Native SDK Log Path"
              name="SDKLogPath"
              rules={[
                {
                  required: true,
                  message: 'Please input log path',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Enable SDK Logging"
              name="enableSDKLogging"
              valuePropName="checked"
            >
              <Checkbox defaultChecked={config.enableSDKLogging} />
            </Form.Item>
            <Form.Item
              label="Enable SDK Debug Logging"
              name="enableSDKDebugLogging"
              valuePropName="checked"
            >
              <Checkbox defaultChecked={config.enableSDKDebugLogging} />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Row>
    </div>
  );
};

export default AuthInfoScreen;
