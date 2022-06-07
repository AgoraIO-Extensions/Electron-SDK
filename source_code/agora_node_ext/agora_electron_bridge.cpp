/*
 * @Author: zhangtao@agora.io
 * @Date: 2021-04-22 20:53:37
 * @Last Modified by: zhangtao@agora.io
 * @Last Modified time: 2022-06-07 21:28:37
 */
#include "agora_electron_bridge.h"
#include <memory>
#include "iris_base.h"
#include "node_iris_event_handler.h"

namespace agora {
namespace rtc {
namespace electron {
using namespace iris::rtc;
using namespace agora::iris::rtc;
const char* AgoraElectronBridge::_class_name = "AgoraElectronBridge";
const char* AgoraElectronBridge::_ret_code_str = "callApiReturnCode";
const char* AgoraElectronBridge::_ret_result_str = "callApiResult";
napi_ref* AgoraElectronBridge::_ref_construcotr_ptr = nullptr;

AgoraElectronBridge::AgoraElectronBridge() {
  LOG_F(INFO, "AgoraElectronBridge::AgoraElectronBridge()");
}

AgoraElectronBridge::~AgoraElectronBridge() {
  LOG_F(INFO, "AgoraElectronBridge::~AgoraElectronBridge");
  Release();
}

napi_value AgoraElectronBridge::Init(napi_env env, napi_value exports) {
  LOG_F(INFO, "AgoraElectronBridge::Init()");
  napi_status status = napi_ok;
  napi_property_descriptor properties[] = {
      DECLARE_NAPI_METHOD("CallApi", CallApi),
      DECLARE_NAPI_METHOD("OnEvent", OnEvent),
      DECLARE_NAPI_METHOD("GetBuffer", GetBuffer),
      DECLARE_NAPI_METHOD("EnableVideoFrameCache", EnableVideoFrameCache),
      DECLARE_NAPI_METHOD("DisableVideoFrameCache", DisableVideoFrameCache),
      DECLARE_NAPI_METHOD("GetVideoStreamData", GetVideoStreamData),
      DECLARE_NAPI_METHOD("SetAddonLogFile", SetAddonLogFile),
      DECLARE_NAPI_METHOD("InitializeEnv", InitializeEnv),
      DECLARE_NAPI_METHOD("ReleaseEnv", ReleaseEnv)};

  napi_value cons;
  
  // method count !!!
  status = napi_define_class(env, _class_name, NAPI_AUTO_LENGTH, New, nullptr,
                             9, properties, &cons);
  assert(status == napi_ok);

  AgoraElectronBridge::_ref_construcotr_ptr = new napi_ref();
  status = napi_create_reference(env, cons, 1,
                                 AgoraElectronBridge::_ref_construcotr_ptr);

  assert(status == napi_ok);
  status = napi_set_named_property(env, exports, _class_name, cons);
  assert(status == napi_ok);
  return exports;
}

napi_value AgoraElectronBridge::New(napi_env env, napi_callback_info info) {
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

    auto irisEngine = new AgoraElectronBridge();
    irisEngine->_env = env;
    status =
        napi_wrap(env, jsthis, reinterpret_cast<void*>(irisEngine),
                  AgoraElectronBridge::Destructor, nullptr, &irisEngine->_ref);
    assert(status == napi_ok);
    return jsthis;
  } else {
    napi_value instance;
    status = napi_new_instance(env, Constructor(env), 0, nullptr, &instance);
    assert(status == napi_ok);
    return instance;
  }
}

napi_value AgoraElectronBridge::Constructor(napi_env env) {
  void* instance = nullptr;
  napi_value cons;
  napi_status status;
  status = napi_get_reference_value(
      env, *AgoraElectronBridge::_ref_construcotr_ptr, &cons);
  assert(status == napi_ok);
  return cons;
}

void AgoraElectronBridge::Destructor(napi_env env,
                                     void* nativeObject,
                                     void* finalize_hint) {
  reinterpret_cast<AgoraElectronBridge*>(nativeObject)->~AgoraElectronBridge();
  LOG_F(INFO, "AgoraElectronBridge::Destructor()");
}

napi_value AgoraElectronBridge::CallApi(napi_env env, napi_callback_info info) {
  napi_status status;
  size_t argc = 4;
  napi_value args[4];
  napi_value jsthis;
  status = napi_get_cb_info(env, info, &argc, args, &jsthis, nullptr);
  assert(status == napi_ok);

  AgoraElectronBridge* agoraElectronBridge;
  status =
      napi_unwrap(env, jsthis, reinterpret_cast<void**>(&agoraElectronBridge));

  std::string funcName = "";
  std::string parameter = "";
  uint32_t bufferCount = 0;

  status = napi_get_value_utf8string(env, args[0], funcName);
  status = napi_get_value_utf8string(env, args[1], parameter);
  status = napi_get_value_uint32(env, args[3], &bufferCount);

  if (strcmp(parameter.c_str(), "") == 0) {
    parameter = "{}";
  }

  memset(agoraElectronBridge->_result, '\0', kBasicResultLength);

  int ret = ERROR_PARAMETER_1;
  std::shared_ptr<IrisApiEngine> irisApiEngine =
      agoraElectronBridge->_iris_api_engine;

  if (irisApiEngine) {
    try {
      if (bufferCount > 0) {
        std::vector<void*> data;
        data.resize(bufferCount);
        bool result = false;
        napi_is_array(env, args[2], &result);
        assert(result == true);

        std::vector<napi_value> itemVec;
        itemVec.reserve(bufferCount);
        for (int i = 0; i < bufferCount; i++) {
          napi_get_element(env, args[2], i, &itemVec[i]);
          napi_get_typedarray_info(env, itemVec[i], nullptr, nullptr, &data[i],
                                   nullptr, nullptr);
        }

        ret = irisApiEngine->CallIrisApi(
            funcName.c_str(), parameter.c_str(), parameter.length(),
            data.data(), bufferCount, agoraElectronBridge->_result);

      } else {
        ret = irisApiEngine->CallIrisApi(funcName.c_str(), parameter.c_str(),
                                         parameter.length(), nullptr, 0,
                                         agoraElectronBridge->_result);
      }
    } catch (std::exception& e) {
      agoraElectronBridge->OnApiError(e.what());
      LOG_F(INFO, "CallApi(func name:%s) parameter: catch excepton msg: %s",
            funcName.c_str(), e.what());
    }
  } else {
    LOG_F(INFO, "CallApi(func name:%s) fail, not init engine",
          funcName.c_str());
    ret = ERROR_NOT_INIT;
  }
  RETURE_NAPI_OBJ();
}

napi_value AgoraElectronBridge::GetBuffer(napi_env env,
                                          napi_callback_info info) {
  napi_status status;
  size_t argc = 2;
  napi_value args[2];
  napi_value jsthis;
  status = napi_get_cb_info(env, info, &argc, args, &jsthis, nullptr);
  assert(status == napi_ok);

  long long bufferPtr;
  int bufferSize;

  status = napi_get_value_int64(env, args[0], &bufferPtr);
  status = napi_get_value_int32(env, args[1], &bufferSize);

  napi_value value;
  napi_create_buffer_copy(env, bufferSize, (const void*)bufferPtr, nullptr,
                          &value);

  return value;
}

napi_value AgoraElectronBridge::OnEvent(napi_env env, napi_callback_info info) {
  napi_status status;
  size_t argc = 3;
  napi_value args[3];
  napi_value jsthis;
  int ret = ERROR_PARAMETER_1;
  status = napi_get_cb_info(env, info, &argc, args, &jsthis, nullptr);

  assert(status == napi_ok);

  AgoraElectronBridge* agoraElectronBridge;
  status =
      napi_unwrap(env, jsthis, reinterpret_cast<void**>(&agoraElectronBridge));
  assert(status == napi_ok);
  uint32_t callBackModule = CallBackModule::RTC;
  status = napi_get_value_uint32(env, args[0], &callBackModule);

  std::string eventName = "";
  status = napi_get_value_utf8string(env, args[1], eventName);
  assert(status == napi_ok);
  napi_value cb = args[2];

  napi_value global;
  status = napi_get_global(env, &global);
  assert(status == napi_ok);
  if (agoraElectronBridge->_iris_api_engine) {
    if (callBackModule == CallBackModule::RTC)
      agoraElectronBridge->_iris_rtc_event_handler->addEvent(eventName, env, cb,
                                                             global);
    else if (callBackModule == CallBackModule::MPK)
      agoraElectronBridge->_iris_mpk_event_handler->addEvent(eventName, env, cb,
                                                             global);

    ret = ERROR_OK;
  } else {
    ret = ERROR_NOT_INIT;
    LOG_F(INFO, "AgoraElectronBridge::OnEvent error Not Init Engine");
  }

  char result[1];
  RETURE_NAPI_OBJ();
}

napi_value AgoraElectronBridge::SetAddonLogFile(napi_env env,
                                                napi_callback_info info) {
  napi_status status;
  napi_value jsthis;
  size_t argc = 2;
  napi_value args[2];
  status = napi_get_cb_info(env, info, &argc, args, &jsthis, nullptr);

  AgoraElectronBridge* agoraElectronBridge;
  status =
      napi_unwrap(env, jsthis, reinterpret_cast<void**>(&agoraElectronBridge));

  std::string file_path = "";
  status = napi_get_value_utf8string(env, args[0], file_path);

  char result[kBasicStringLength];
  int ret = ERROR_PARAMETER_1;
  memset(result, '\0', kBasicStringLength);

  ret = startLogService(file_path.c_str());
  RETURE_NAPI_OBJ();
}

void AgoraElectronBridge::OnApiError(const char* errorMessage) {
  _iris_rtc_event_handler->OnEvent("onApiError", errorMessage, nullptr, nullptr,
                                   0);
}

napi_value AgoraElectronBridge::EnableVideoFrameCache(napi_env env,
                                                      napi_callback_info info) {
  napi_status status;
  napi_value jsthis;
  size_t argc = 1;
  napi_value args[1];
  status = napi_get_cb_info(env, info, &argc, args, &jsthis, nullptr);

  AgoraElectronBridge* agoraElectronBridge;
  status =
      napi_unwrap(env, jsthis, reinterpret_cast<void**>(&agoraElectronBridge));

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

  if (!agoraElectronBridge->_iris_video_frame_buffer_manager) {
    ret = ERROR_NOT_INIT;
    LOG_F(INFO, "IrisVideoFrameBufferManager Not Init");
  } else {
    try {
      iris::IrisVideoFrameBuffer buffer(
          IrisVideoFrameType::kVideoFrameTypeYUV420);
      agoraElectronBridge->_iris_video_frame_buffer_manager
          ->EnableVideoFrameBuffer(buffer, &config);
      ret = ERROR_OK;
    } catch (std::exception& e) {
      LOG_F(INFO, "EnableVideoFrameCache catch exception %s", e.what());
      agoraElectronBridge->OnApiError(e.what());
    }
  }

  RETURE_NAPI_OBJ();
}

napi_value AgoraElectronBridge::DisableVideoFrameCache(
    napi_env env,
    napi_callback_info info) {
  napi_status status;
  napi_value jsthis;
  size_t argc = 1;
  napi_value args[1];
  status = napi_get_cb_info(env, info, &argc, args, &jsthis, nullptr);

  AgoraElectronBridge* agoraElectronBridge;
  status =
      napi_unwrap(env, jsthis, reinterpret_cast<void**>(&agoraElectronBridge));

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

  if (!agoraElectronBridge->_iris_video_frame_buffer_manager) {
    ret = ERROR_NOT_INIT;
    LOG_F(INFO, "IrisVideoFrameBufferManager Not Init");
  } else {
    try {
      agoraElectronBridge->_iris_video_frame_buffer_manager
          ->DisableVideoFrameBuffer(&config);
      ret = ERROR_OK;
    } catch (std::exception& e) {
      LOG_F(INFO, "DisableVideoFrameCache catch exception %s", e.what());
      agoraElectronBridge->OnApiError(e.what());
    }
  }

  RETURE_NAPI_OBJ();
}

napi_value AgoraElectronBridge::GetVideoStreamData(napi_env env,
                                                   napi_callback_info info) {
  napi_status status;
  napi_value jsthis;
  size_t argc = 1;
  napi_value args[1];
  status = napi_get_cb_info(env, info, &argc, args, &jsthis, nullptr);

  AgoraElectronBridge* agoraElectronBridge;
  status =
      napi_unwrap(env, jsthis, reinterpret_cast<void**>(&agoraElectronBridge));
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
  napi_value retObj;
  int32_t ret = ERROR_NOT_INIT;
  status = napi_create_object(env, &retObj);

  if (!agoraElectronBridge->_iris_video_frame_buffer_manager.get()) {
    napi_obj_set_property(env, retObj, "ret", ret);
    LOG_F(INFO, "IrisVideoFrameBufferManager Not Init");
    return retObj;
  }

  ret = agoraElectronBridge->_iris_video_frame_buffer_manager->GetVideoFrame(
      videoFrame, isFresh, &config);

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

napi_value AgoraElectronBridge::InitializeEnv(napi_env env,
                                              napi_callback_info info) {
  napi_status status;
  napi_value jsthis;
  size_t argc = 2;
  napi_value args[2];
  status = napi_get_cb_info(env, info, &argc, args, &jsthis, nullptr);

  AgoraElectronBridge* agoraElectronBridge;
  status =
      napi_unwrap(env, jsthis, reinterpret_cast<void**>(&agoraElectronBridge));

  // create
  auto engine = std::make_shared<IrisApiEngine>();
  auto bufferManager = std::make_shared<iris::IrisVideoFrameBufferManager>();
  auto rtcEventHandler = std::make_shared<NodeIrisEventHandler>();
  auto mpkEventHandler = std::make_shared<NodeIrisEventHandler>();

  // combine
  engine->SetIrisRtcEngineEventHandler(rtcEventHandler.get());
  engine->SetIrisMediaPlayerEventHandler(mpkEventHandler.get());
  engine->Attach(bufferManager.get());

  // assign
  agoraElectronBridge->_iris_api_engine = engine;
  agoraElectronBridge->_iris_video_frame_buffer_manager = bufferManager;
  agoraElectronBridge->_iris_rtc_event_handler = rtcEventHandler;
  agoraElectronBridge->_iris_mpk_event_handler = mpkEventHandler;

  LOG_F(INFO, "AgoraElectronBridge::InitializeEnv");
  napi_value retValue = nullptr;
  return retValue;
}

napi_value AgoraElectronBridge::ReleaseEnv(napi_env env,
                                           napi_callback_info info) {
  napi_status status;
  napi_value jsthis;
  size_t argc = 2;
  napi_value args[2];
  status = napi_get_cb_info(env, info, &argc, args, &jsthis, nullptr);

  AgoraElectronBridge* agoraElectronBridge;
  status =
      napi_unwrap(env, jsthis, reinterpret_cast<void**>(&agoraElectronBridge));

  agoraElectronBridge->Release();
  LOG_F(INFO, "AgoraElectronBridge::ReleaseEnv");
  napi_value retValue = nullptr;
  return retValue;
}

void AgoraElectronBridge::Release() {
  LOG_F(INFO, "AgoraElectronBridge::Release()");

  if (_iris_api_engine) {
    LOG_F(INFO, "AgoraElectronBridge::Release() reset rtcEngine");
    // uncontrol
    _iris_api_engine->Detach(_iris_video_frame_buffer_manager.get());
    _iris_api_engine->UnsetIrisRtcEngineEventHandler(
        _iris_rtc_event_handler.get());
    _iris_api_engine->UnsetIrisMediaPlayerEventHandler(
        _iris_mpk_event_handler.get());

    // reset
    _iris_rtc_event_handler.reset();
    _iris_mpk_event_handler.reset();
    _iris_video_frame_buffer_manager.reset();
    _iris_api_engine.reset();
    LOG_F(INFO, "AgoraElectronBridge::Release");
  }
}
}  // namespace electron
}  // namespace rtc
}  // namespace agora
