/*
 * @Author: zhangtao@agora.io
 * @Date: 2021-04-22 20:53:37
 * @Last Modified by: zhangtao@agora.io
 * @Last Modified time: 2021-10-19 18:43:09
 */
#include <memory>
#include "iris_base.h"
#include "node_iris_rtc_engine.h"
#include "node_iris_event_handler.h"

namespace agora {
namespace rtc {
namespace electron {

#if defined(__GUNC__)
#define COMPILER_IS_GCC
#if defined(__MINGW32__) || defined(__MINGW64__)
#define COMPILER_IS_MINGW
#endif
#if defined(__MSYS__)
#define COMPILER_ON_MSYS
#endif
#if defined(__CYGWIN__) || defined(__CYGWIN32__)
#define COMPILER_ON_CYGWIN
#endif
#if defined(__clang__)
#define COMPILER_IS_CLANG
#endif
#elif defined(_MSC_VER)
#define COMPILER_IS_MSVC
#else
#define COMPILER_IS_UNKNOWN
#endif

#if defined(COMPILER_IS_MSVC)
typedef __int64 int64;
typedef unsigned __int64 uint64;
#elif (defined(__LONG_WIDTH__) && __LONG_WIDTH__ == 8) ||                      \
    (defined(__SIZEOF_LONG__) && __SIZEOF_LONG__ == 8)
typedef signed long int64;
typedef unsigned long uint64;
#else
typedef signed long long int64;
typedef unsigned long long uint64;
#endif
using namespace iris::rtc;
using namespace agora::iris::rtc;
const char* NodeIrisRtcEngine::_class_name = "NodeIrisRtcEngine";
const char* NodeIrisRtcEngine::_ret_code_str = "retCode";
const char* NodeIrisRtcEngine::_ret_result_str = "result";
napi_ref* NodeIrisRtcEngine::_ref_construcotr_ptr = nullptr;

NodeIrisRtcEngine::NodeIrisRtcEngine() {
  LOG_F(INFO, "NodeIrisRtcEngine::NodeIrisRtcEngine()");
  // ::UseJsonArray();
}

NodeIrisRtcEngine::~NodeIrisRtcEngine() {
  LOG_F(INFO, "NodeIrisRtcEngine::~NodeIrisRtcEngine");
}

napi_value NodeIrisRtcEngine::Init(napi_env env, napi_value exports) {
  napi_status status = napi_ok;
  napi_property_descriptor properties[] = {
      DECLARE_NAPI_METHOD("CallApi", CallApi),
      DECLARE_NAPI_METHOD("OnEvent", OnEvent),
      DECLARE_NAPI_METHOD("GetScreenWindowsInfo", GetScreenWindowsInfo),
      DECLARE_NAPI_METHOD("GetScreenDisplaysInfo", GetScreenDisplaysInfo),
      DECLARE_NAPI_METHOD("EnableVideoFrameCache", EnableVideoFrameCache),
      DECLARE_NAPI_METHOD("DisableVideoFrameCache", DisableVideoFrameCache),
      DECLARE_NAPI_METHOD("GetVideoStreamData", GetVideoStreamData),
      DECLARE_NAPI_METHOD("SetAddonLogFile", SetAddonLogFile),
      DECLARE_NAPI_METHOD("InitializeEnv", InitializeEnv),
      DECLARE_NAPI_METHOD("ReleaseEnv", ReleaseEnv)};

  napi_value cons;
  status = napi_define_class(env, _class_name, NAPI_AUTO_LENGTH, New, nullptr,
                             10, properties, &cons);
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

    auto irisEngine = new NodeIrisRtcEngine();
    irisEngine->_env = env;
    status =
        napi_wrap(env, jsthis, reinterpret_cast<void*>(irisEngine),
                  NodeIrisRtcEngine::Destructor, nullptr, &irisEngine->_ref);
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
  size_t argc = 4;
  napi_value args[4];
  napi_value jsthis;
  status = napi_get_cb_info(env, info, &argc, args, &jsthis, nullptr);
  assert(status == napi_ok);

  NodeIrisRtcEngine* nodeIrisRtcEngine;
  status =
      napi_unwrap(env, jsthis, reinterpret_cast<void**>(&nodeIrisRtcEngine));

  std::string funcName = "";
  std::string parameter = "";
  uint32_t bufferCount = 0;
 
  status = napi_get_value_utf8string(env, args[0], funcName);
  status = napi_get_value_utf8string(env, args[1], parameter);
 
  status = napi_get_value_uint32(env, args[3], &bufferCount);
  
  if (strcmp(parameter.c_str(), "") == 0) {
    parameter = "{}";
  }

  char result[kBasicResultLength];
  memset(result, '\0', kBasicResultLength);

  int ret = ERROR_PARAMETER_1;
  std::shared_ptr<IrisApiEngine> irisApiEngine =
      nodeIrisRtcEngine->_iris_api_engine;
  if (irisApiEngine) {
    try {

      if (funcName.compare(FUNC_RTCENGINE_SETUPLOCALVIDEO) == 0 ||
          funcName.compare(FUNC_RTCENGINE_SETUPREMOTEVIDEO) == 0 ||
          funcName.compare(FUNC_RTCENGINE_SENDSTREAMMESSAGE) == 0 ||
          funcName.compare(FUNC_RTCENGINEEX_SENDSTREAMMESSAGEEX) == 0 ||
          funcName.compare(FUNC_MEDIAENGINE_PULLAUDIOFRAME) == 0 ||
          funcName.compare(FUNC_MEDIAENGINE_PUSHAUDIOFRAME) == 0 ||
          funcName.compare(FUNC_MEDIAENGINE_PUSHENCODEDVIDEOIMAGE) == 0 ||
          funcName.compare(FUNC_MEDIAENGINE_PUSHENCODEDVIDEOIMAGE2) == 0) {
        uint64* buffer = nullptr; // get node buffer  todo
        ret = irisApiEngine->CallIrisApi(funcName.c_str(), parameter.c_str(),
                                       parameter.length(), buffer, bufferCount,
                                       result);
      }
      else if (funcName.compare(FUNC_MEDIAENGINE_PUSHVIDEOFRAME) == 0 ||
        funcName.compare(FUNC_MEDIAENGINE_PUSHVIDEOFRAME2) == 0) {
        uint64* buffer = nullptr; // todo get node buffers
        ret = irisApiEngine->CallIrisApi(funcName.c_str(), parameter.c_str(),
          parameter.length(), buffer, bufferCount,
          result);
      }
      else
        ret = irisApiEngine->CallIrisApi(funcName.c_str(), parameter.c_str(),
                                       parameter.length(), nullptr, 0, result);
      LOG_F(INFO, "CallApi(func name:%s) parameter: %s, ret: %d",
            funcName.c_str(), parameter.c_str(), ret);
    } catch (std::exception& e) {
      nodeIrisRtcEngine->OnApiError(e.what());
      LOG_F(INFO, "CallApi(func name:%s) parameter: catch excepton msg: %s",
            funcName.c_str(), e.what());
    }
  } else {
    LOG_F(INFO, "CallApi(func name:%s) parameter did not initialize engine yet",
          funcName.c_str());
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
  if (nodeIrisRtcEngine->_iris_api_engine) {
    nodeIrisRtcEngine->_iris_event_handler->addEvent(parameter, env, cb,
                                                     global);
  } else {
    LOG_F(INFO, "NodeIrisRtcEngine::OnEvent error Not Init Engine");
  }
  napi_value retValue = nullptr;
  return retValue;
}

napi_value NodeIrisRtcEngine::GetScreenWindowsInfo(napi_env env,
                                                   napi_callback_info info) {
  napi_status status;
  napi_value jsthis;
  status = napi_get_cb_info(env, info, nullptr, nullptr, &jsthis, nullptr);

  napi_value array;
  napi_create_array(env, &array);

  auto allWindows = getAllWindowInfo();
  for (auto i = 0; i < allWindows.size(); i++) {
    auto _windowInfo = allWindows[i];
    napi_value obj;
    napi_create_object(env, &obj);
#ifdef _WIN32
    UINT32 windowId = (UINT32)_windowInfo.windowId;
#elif defined(__APPLE__) || (__linux__)
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

  auto allDisplays = getAllDisplayInfo();

  for (auto i = 0; i < allDisplays.size(); i++) {
    napi_value displayObj;
    napi_create_object(env, &displayObj);
    auto displayInfo = allDisplays[i];
#ifdef WIN32 // __WIN32
    auto displayId = displayInfo.displayInfo;
#else
    auto displayId = displayInfo.displayId;
#endif
    napi_value obj;
    napi_create_object(env, &obj);

    napi_obj_set_property(env, obj, "x", displayInfo.x);
    napi_obj_set_property(env, obj, "y", displayInfo.y);
    napi_obj_set_property(env, obj, "width", displayInfo.width);
    napi_obj_set_property(env, obj, "height", displayInfo.height);
    napi_obj_set_property(env, obj, "id", displayId.idVal);
    napi_obj_set_property(env, displayObj, "displayId", obj);
    napi_obj_set_property(env, displayObj, "width", displayInfo.width);
    napi_obj_set_property(env, displayObj, "height", displayInfo.height);
    napi_obj_set_property(env, displayObj, "x", displayInfo.x);
    napi_obj_set_property(env, displayObj, "y", displayInfo.y);
    napi_obj_set_property(env, displayObj, "isMain", displayInfo.isMain);
    napi_obj_set_property(env, displayObj, "isActive", displayInfo.isActive);
    napi_obj_set_property(env, displayObj, "isBuiltin", displayInfo.isBuiltin);
    if (displayInfo.imageData) {
      napi_obj_set_property(env, displayObj, "image", displayInfo.imageData,
                            displayInfo.imageDataLength);
      free(displayInfo.imageData);
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

  char result[kBasicStringLength];
  int ret = ERROR_PARAMETER_1;
  memset(result, '\0', kBasicStringLength);

  ret = startLogService(file_path.c_str());
  RETURE_NAPI_OBJ();
}

void NodeIrisRtcEngine::OnApiError(const char* errorMessage) {
  _iris_event_handler->OnEvent("onApiError", errorMessage, nullptr, nullptr, 0);
}

napi_value NodeIrisRtcEngine::EnableVideoFrameCache(napi_env env,
                                                    napi_callback_info info) {
  napi_status status;
  napi_value jsthis;
  size_t argc = 1;
  napi_value args[1];
  status = napi_get_cb_info(env, info, &argc, args, &jsthis, nullptr);

  NodeIrisRtcEngine* nodeIrisRtcEngine;
  status =
      napi_unwrap(env, jsthis, reinterpret_cast<void**>(&nodeIrisRtcEngine));

  IrisVideoFrameBufferConfig config;
  napi_value obj = args[0];

  int videoSourceType;
  std::string channelId = "";
  unsigned int width = 0;
  unsigned int height = 0;

  napi_obj_get_property(env, obj, "uid", config.id);
  napi_obj_get_property(env, obj, "videoSourceType", videoSourceType);
  config.type = (IrisVideoSourceType)videoSourceType;
  napi_obj_get_property(env, obj, "channelId", channelId);
  strcpy(config.key, channelId.c_str());
  napi_obj_get_property(env, obj, "width", width);
  napi_obj_get_property(env, obj, "height", height);

  char result[kBasicStringLength];
  memset(result, '\0', kBasicStringLength);
  int ret = ERROR_PARAMETER_1;
  
  if (!nodeIrisRtcEngine->_iris_video_frame_buffer_manager) {
    ret = ERROR_NOT_INIT;
    LOG_F(INFO, "IrisVideoFrameBufferManager Not Init");
  } else {
    try {
      iris::IrisVideoFrameBuffer buffer(IrisVideoFrameType::kVideoFrameTypeYUV420, nullptr, width, height);
      nodeIrisRtcEngine->_iris_video_frame_buffer_manager->EnableVideoFrameBuffer(buffer, &config);
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
  napi_value args[1];
  status = napi_get_cb_info(env, info, &argc, args, &jsthis, nullptr);

  NodeIrisRtcEngine* nodeIrisRtcEngine;
  status =
      napi_unwrap(env, jsthis, reinterpret_cast<void**>(&nodeIrisRtcEngine));

  napi_value obj = args[0];
  IrisVideoFrameBufferConfig config;

  int videoSourceType;
  std::string channelId = "";

  napi_obj_get_property(env, obj, "uid", config.id);
  napi_obj_get_property(env, obj, "videoSourceType", videoSourceType);
  config.type = (IrisVideoSourceType)videoSourceType;
  napi_obj_get_property(env, obj, "channelId", channelId);
  strcpy(config.key, channelId.c_str());

  char result[kBasicStringLength];
  memset(result, '\0', kBasicStringLength);
  int ret = ERROR_PARAMETER_1;

  if (!nodeIrisRtcEngine->_iris_video_frame_buffer_manager) {
    ret = ERROR_NOT_INIT;
    LOG_F(INFO, "IrisVideoFrameBufferManager Not Init");
  } else {
    try {
      nodeIrisRtcEngine->_iris_video_frame_buffer_manager->DisableVideoFrameBuffer(&config);
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
  napi_value args[1];
  status = napi_get_cb_info(env, info, &argc, args, &jsthis, nullptr);

  NodeIrisRtcEngine* nodeIrisRtcEngine;
  status =
      napi_unwrap(env, jsthis, reinterpret_cast<void**>(&nodeIrisRtcEngine));
  IrisVideoFrameBufferConfig config;

  napi_value obj = args[0];
  int videoSourceType;
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
  int width;

  napi_obj_get_property(env, obj, "uid", config.id);
  napi_obj_get_property(env, obj, "videoSourceType", videoSourceType);
  config.type = (IrisVideoSourceType)videoSourceType;
  napi_obj_get_property(env, obj, "channelId", channel_id);
  strcpy(config.key, channel_id.c_str());

  napi_obj_get_property(env, obj, "yBuffer", y_buffer_obj);
  napi_get_buffer_info(env, y_buffer_obj, &y_buffer, &y_length);

  napi_obj_get_property(env, obj, "uBuffer", u_buffer_obj);
  napi_get_buffer_info(env, u_buffer_obj, &u_buffer, &u_length);

  napi_obj_get_property(env, obj, "vBuffer", v_buffer_obj);
  napi_get_buffer_info(env, v_buffer_obj, &v_buffer, &v_length);

  napi_obj_get_property(env, obj, "height", height);
  napi_obj_get_property(env, obj, "width", width);

  IrisVideoFrame videoFrame = IrisVideoFrame_default;
  videoFrame.y_buffer = y_buffer;
  videoFrame.u_buffer = u_buffer;
  videoFrame.v_buffer = v_buffer;
  videoFrame.height = height;
  videoFrame.width = width;

  bool isFresh = false;

//  typedef enum IRIS_VIDEO_PROCESS_ERR {
//    ERR_OK = 0,
//    ERR_NULL_POINTER = 1,
//    ERR_SIZE_NOT_MATCHING = 2,
//    ERR_BUFFER_EMPTY = 5,
//  } IRIS_VIDEO_PROCESS_ERR;
  napi_value retObj;
  int32_t ret = ERROR_NOT_INIT;
  status = napi_create_object(env, &retObj);

  if (!nodeIrisRtcEngine->_iris_video_frame_buffer_manager.get()) {
    napi_obj_set_property(env, retObj, "ret", ret);
    LOG_F(INFO, "IrisVideoFrameBufferManager Not Init");
    return retObj;
  }
  
  ret = nodeIrisRtcEngine->_iris_video_frame_buffer_manager->GetVideoFrame(videoFrame,
      isFresh, &config);
  
  unsigned int rotation = 0;
  napi_obj_set_property(env, retObj, "ret", ret);
  napi_obj_set_property(env, retObj, "isNewFrame", isFresh);
  napi_obj_set_property(env, retObj, "width", videoFrame.width);
  napi_obj_set_property(env, retObj, "height", videoFrame.height);
  napi_obj_set_property(env, retObj, "yStride", videoFrame.y_stride);
  napi_obj_set_property(env, retObj, "rotation", rotation);
  napi_obj_set_property(env, retObj, "timestamp", videoFrame.render_time_ms);
  return retObj;
}

napi_value NodeIrisRtcEngine::InitializeEnv(napi_env env, napi_callback_info info){
  napi_status status;
  napi_value jsthis;
  size_t argc = 2;
  napi_value args[2];
  status = napi_get_cb_info(env, info, &argc, args, &jsthis, nullptr);

  NodeIrisRtcEngine* nodeIrisRtcEngine;
  status =
      napi_unwrap(env, jsthis, reinterpret_cast<void**>(&nodeIrisRtcEngine));
  
  //create
  auto engine = std::make_shared<IrisApiEngine>();
  auto bufferManager = std::make_shared<iris::IrisVideoFrameBufferManager>();
  auto eventHandler = std::make_shared<NodeIrisEventHandler>();
  
  //combine
  engine.get()->SetIrisRtcEngineEventHandler(eventHandler.get());
  engine.get()->Attach(bufferManager.get());
  
  //assign
  nodeIrisRtcEngine->_iris_api_engine = engine;
  nodeIrisRtcEngine->_iris_video_frame_buffer_manager = bufferManager;
  nodeIrisRtcEngine->_iris_event_handler = eventHandler;
  
  LOG_F(INFO, "NodeIrisRtcEngine::InitializeEnv");
  napi_value retValue = nullptr;
  return retValue;
}
napi_value NodeIrisRtcEngine::ReleaseEnv(napi_env env, napi_callback_info info) {
  napi_status status;
  napi_value jsthis;
  size_t argc = 2;
  napi_value args[2];
  status = napi_get_cb_info(env, info, &argc, args, &jsthis, nullptr);

  NodeIrisRtcEngine* nodeIrisRtcEngine;
  status =
      napi_unwrap(env, jsthis, reinterpret_cast<void**>(&nodeIrisRtcEngine));
  
  //define
  auto engine = nodeIrisRtcEngine->_iris_api_engine;
  auto bufferManager = nodeIrisRtcEngine->_iris_video_frame_buffer_manager;
  auto eventHandler = nodeIrisRtcEngine->_iris_event_handler;
  
  //uncontrol
  engine->Detach(bufferManager.get());
  engine.get()->UnsetIrisRtcEngineEventHandler(eventHandler.get());
  
  //reset
  eventHandler.reset();
  bufferManager.reset();
  engine.reset();
  
  LOG_F(INFO, "NodeIrisRtcEngine::ReleaseEnv");
  napi_value retValue = nullptr;
  return retValue;
}
}  // namespace electron
}  // namespace rtc
}  // namespace agora
