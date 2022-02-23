
#include "node_iris_rtc_channel.h"

namespace agora {
namespace rtc {
namespace electron {
using namespace iris::rtc;
const char* NodeIrisRtcChannel::_class_name = "NodeIrisRtcChannel";
const char* NodeIrisRtcChannel::_ret_code_str = "retCode";
const char* NodeIrisRtcChannel::_ret_result_str = "result";
iris::rtc::IIrisRtcChannel* NodeIrisRtcChannel::_staticIrisChannel = nullptr;
const char* NodeIrisRtcChannel::_staticChannelId = "";
napi_ref* NodeIrisRtcChannel::_ref_construcotr_ptr = nullptr;

NodeIrisRtcChannel::NodeIrisRtcChannel(napi_env env,
                                       IIrisRtcChannel* irisChannel,
                                       const char* channelId)
    : _env(env), _iris_channel(irisChannel), _channel_id(channelId) {
  napi_add_env_cleanup_hook(env, ReleaseNodeSource, this);
  _iris_channel_event_handler.reset(new NodeIrisEventHandler(MAIN));
  _iris_channel->RegisterEventHandler(channelId,
                                      _iris_channel_event_handler.get());
  LOG_F(INFO, "NodeIrisRtcChannel::NodeIrisRtcChannel  channelId: %s",
        channelId);
}

NodeIrisRtcChannel::~NodeIrisRtcChannel() {
  _env = nullptr;
  _ref = nullptr;
  ;
  _iris_channel_event_handler.reset(nullptr);
  _iris_channel = nullptr;
  ;
  _channel_id = nullptr;
  ;
  LOG_F(INFO, "NodeIrisRtcChannel::~NodeIrisRtcChannel  channelId");
}

napi_value NodeIrisRtcChannel::NewInstance(napi_env env) {
  napi_status status;
  napi_value instance;
  status = napi_new_instance(env, Constructor(env), 0, nullptr, &instance);
  return instance;
}
napi_value NodeIrisRtcChannel::New(napi_env env, napi_callback_info info) {
  napi_status status;
  napi_value jsthis;
  status = napi_get_cb_info(env, info, nullptr, nullptr, &jsthis, nullptr);
  assert(status == napi_ok);
  auto channel =
      new NodeIrisRtcChannel(env, _staticIrisChannel, _staticChannelId);
  _staticIrisChannel = nullptr;
  _staticChannelId = nullptr;
  status = napi_wrap(env, jsthis, reinterpret_cast<void*>(channel),
                     NodeIrisRtcChannel::Destructor, nullptr, &channel->_ref);
  assert(status == napi_ok);
  return jsthis;
}

napi_value NodeIrisRtcChannel::Constructor(napi_env env) {
  void* instance_data = nullptr;
  napi_value cons;
  napi_status status;
  // #if NAPI_VERSION >= 6
  // status = napi_get_instance_data(env, &instance_data);
  // napi_ref* constructor = static_cast<napi_ref*>(instance_data);
  // status = napi_get_reference_value(env, *constructor, &cons);
  // #else
  status = napi_get_reference_value(
      env, *NodeIrisRtcChannel::_ref_construcotr_ptr, &cons);
  // #endif
  assert(status == napi_ok);
  return cons;
}

void NodeIrisRtcChannel::Destructor(napi_env env, void* nativeObject,
                                    void* finalize_hint) {
  reinterpret_cast<NodeIrisRtcChannel*>(nativeObject)->~NodeIrisRtcChannel();
}
napi_value NodeIrisRtcChannel::Init(napi_env env) {
  napi_status status;
  napi_property_descriptor properties[] = {
      DECLARE_NAPI_METHOD("CallApi", CallApi),
      DECLARE_NAPI_METHOD("CallApiWithBuffer", CallApiWithBuffer),
      DECLARE_NAPI_METHOD("OnEvent", OnEvent),
      DECLARE_NAPI_METHOD("Release", Release)};
  napi_value cons;
  status = napi_define_class(env, _class_name, NAPI_AUTO_LENGTH, New, nullptr,
                             4, properties, &cons);
  assert(status == napi_ok);

  // #if NAPI_VERSION >= 6
  // napi_ref* constructor = new napi_ref();
  // status = napi_create_reference(env, cons, 1, constructor);
  // assert(status == napi_ok);
  // status = napi_set_instance_data(
  //     env, constructor,
  //     [](napi_env env, void* data, void* hint) {
  //       napi_ref* constructor = static_cast<napi_ref*>(data);
  //       napi_status status = napi_delete_reference(env, *constructor);
  //       assert(status == napi_ok);
  //       delete constructor;
  //     },
  //     nullptr);
  // #else
  NodeIrisRtcChannel::_ref_construcotr_ptr = new napi_ref();
  status = napi_create_reference(env, cons, 1,
                                 NodeIrisRtcChannel::_ref_construcotr_ptr);
  // #endif
  assert(status == napi_ok);

  return cons;
}

napi_value NodeIrisRtcChannel::CallApi(napi_env env, napi_callback_info info) {
  napi_status status;
  size_t argc = 3;
  napi_value args[3];
  napi_value jsthis;
  status = napi_get_cb_info(env, info, &argc, args, &jsthis, nullptr);
  assert(status == napi_ok);

  NodeIrisRtcChannel* _channel;
  status = napi_unwrap(env, jsthis, reinterpret_cast<void**>(&_channel));

  int _apiType = 0;
  std::string parameter = "";

  status = napi_get_value_int32(env, args[0], &_apiType);
  status = napi_get_value_utf8string(env, args[1], parameter);

  char result[kMaxResultLength];
  memset(result, '\0', kMaxResultLength);
  int ret = ERROR_PARAMETER_1;
  if (_channel->_iris_channel) {
    try {
      ret = _channel->_iris_channel->CallApi((ApiTypeChannel)_apiType,
                                             parameter.c_str(), result);
    } catch (std::exception& e) {
      LOG_F(INFO,
            "NodeIrisRtcChannel::CallApi apiType: %d, parameter: %s, "
            "exception: %s",
            _apiType, parameter.c_str(), e.what());
      _channel->OnApiError(e.what());
    }
  } else {
    ret = ERROR_NOT_INIT;
  }
  RETURE_NAPI_OBJ();
}

napi_value NodeIrisRtcChannel::CallApiWithBuffer(napi_env env,
                                                 napi_callback_info info) {
  napi_status status;
  size_t argc = 4;
  napi_value args[4];
  napi_value jsthis;
  status = napi_get_cb_info(env, info, &argc, args, &jsthis, nullptr);
  assert(status == napi_ok);

  NodeIrisRtcChannel* _channel;
  status = napi_unwrap(env, jsthis, reinterpret_cast<void**>(&_channel));

  int _apiType = 0;
  std::string parameter = "";
  std::string buffer = "";

  status = napi_get_value_int32(env, args[0], &_apiType);
  status = napi_get_value_utf8string(env, args[1], parameter);
  status = napi_get_value_utf8string(env, args[2], buffer);
  char result[kMaxResultLength];
  memset(result, '\0', kMaxResultLength);
  int ret = ERROR_PARAMETER_1;

  if (_channel->_iris_channel) {
    try {
      switch (ApiTypeChannel(_apiType)) {
        case ApiTypeChannel::kChannelRegisterPacketObserver: {
          break;
        }
        case ApiTypeChannel::kChannelSendStreamMessage: {
          ret = _channel->_iris_channel->CallApi(
              (ApiTypeChannel)_apiType, parameter.c_str(),
              const_cast<char*>(buffer.c_str()), result);
          break;
        }
        case ApiTypeChannel::kChannelSendMetadata: {
          ret = _channel->_iris_channel->CallApi(
              (ApiTypeChannel)_apiType, parameter.c_str(),
              const_cast<char*>(buffer.c_str()), result);
          break;
        }
        default: {
          break;
        }
      }
    } catch (std::exception& e) {
      LOG_F(INFO,
            "NodeIrisRtcChannel::CallApiWithBuffer apiType: %d, parameter: %s, "
            "exception: %s",
            _apiType, parameter.c_str(), e.what());
      _channel->OnApiError(e.what());
    }
  } else {
    LOG_F(INFO, "NodeIrisRtcChannel::Release Not Init");
  }
  RETURE_NAPI_OBJ();
}

napi_value NodeIrisRtcChannel::OnEvent(napi_env env, napi_callback_info info) {
  napi_status status;
  size_t argc = 2;
  napi_value args[2];
  napi_value jsthis;
  status = napi_get_cb_info(env, info, &argc, args, &jsthis, nullptr);
  assert(status == napi_ok);

  NodeIrisRtcChannel* _channel;
  status = napi_unwrap(env, jsthis, reinterpret_cast<void**>(&_channel));
  assert(status == napi_ok);

  std::string parameter = "";
  status = napi_get_value_utf8string(env, args[0], parameter);
  assert(status == napi_ok);
  napi_value cb = args[1];

  napi_value global;
  status = napi_get_global(env, &global);
  assert(status == napi_ok);

  if (_channel->_iris_channel) {
    _channel->_iris_channel_event_handler->addEvent(parameter, env, cb, global);
  } else {
    LOG_F(INFO, "NodeIrisRtcChannel::Release Not Init");
  }
  napi_value retValue = nullptr;
  return retValue;
}

napi_value NodeIrisRtcChannel::Release(napi_env env, napi_callback_info info) {
  napi_status status;

  napi_value jsthis;
  status = napi_get_cb_info(env, info, nullptr, nullptr, &jsthis, nullptr);
  assert(status == napi_ok);

  NodeIrisRtcChannel* _channel;
  status = napi_unwrap(env, jsthis, reinterpret_cast<void**>(&_channel));
  if (_channel->_iris_channel) {
    _channel->_iris_channel->UnRegisterEventHandler(
        _channel->_channel_id.c_str());
    _channel->_iris_channel_event_handler.reset(nullptr);
    _channel->_iris_channel = nullptr;
  } else {
    LOG_F(INFO, "NodeIrisRtcChannel::Release Not Init");
  }
  napi_value retValue = nullptr;
  return retValue;
}

void NodeIrisRtcChannel::ReleaseNodeSource(void* data) {
  NodeIrisRtcChannel* _channel = static_cast<NodeIrisRtcChannel*>(data);
  delete _channel;
  _channel = nullptr;
}

void NodeIrisRtcChannel::OnApiError(const char* errorMessage) {
  _iris_channel_event_handler->OnEvent("onApiError", errorMessage);
}

}  // namespace electron
}  // namespace rtc
}  // namespace agora
