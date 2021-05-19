/*
 * @Author: zhangtao@agora.io
 * @Date: 2021-04-22 20:53:18
 * @Last Modified by: zhangtao@agora.io
 * @Last Modified time: 2021-05-13 22:39:43
 */
#include "node_iris_rtc_channel.h"

namespace agora {
namespace rtc {
namespace electron {
using namespace iris::rtc;

Nan_Persistent<v8_Function> NodeIrisRtcChannel::_constructor;

NodeIrisRtcChannel::NodeIrisRtcChannel(v8_Isolate *isolate,
                                       IrisRtcChannel *irisChannel,
                                       const char *channelId) {
  node::AddEnvironmentCleanupHook(isolate, ReleaseNodeSource, this);
  _channel_id = channelId;
  _isolate = isolate;
  _iris_channel = irisChannel;
  _iris_channel_event_handler.reset(new NodeIrisEventHandler(nullptr));
  _iris_channel->RegisterEventHandler(channelId,
                                      _iris_channel_event_handler.get());
  LOG_F(INFO, "NodeIrisRtcChannel::NodeIrisRtcChannel  channelId: %s",
        channelId);
}

NodeIrisRtcChannel::~NodeIrisRtcChannel() {
  LOG_F(INFO, "NodeIrisRtcChannel::~NodeIrisRtcChannel  channelId");
}

v8_Local<v8_Object> NodeIrisRtcChannel::Init(v8_Isolate *isolate,
                                             IrisRtcChannel *irisChannel,
                                             const char *channelId) {
  auto _context = isolate->GetCurrentContext();
  auto _template = v8_FunctionTemplate::New(isolate, CreateInstance);
  _template->SetClassName(
      Nan::New<v8_String>("NodeIrisRtcChannel").ToLocalChecked());
  _template->InstanceTemplate()->SetInternalFieldCount(5);

  Nan::SetPrototypeMethod(_template, "CallApi", CallApi);
  Nan::SetPrototypeMethod(_template, "CallApiWithBuffer", CallApiWithBuffer);
  Nan::SetPrototypeMethod(_template, "OnEvent", OnEvent);
  Nan::SetPrototypeMethod(_template, "Release", Release);
  _constructor.Reset(_template->GetFunction(_context).ToLocalChecked());

  auto _constructor = _template->GetFunction(_context).ToLocalChecked();
  auto _argChannel = v8_Local<v8_External>::New(
      isolate, v8_External::New(isolate, irisChannel));
  auto _argChannelId = nan_create_local_value_string_(isolate, channelId);
  v8_Local<v8_Value> _argv[2] = {_argChannel, _argChannelId};
  auto jschannel =
      _constructor->NewInstance(_context, 2, _argv).ToLocalChecked();
  return jschannel;
}

void NodeIrisRtcChannel::CreateInstance(
    const v8_FunctionCallbackInfo<v8_Value> &args) {
  auto *_isolate = args.GetIsolate();
  auto _argChannel = v8_Local<v8_External>::Cast(args[0]);
  auto _argChannelId = nan_api_get_value_utf8string_(args[1]);
  auto _irisChannel = static_cast<IrisRtcChannel *>(_argChannel->Value());
  auto _channel =
      new NodeIrisRtcChannel(_isolate, _irisChannel, _argChannelId.c_str());
  _channel->Wrap(args.This());
  args.GetReturnValue().Set(args.This());
}

void NodeIrisRtcChannel::CallApi(
    const Nan_FunctionCallbackInfo<v8_Value> &args) {
  auto _channel = ObjectWrap::Unwrap<NodeIrisRtcChannel>(args.Holder());
  auto _isolate = args.GetIsolate();
  auto _apiType = nan_api_get_value_int32_(args[0]);
  auto _parameter = nan_api_get_value_utf8string_(args[1]);
  char _result[512];
  memset(_result, '\0', 512);
  int _ret = ERROR_PARAMETER_1;

  if (_channel->_iris_channel) {
    try {
      _ret = _channel->_iris_channel->CallApi((ApiTypeChannel)_apiType,
                                              _parameter.c_str(), _result);
    } catch (std::exception &e) {
      _channel->OnApiError(e.what());
      LOG_F(INFO,
            "NodeIrisRtcChannel::CallApi apiType: %d, parameter: %s, "
            "exception: %s",
            _apiType, _parameter.c_str(), e.what());
    }
  } else {
    _ret = ERROR_NOT_INIT;
  }
  auto _retObj = v8_Object::New(_isolate);
  v8_SET_OBJECT_PROP_UINT32(_isolate, _retObj, "retCode", _ret)
      v8_SET_OBJECT_PROP_STRING(_isolate, _retObj, "result", _result)
          args.GetReturnValue()
              .Set(_retObj);
}

void NodeIrisRtcChannel::CallApiWithBuffer(
    const Nan_FunctionCallbackInfo<v8_Value> &args) {
  auto _channel = ObjectWrap::Unwrap<NodeIrisRtcChannel>(args.Holder());
  auto _isolate = args.GetIsolate();
  auto _apiType = nan_api_get_value_int32_(args[0]);
  auto _parameter = nan_api_get_value_utf8string_(args[1]);
  auto _buffer = nan_api_get_value_utf8string_(args[2]);
  auto _length = nan_api_get_value_int32_(args[3]);
  char _result[512];
  int _ret = ERROR_PARAMETER_1;
  memset(_result, '\0', 512);
  auto _retObj = v8_Object::New(_isolate);

  if (_channel->_iris_channel) {
    try {
      switch (ApiTypeChannel(_apiType)) {
      case ApiTypeChannel::kChannelRegisterPacketObserver: {
        break;
      }
      case ApiTypeChannel::kChannelSendStreamMessage: {

        _ret = _channel->_iris_channel->CallApi(
            (ApiTypeChannel)_apiType, _parameter.c_str(),
            const_cast<char *>(_buffer.c_str()), _result);
        break;
      }
      case ApiTypeChannel::kChannelSendMetadata: {
        _ret = _channel->_iris_channel->CallApi(
            (ApiTypeChannel)_apiType, _parameter.c_str(),
            const_cast<char *>(_buffer.c_str()), _result);
        break;
      }
      default: {
        break;
      }
      }
    } catch (std::exception &e) {
      LOG_F(INFO,
            "NodeIrisRtcChannel::CallApiWithBuffer apiType: %d, parameter: %s, "
            "exception: %s",
            _apiType, _parameter.c_str(), e.what());
      _channel->OnApiError(e.what());
    }
  } else {
    LOG_F(INFO, "NodeIrisRtcChannel::Release Not Init");
  }

  v8_SET_OBJECT_PROP_UINT32(_isolate, _retObj, "retCode", _ret)
      v8_SET_OBJECT_PROP_STRING(_isolate, _retObj, "result", _result)
          args.GetReturnValue()
              .Set(_retObj);
}

void NodeIrisRtcChannel::OnEvent(
    const Nan_FunctionCallbackInfo<v8_Value> &args) {
  auto _channel = ObjectWrap::Unwrap<NodeIrisRtcChannel>(args.Holder());
  auto _parameter = nan_api_get_value_utf8string_(args[0]);
  auto _callback = args[1].As<v8_Function>();
  Nan_Persistent<v8_Function> _persist;
  _persist.Reset(_callback);

  auto _obj = args.This();
  Nan_Persistent<v8_Object> _persistObj;
  _persistObj.Reset(_obj);

  if (_channel->_iris_channel) {
    _channel->_iris_channel_event_handler->addEvent(_parameter, _persistObj,
                                                    _persist);
  } else {
    LOG_F(INFO, "NodeIrisRtcChannel::Release Not Init");
  }
}

void NodeIrisRtcChannel::Release(
    const Nan_FunctionCallbackInfo<v8_Value> &args) {
  auto _channel = ObjectWrap::Unwrap<NodeIrisRtcChannel>(args.Holder());

  if (_channel->_iris_channel) {
    _channel->_iris_channel->UnRegisterEventHandler(
        _channel->_channel_id.c_str());
    _channel->_iris_channel_event_handler.reset(nullptr);
    _channel->_iris_channel = nullptr;
  } else {
    LOG_F(INFO, "NodeIrisRtcChannel::Release Not Init");
  }
}

void NodeIrisRtcChannel::ReleaseNodeSource(void *data) {
  NodeIrisRtcChannel *_channel = static_cast<NodeIrisRtcChannel *>(data);
  delete _channel;
  _channel = nullptr;
}

void NodeIrisRtcChannel::OnApiError(const char *errorMessage) {
  _iris_channel_event_handler->OnEvent("apiError", errorMessage);
}
} // namespace electron
} // namespace rtc
} // namespace agora