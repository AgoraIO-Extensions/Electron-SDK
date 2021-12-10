/*
 * @Author: zhangtao@agora.io
 * @Date: 2021-04-22 20:53:37
 * @Last Modified by: zhangtao@agora.io
 * @Last Modified time: 2021-10-19 18:43:09
 */
#include "node_iris_rtc_engine.h"
#include <assert.h>
#include <memory>
#include "node_iris_event_handler.h"

namespace agora {
namespace rtc {
namespace electron {
using namespace iris::rtc;

const char* NodeIrisRtcEngine::_class_name = "NodeIrisRtcEngine";
const char* NodeIrisRtcEngine::_ret_code_str = "retCode";
const char* NodeIrisRtcEngine::_ret_result_str = "result";
napi_ref* NodeIrisRtcEngine::_ref_construcotr_ptr = nullptr;

NodeIrisRtcEngine::NodeIrisRtcEngine() {
  LOG_F(INFO, "NodeIrisRtcEngine::NodeIrisRtcEngine()");
  ::UseJsonArray();
  // main_process
  _iris_engine = std::make_shared<IrisRtcEngine>();
  _iris_raw_data = _iris_engine->raw_data();
  
  _iris_video_frame_buffer_manager = std::make_shared<iris::IrisVideoFrameBufferManager>();
  _iris_raw_data->Attach(_iris_video_frame_buffer_manager.get());
  _iris_raw_data_plugin_manager = _iris_raw_data->plugin_manager();
  _iris_event_handler = std::make_shared<NodeIrisEventHandler>();
  _iris_engine->SetEventHandler(_iris_event_handler.get());

}

NodeIrisRtcEngine::~NodeIrisRtcEngine() {
  LOG_F(INFO, "NodeIrisRtcEngine::~NodeIrisRtcEngine");
}

napi_value NodeIrisRtcEngine::Init(napi_env env, napi_value exports) {
  napi_status status;
  napi_property_descriptor properties[] = {
      DECLARE_NAPI_METHOD("CallApi", CallApi),
      DECLARE_NAPI_METHOD("CallApiWithBuffer", CallApiWithBuffer),
      DECLARE_NAPI_METHOD("OnEvent", OnEvent),
      DECLARE_NAPI_METHOD("GetDeviceManager", GetDeviceManager),
      DECLARE_NAPI_METHOD("GetScreenWindowsInfo", GetScreenWindowsInfo),
      DECLARE_NAPI_METHOD("GetScreenDisplaysInfo", GetScreenDisplaysInfo),
      DECLARE_NAPI_METHOD("EnableVideoFrameCache", EnableVideoFrameCache),
      DECLARE_NAPI_METHOD("DisableVideoFrameCache", DisableVideoFrameCache),
      DECLARE_NAPI_METHOD("GetVideoStreamData", GetVideoStreamData),
      DECLARE_NAPI_METHOD("SetAddonLogFile", SetAddonLogFile),
      DECLARE_NAPI_METHOD("PluginCallApi", PluginCallApi),
      DECLARE_NAPI_METHOD("Release", Release)};

  napi_value cons;
  status = napi_define_class(env, _class_name, NAPI_AUTO_LENGTH, New, nullptr,
                             12, properties, &cons);
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
  NodeIrisRtcEngine::_ref_construcotr_ptr = new napi_ref();
  status = napi_create_reference(env, cons, 1, NodeIrisRtcEngine::_ref_construcotr_ptr);
  // #endif

  assert(status == napi_ok);
  status = napi_set_named_property(env, exports, _class_name, cons);
  assert(status == napi_ok);
  return exports;
}

napi_value NodeIrisRtcEngine::New(napi_env env, napi_callback_info info) {
  napi_status status;
  napi_value target;
  status = napi_get_new_target(env, info, &target);
  assert(status == napi_ok);
  bool is_constructor = target != nullptr;

  if (is_constructor) {
    LOG_F(INFO, "New");
    napi_value jsthis;
    status = napi_get_cb_info(env, info, nullptr, nullptr, &jsthis, nullptr);
    assert(status == napi_ok);

    auto iris_engine = new NodeIrisRtcEngine();
    iris_engine->_env = env;
    status =
        napi_wrap(env, jsthis, reinterpret_cast<void*>(iris_engine),
                  NodeIrisRtcEngine::Destructor, nullptr, &iris_engine->_ref);
    assert(status == napi_ok);
    return jsthis;
  } else {
    napi_value instance;
    status = napi_new_instance(env, Constructor(env), 0, nullptr, &instance);
    assert(status == napi_ok);
    return instance;
  }
}

napi_value NodeIrisRtcEngine::Constructor(napi_env env) {
  void* instance = nullptr;
  napi_value cons;
  napi_status status;
  // #if NAPI_VERSION >= 6
  // status = napi_get_instance_data(env, &instance);
  // assert(status == napi_ok);
  // napi_ref* constructor = static_cast<napi_ref*>(instance);
  // status = napi_get_reference_value(env, *constructor, &cons);
  // #else
  status = napi_get_reference_value(env, *NodeIrisRtcEngine::_ref_construcotr_ptr, &cons);
  // #endif
  
  assert(status == napi_ok);
  return cons;
}

void NodeIrisRtcEngine::Destructor(napi_env env,
                                   void* nativeObject,
                                   void* finalize_hint) {
  reinterpret_cast<NodeIrisRtcEngine*>(nativeObject)->~NodeIrisRtcEngine();
}

napi_value NodeIrisRtcEngine::CallApi(napi_env env, napi_callback_info info) {
  napi_status status;
  size_t argc = 2;
  napi_value args[2];
  napi_value jsthis;
  status = napi_get_cb_info(env, info, &argc, args, &jsthis, nullptr);
  assert(status == napi_ok);

  NodeIrisRtcEngine* nodeIrisRtcEngine;
  status =
      napi_unwrap(env, jsthis, reinterpret_cast<void**>(&nodeIrisRtcEngine));

  int api_type = 0;
  std::string parameter = "";

  status = napi_get_value_int32(env, args[0], &api_type);
  status = napi_get_value_utf8string(env, args[1], parameter);
  if (strcmp(parameter.c_str(), "") == 0) {
    parameter = "{}";
  }

  char result[512];
  memset(result, '\0', 512);

  int ret = ERROR_PARAMETER_1;
  std::shared_ptr<iris::rtc::IrisRtcEngine> finalEngine = nodeIrisRtcEngine->_iris_engine;
  if (finalEngine) {
    try {
      ret = finalEngine->CallApi((ApiTypeEngine)api_type, parameter.c_str(),
                                 result);
      LOG_F(INFO, "CallApi(type:%d) parameter: %s, ret: %d",api_type, parameter.c_str(), ret);
    } catch (std::exception& e) {
      nodeIrisRtcEngine->OnApiError(e.what());
      LOG_F(INFO, "CallApi(type:%d) parameter: catch excepton msg: %s",api_type, e.what());
    }
  } else {
    LOG_F(INFO, "CallApi(type:%d) parameter did not initialize engine yet",
          api_type);
    ret = ERROR_NOT_INIT;
  }
  RETURE_NAPI_OBJ();
}

napi_value NodeIrisRtcEngine::CallApiWithBuffer(napi_env env,
                                                napi_callback_info info) {
  napi_status status;
  size_t argc = 5;
  napi_value args[5];
  napi_value jsthis;
  status = napi_get_cb_info(env, info, &argc, args, &jsthis, nullptr);
  assert(status == napi_ok);

  NodeIrisRtcEngine* nodeIrisRtcEngine;
  status =
      napi_unwrap(env, jsthis, reinterpret_cast<void**>(&nodeIrisRtcEngine));

  std::string parameter = "";
  std::string buffer = "";
  int api_type = 0;

  status = napi_get_value_int32(env, args[0], &api_type);
  status = napi_get_value_utf8string(env, args[1], parameter);
  status = napi_get_value_utf8string(env, args[2], buffer);

  char result[512];
  int ret = ERROR_PARAMETER_1;
  memset(result, '\0', 512);

  if (nodeIrisRtcEngine->_iris_engine) {
    try {
      switch (ApiTypeEngine(api_type)) {
        case kEngineRegisterPacketObserver: {
          break;
        }
        case kEngineSendStreamMessage: {
          std::shared_ptr<iris::rtc::IrisRtcEngine> finalEngine = nodeIrisRtcEngine->_iris_engine;
          if (finalEngine) {
            ret =
                finalEngine->CallApi((ApiTypeEngine)api_type, parameter.c_str(),
                                     const_cast<char*>(buffer.c_str()), result);
          } else {
            LOG_F(INFO,
                  "CallApiWithBuffer parameter did not initialize "
                  "engine yet and type is %d", api_type);
          }
          break;
        }
        case kMediaPushAudioFrame: {
          break;
        }
        case kMediaPullAudioFrame: {
          break;
        }
        case kMediaPushVideoFrame: {
          break;
        }
        default: {
          break;
        }
      }
    } catch (std::exception& e) {
      nodeIrisRtcEngine->OnApiError(e.what());
    }
  } else {
    ret = ERROR_NOT_INIT;
  }

  RETURE_NAPI_OBJ();
}

napi_value NodeIrisRtcEngine::OnEvent(napi_env env, napi_callback_info info) {
  napi_status status;
  size_t argc = 2;
  napi_value args[2];
  napi_value jsthis;
  status = napi_get_cb_info(env, info, &argc, args, &jsthis, nullptr);

  assert(status == napi_ok);

  NodeIrisRtcEngine* nodeIrisRtcEngine;
  status =
      napi_unwrap(env, jsthis, reinterpret_cast<void**>(&nodeIrisRtcEngine));
  assert(status == napi_ok);
  std::string parameter = "";
  status = napi_get_value_utf8string(env, args[0], parameter);
  assert(status == napi_ok);
  napi_value cb = args[1];

  napi_value global;
  status = napi_get_global(env, &global);
  assert(status == napi_ok);
  if (nodeIrisRtcEngine->_iris_engine) {
    nodeIrisRtcEngine->_iris_event_handler->addEvent(parameter, env, cb,
                                                     global);
  } else {
    LOG_F(INFO, "NodeIrisRtcEngine::OnEvent error Not Init Engine");
  }
  napi_value retValue = nullptr;
  return retValue;
}



napi_value NodeIrisRtcEngine::GetDeviceManager(napi_env env,
                                               napi_callback_info info) {
  NodeIrisRtcDeviceManager::Init(env);
  napi_status status;
  napi_value jsthis;
  status = napi_get_cb_info(env, info, nullptr, nullptr, &jsthis, nullptr);
  assert(status == napi_ok);

  NodeIrisRtcEngine* nodeIrisRtcEngine;
  status =
      napi_unwrap(env, jsthis, reinterpret_cast<void**>(&nodeIrisRtcEngine));

  if (!nodeIrisRtcEngine->_iris_engine) {
    LOG_F(INFO, "NodeIrisRtcEngine::GetDeviceManager error Not Init Engine");
    // TODO
    napi_value value = nullptr;
    return value;
  }
  auto _device_manager = nodeIrisRtcEngine->_iris_engine->device_manager();
  NodeIrisRtcDeviceManager::_staticDeviceManager = _device_manager;
  napi_value _js_device_manager = NodeIrisRtcDeviceManager::NewInstance(env);
  return _js_device_manager;
}

napi_value NodeIrisRtcEngine::GetScreenWindowsInfo(napi_env env,
                                                   napi_callback_info info) {
  napi_status status;
  napi_value jsthis;
  status = napi_get_cb_info(env, info, nullptr, nullptr, &jsthis, nullptr);

  napi_value array;
  napi_create_array(env, &array);

  auto _allWindows = getAllWindowInfo();
  for (auto i = 0; i < _allWindows.size(); i++) {
    auto _windowInfo = _allWindows[i];
    napi_value obj;
    napi_create_object(env, &obj);
#ifdef _WIN32
    UINT32 windowId = (UINT32)_windowInfo.windowId;
#elif defined(__APPLE__)
    unsigned int windowId = _windowInfo.windowId;
#endif

    napi_obj_set_property(env, obj, "windowId", windowId);
    napi_obj_set_property(env, obj, "name", _windowInfo.name);
    napi_obj_set_property(env, obj, "ownerName", _windowInfo.ownerName);
    napi_obj_set_property(env, obj, "width", _windowInfo.width);
    napi_obj_set_property(env, obj, "height", _windowInfo.height);
    napi_obj_set_property(env, obj, "x", _windowInfo.x);
    napi_obj_set_property(env, obj, "y", _windowInfo.y);
    napi_obj_set_property(env, obj, "originWidth", _windowInfo.originWidth);
    napi_obj_set_property(env, obj, "originHeight", _windowInfo.originHeight);

    if (_windowInfo.imageData) {
      napi_obj_set_property(env, obj, "image", _windowInfo.imageData,
                            _windowInfo.imageDataLength);
      free(_windowInfo.imageData);
    }
    napi_set_element(env, array, i, obj);
  }
  return array;
}

napi_value NodeIrisRtcEngine::GetScreenDisplaysInfo(napi_env env,
                                                    napi_callback_info info) {
  napi_status status;
  napi_value jsthis;
  status = napi_get_cb_info(env, info, nullptr, nullptr, &jsthis, nullptr);

  napi_value array;
  napi_create_array(env, &array);

  auto _allDisplays = getAllDisplayInfo();

  for (auto i = 0; i < _allDisplays.size(); i++) {
    napi_value displayObj;
    napi_create_object(env, &displayObj);
    auto _displayInfo = _allDisplays[i];
#ifdef WIN32 // __WIN32
    auto _displayId = _displayInfo.displayInfo;
#else
    auto _displayId = _displayInfo.displayId;
#endif
    napi_value obj;
    napi_create_object(env, &obj);

    napi_obj_set_property(env, obj, "x", _displayInfo.x);
    napi_obj_set_property(env, obj, "y", _displayInfo.y);
    napi_obj_set_property(env, obj, "width", _displayInfo.width);
    napi_obj_set_property(env, obj, "height", _displayInfo.height);
    napi_obj_set_property(env, obj, "id", _displayId.idVal);
    napi_obj_set_property(env, displayObj, "displayId", obj);
    napi_obj_set_property(env, displayObj, "width", _displayInfo.width);
    napi_obj_set_property(env, displayObj, "height", _displayInfo.height);
    napi_obj_set_property(env, displayObj, "x", _displayInfo.x);
    napi_obj_set_property(env, displayObj, "y", _displayInfo.y);
    napi_obj_set_property(env, displayObj, "isMain", _displayInfo.isMain);
    napi_obj_set_property(env, displayObj, "isActive", _displayInfo.isActive);
    napi_obj_set_property(env, displayObj, "isBuiltin", _displayInfo.isBuiltin);
    if (_displayInfo.imageData) {
      napi_obj_set_property(env, displayObj, "image", _displayInfo.imageData,
                            _displayInfo.imageDataLength);
      free(_displayInfo.imageData);
    }
    napi_set_element(env, array, i, displayObj);
  }
  return array;
}

napi_value NodeIrisRtcEngine::SetAddonLogFile(napi_env env,
                                              napi_callback_info info) {
  napi_status status;
  napi_value jsthis;
  size_t argc = 2;
  napi_value args[2];
  status = napi_get_cb_info(env, info, &argc, args, &jsthis, nullptr);

  NodeIrisRtcEngine* nodeIrisRtcEngine;
  status =
      napi_unwrap(env, jsthis, reinterpret_cast<void**>(&nodeIrisRtcEngine));

  std::string file_path = "";
  status = napi_get_value_utf8string(env, args[0], file_path);

  char result[512];
  int ret = ERROR_PARAMETER_1;
  memset(result, '\0', 512);

  ret = startLogService(file_path.c_str());
  RETURE_NAPI_OBJ();
}

void NodeIrisRtcEngine::OnApiError(const char* errorMessage) {
  _iris_event_handler->OnEvent("onApiError", errorMessage);
}

napi_value NodeIrisRtcEngine::PluginCallApi(napi_env env,
                                            napi_callback_info info) {
  napi_status status;
  napi_value jsthis;
  size_t argc = 3;
  napi_value args[3];
  status = napi_get_cb_info(env, info, &argc, args, &jsthis, nullptr);

  NodeIrisRtcEngine* nodeIrisRtcEngine;
  status =
      napi_unwrap(env, jsthis, reinterpret_cast<void**>(&nodeIrisRtcEngine));

  int api_type = 0;
  std::string parameter = "";
  status = napi_get_value_int32(env, args[0], &api_type);
  status = napi_get_value_utf8string(env, args[1], parameter);
  char result[512];
  memset(result, '\0', 512);
  LOG_F(INFO, "CallApi parameter: %s", parameter.c_str());
  int ret = ERROR_PARAMETER_1;
  
  auto finalPluginManager = nodeIrisRtcEngine->_iris_raw_data_plugin_manager;
  try {
    ret = finalPluginManager->CallApi((ApiTypeRawDataPluginManager)api_type,
                                      parameter.c_str(), result);
  } catch (std::exception &e) {
    LOG_F(INFO, "PluginCallApi catch exception %s",
          e.what());
    nodeIrisRtcEngine->OnApiError(e.what());
  }
  RETURE_NAPI_OBJ();
}

napi_value NodeIrisRtcEngine::EnableVideoFrameCache(napi_env env,
                                                    napi_callback_info info) {
  napi_status status;
  napi_value jsthis;
  size_t argc = 1;
  napi_value args[0];
  status = napi_get_cb_info(env, info, &argc, args, &jsthis, nullptr);

  NodeIrisRtcEngine* nodeIrisRtcEngine;
  status =
      napi_unwrap(env, jsthis, reinterpret_cast<void**>(&nodeIrisRtcEngine));

  napi_value obj = args[0];

  unsigned int uid = 0;
  std::string channelId = "";
  unsigned int width = 0;
  unsigned int height = 0;

  napi_obj_get_property(env, obj, "uid", uid);
  napi_obj_get_property(env, obj, "channelId", channelId);
  napi_obj_get_property(env, obj, "width", width);
  napi_obj_get_property(env, obj, "height", height);

  char result[512];
  memset(result, '\0', 512);
  int ret = ERROR_PARAMETER_1;
  
  if (!nodeIrisRtcEngine->_iris_video_frame_buffer_manager) {
    ret = ERROR_NOT_INIT;
    LOG_F(INFO, "IrisVideoFrameBufferManager Not Init");
  } else {
    try {
      iris::IrisVideoFrameBuffer buffer(VideoFrameType::kVideoFrameTypeYUV420, nullptr, width, height);
      nodeIrisRtcEngine->_iris_video_frame_buffer_manager->EnableVideoFrameBuffer(buffer, uid,
                                                     channelId.c_str());
      ret = ERROR_OK;
    } catch (std::exception& e) {
      LOG_F(INFO, "EnableVideoFrameCache catch exception %s", e.what());
      nodeIrisRtcEngine->OnApiError(e.what());
    }
  }

  RETURE_NAPI_OBJ();
}

napi_value NodeIrisRtcEngine::DisableVideoFrameCache(napi_env env,
                                                     napi_callback_info info) {
  napi_status status;
  napi_value jsthis;
  size_t argc = 1;
  napi_value args[0];
  status = napi_get_cb_info(env, info, &argc, args, &jsthis, nullptr);

  NodeIrisRtcEngine* nodeIrisRtcEngine;
  status =
      napi_unwrap(env, jsthis, reinterpret_cast<void**>(&nodeIrisRtcEngine));

  napi_value obj = args[0];

  unsigned int uid = 0;
  std::string channelId = "";

  napi_obj_get_property(env, obj, "uid", uid);
  unsigned int *uidPtr;
  uidPtr = &uid;
  napi_obj_get_property(env, obj, "channelId", channelId);
  
  char result[512];
  memset(result, '\0', 512);
  int ret = ERROR_PARAMETER_1;

  if (!nodeIrisRtcEngine->_iris_video_frame_buffer_manager) {
    ret = ERROR_NOT_INIT;
    LOG_F(INFO, "IrisVideoFrameBufferManager Not Init");
  } else {
    try {
      nodeIrisRtcEngine->_iris_video_frame_buffer_manager->DisableVideoFrameBuffer(uidPtr, channelId.c_str());
      ret = ERROR_OK;
    } catch (std::exception& e) {
      LOG_F(INFO, "DisableVideoFrameCache catch exception %s", e.what());
      nodeIrisRtcEngine->OnApiError(e.what());
    }
  }

  RETURE_NAPI_OBJ();
}

napi_value NodeIrisRtcEngine::GetVideoStreamData(napi_env env,
                                                 napi_callback_info info) {
  napi_status status;
  napi_value jsthis;
  size_t argc = 1;
  napi_value args[0];
  status = napi_get_cb_info(env, info, &argc, args, &jsthis, nullptr);

  NodeIrisRtcEngine* nodeIrisRtcEngine;
  status =
      napi_unwrap(env, jsthis, reinterpret_cast<void**>(&nodeIrisRtcEngine));

  napi_value obj = args[0];
  unsigned int uid;
  std::string channel_id;
  napi_value y_buffer_obj;
  void* y_buffer;
  size_t y_length;
  napi_value u_buffer_obj;
  void* u_buffer;
  size_t u_length;
  napi_value v_buffer_obj;
  void* v_buffer;
  size_t v_length;
  int height;
  int y_stride;

  napi_obj_get_property(env, obj, "uid", uid);
  napi_obj_get_property(env, obj, "channelId", channel_id);

  napi_obj_get_property(env, obj, "yBuffer", y_buffer_obj);
  napi_get_buffer_info(env, y_buffer_obj, &y_buffer, &y_length);

  napi_obj_get_property(env, obj, "uBuffer", u_buffer_obj);
  napi_get_buffer_info(env, u_buffer_obj, &u_buffer, &u_length);

  napi_obj_get_property(env, obj, "vBuffer", v_buffer_obj);
  napi_get_buffer_info(env, v_buffer_obj, &v_buffer, &v_length);

  napi_obj_get_property(env, obj, "height", height);
  napi_obj_get_property(env, obj, "yStride", y_stride);

  IrisVideoFrame _videoFrame = IrisVideoFrame_default;
  _videoFrame.y_buffer = y_buffer;
  _videoFrame.u_buffer = u_buffer;
  _videoFrame.v_buffer = v_buffer;
  _videoFrame.height = height;
  _videoFrame.y_stride = y_stride;

  bool isFresh = false;
  bool ret = false;
  
  if (nodeIrisRtcEngine->_iris_video_frame_buffer_manager) {
    ret = nodeIrisRtcEngine->_iris_video_frame_buffer_manager->GetVideoFrame(_videoFrame, isFresh, uid,
                                           channel_id.c_str());
  } else {
    ret = false;
    LOG_F(INFO, "IrisVideoFrameBufferManager Not Init");
  }
  unsigned int rotation = 0;
  napi_value retObj;
  status = napi_create_object(env, &retObj);
  napi_obj_set_property(env, retObj, "ret", ret);
  napi_obj_set_property(env, retObj, "isNewFrame", isFresh);
  napi_obj_set_property(env, retObj, "width", _videoFrame.width);
  napi_obj_set_property(env, retObj, "height", _videoFrame.height);
  napi_obj_set_property(env, retObj, "yStride", _videoFrame.y_stride);
  napi_obj_set_property(env, retObj, "rotation", rotation);
  napi_obj_set_property(env, retObj, "timestamp", _videoFrame.render_time_ms);
  return retObj;
}

napi_value NodeIrisRtcEngine::Release(napi_env env, napi_callback_info info) {
  napi_status status;
  napi_value jsthis;
  size_t argc = 2;
  napi_value args[2];
  status = napi_get_cb_info(env, info, &argc, args, &jsthis, nullptr);

  NodeIrisRtcEngine* nodeIrisRtcEngine;
  status =
      napi_unwrap(env, jsthis, reinterpret_cast<void**>(&nodeIrisRtcEngine));
  nodeIrisRtcEngine->_iris_event_handler.reset();
  nodeIrisRtcEngine->_iris_raw_data_plugin_manager = nullptr;
  nodeIrisRtcEngine->_iris_raw_data = nullptr;
  nodeIrisRtcEngine->_iris_engine.reset();
  nodeIrisRtcEngine->_iris_video_frame_buffer_manager.reset();
  
  LOG_F(INFO, "NodeIrisRtcEngine::Release done");

  napi_value retValue = nullptr;
  return retValue;
}
}  // namespace electron
}  // namespace rtc
}  // namespace agora
