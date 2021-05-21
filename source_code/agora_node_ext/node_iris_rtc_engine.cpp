/*
 * @Author: zhangtao@agora.io
 * @Date: 2021-04-22 20:53:37
 * @Last Modified by: zhangtao@agora.io
 * @Last Modified time: 2021-05-19 21:06:42
 */
#include "node_iris_rtc_engine.h"
#include "node_iris_event_handler.h"

namespace agora {
namespace rtc {
namespace electron {
using namespace iris::rtc;

Nan_Persistent<v8_Function> NodeIrisRtcEngine::_constructor;

NodeIrisRtcEngine::NodeIrisRtcEngine(v8_Isolate *isolate) : _isolate(isolate) {
  _iris_event_handler.reset(new NodeIrisEventHandler(this));
  _iris_engine.reset(new IrisRtcEngine());
  _video_processer.reset(new VideoProcesser(_iris_engine));
  _video_source_proxy.reset(new VideoSourceProxy(_video_processer));
  _iris_raw_data = _iris_engine->raw_data();
  _iris_raw_data_plugin_manager = _iris_raw_data->plugin_manager();
  _iris_engine->SetEventHandler(_iris_event_handler.get());
}

NodeIrisRtcEngine::~NodeIrisRtcEngine() {
  LOG_F(INFO, "NodeIrisRtcEngine::~NodeIrisRtcEngine");
}

void NodeIrisRtcEngine::Init(v8_Local<v8_Object> &_module) {
  auto _isolate = _module->GetIsolate();
  auto _context = _isolate->GetCurrentContext();
  auto _template = v8_FunctionTemplate::New(_isolate, CreateInstance);
  _template->SetClassName(
      Nan::New<v8_String>("NodeIrisRtcEngine").ToLocalChecked());
  _template->InstanceTemplate()->SetInternalFieldCount(5);

  Nan::SetPrototypeMethod(_template, "CallApi", CallApi);
  Nan::SetPrototypeMethod(_template, "CallApiWithBuffer", CallApiWithBuffer);

  Nan::SetPrototypeMethod(_template, "OnEvent", OnEvent);
  Nan::SetPrototypeMethod(_template, "CreateChannel", CreateChannel);
  Nan::SetPrototypeMethod(_template, "GetDeviceManager", GetDeviceManager);
  Nan::SetPrototypeMethod(_template, "GetScreenWindowsInfo",
                          GetScreenWindowsInfo);
  Nan::SetPrototypeMethod(_template, "GetScreenDisplaysInfo",
                          GetScreenDisplaysInfo);

  Nan::SetPrototypeMethod(_template, "EnableVideoFrameCache",
                          EnableVideoFrameCache);
  Nan::SetPrototypeMethod(_template, "DisableVideoFrameCache",
                          DisableVideoFrameCache);
  Nan::SetPrototypeMethod(_template, "GetVideoStreamData", GetVideoStreamData);
  Nan::SetPrototypeMethod(_template, "SetAddonLogFile", SetAddonLogFile);
  Nan::SetPrototypeMethod(_template, "PluginCallApi", PluginCallApi);

  Nan::SetPrototypeMethod(_template, "VideoSourceInitialize",
                          VideoSourceInitialize);
  Nan::SetPrototypeMethod(_template, "VideoSourceRelease", VideoSourceRelease);
  Nan::SetPrototypeMethod(_template, "VideoSourceSetAddonLogFile",
                          VideoSourceSetAddonLogFile);
  Nan::SetPrototypeMethod(_template, "Release", Release);
  _constructor.Reset(_template->GetFunction(_context).ToLocalChecked());
  _module->Set(_context,
               Nan::New<v8_String>("NodeIrisRtcEngine").ToLocalChecked(),
               _template->GetFunction(_context).ToLocalChecked());

  LOG_F(INFO, "Init");
}

void NodeIrisRtcEngine::CreateInstance(
    const v8_FunctionCallbackInfo<v8_Value> &args) {
  auto _isolate = args.GetIsolate();
  if (args.IsConstructCall()) {
    LOG_F(INFO, "CreateInstance");
    auto _iris_engine = new NodeIrisRtcEngine(_isolate);
    _iris_engine->Wrap(args.This());
    args.GetReturnValue().Set(args.This());
  } else {
    LOG_F(INFO, "CreateInstance from js");
    auto cons = v8_Local<v8_Function>::New(_isolate, _constructor);
    auto _context = _isolate->GetCurrentContext();
    auto _instance = cons->NewInstance(_context).ToLocalChecked();
    args.GetReturnValue().Set(_instance);
  }
}

void NodeIrisRtcEngine::CallApi(
    const Nan_FunctionCallbackInfo<v8_Value> &args) {
  auto _engine = ObjectWrap::Unwrap<NodeIrisRtcEngine>(args.Holder());
  auto _isolate = args.GetIsolate();
  auto _process_type = nan_api_get_value_int32_(args[0]);
  auto _apiType = nan_api_get_value_int32_(args[1]);
  auto _parameter = nan_api_get_value_utf8string_(args[2]);
  char _result[512];
  memset(_result, '\0', 512);

  int _ret = ERROR_PARAMETER_1;

  if (_engine->_iris_engine) {
    try {
      if (_process_type == PROCESS_TYPE::MAIN) {
        _ret = _engine->_iris_engine->CallApi((ApiTypeEngine)_apiType,
                                              _parameter.c_str(), _result);
      } else {
        _ret = _engine->_video_source_proxy->CallApi(
            (ApiTypeEngine)_apiType, _parameter.c_str(), _result);
      }
      LOG_F(INFO, "CallApi parameter: type: %d, parameter: %s, ret: %d",
            _process_type, _parameter.c_str(), _ret);
    } catch (std::exception &e) {
      _engine->OnApiError(e.what());
      LOG_F(INFO, "CallApi parameter: catch excepton msg: %s", e.what());
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

void NodeIrisRtcEngine::CallApiWithBuffer(
    const Nan_FunctionCallbackInfo<v8_Value> &args) {
  auto _engine = ObjectWrap::Unwrap<NodeIrisRtcEngine>(args.Holder());
  auto _isolate = args.GetIsolate();
  auto _process_type = nan_api_get_value_int32_(args[0]);
  auto _apiType = nan_api_get_value_int32_(args[1]);
  auto _parameter = nan_api_get_value_utf8string_(args[2]);
  auto _buffer = nan_api_get_value_utf8string_(args[3]);
  auto _length = nan_api_get_value_int32_(args[4]);
  char _result[512];
  int _ret = ERROR_PARAMETER_1;
  memset(_result, '\0', 512);

  if (_engine->_iris_engine) {
    try {
      switch (ApiTypeEngine(_apiType)) {
      case kEngineRegisterPacketObserver: {
        break;
      }
      case kEngineSendStreamMessage: {
        if (_process_type == PROCESS_TYPE::MAIN) {
          _ret = _engine->_iris_engine->CallApi(
              (ApiTypeEngine)_apiType, _parameter.c_str(),
              const_cast<char *>(_buffer.c_str()), _result);
        } else {
          _ret = _engine->_video_source_proxy->CallApi(
              (ApiTypeEngine)_apiType, _parameter.c_str(), _buffer.c_str(),
              _length, _result);
        }
        break;
      }
      case kEngineSendMetadata: {
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
    } catch (std::exception &e) {
      _engine->OnApiError(e.what());
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

void NodeIrisRtcEngine::OnEvent(
    const Nan_FunctionCallbackInfo<v8_Value> &args) {
  auto _engine = ObjectWrap::Unwrap<NodeIrisRtcEngine>(args.Holder());
  auto _parameter = nan_api_get_value_utf8string_(args[0]);
  auto _callback = args[1].As<v8_Function>();
  Nan_Persistent<v8_Function> _persist;
  _persist.Reset(_callback);

  auto _obj = args.This();
  Nan_Persistent<v8_Object> _persistObj;
  _persistObj.Reset(_obj);
  if (_engine->_iris_engine) {
    _engine->_iris_event_handler->addEvent(_parameter, _persistObj, _persist);
  } else {
    LOG_F(INFO, "NodeIrisRtcEngine::OnEvent error Not Init Engine");
  }
}

void NodeIrisRtcEngine::CreateChannel(
    const Nan_FunctionCallbackInfo<v8_Value> &args) {
  LOG_F(INFO, " NodeIrisRtcEngine::CreateChannel");
  auto _engine = ObjectWrap::Unwrap<NodeIrisRtcEngine>(args.Holder());
  auto _isolate = args.GetIsolate();
  auto _process_type = nan_api_get_value_int32_(args[0]);
  auto _channelId = nan_api_get_value_utf8string_(args[1]);
  if (_engine->_iris_engine) {
    auto _iris_channel = _engine->_iris_engine->channel();
    if (_process_type == PROCESS_TYPE::MAIN) {
      auto _js_channel =
          NodeIrisRtcChannel::Init(_isolate, _iris_channel, _channelId.c_str());
      args.GetReturnValue().Set(_js_channel);
    } else {
    }
  } else {
    LOG_F(INFO, "NodeIrisRtcEngine::CreateChannel error Not Init Engine");
  }
}

void NodeIrisRtcEngine::GetDeviceManager(
    const Nan_FunctionCallbackInfo<v8_Value> &args) {
  auto _engine = ObjectWrap::Unwrap<NodeIrisRtcEngine>(args.Holder());
  auto _isolate = args.GetIsolate();

  if (_engine->_iris_engine) {
    auto _device_manager = _engine->_iris_engine->device_manager();
    auto _js_device_manager =
        NodeIrisRtcDeviceManager::Init(_isolate, _device_manager);
    args.GetReturnValue().Set(_js_device_manager);
  } else {
    LOG_F(INFO, "NodeIrisRtcEngine::GetDeviceManager error Not Init Engine");
  }
}

void NodeIrisRtcEngine::GetScreenWindowsInfo(
    const Nan_FunctionCallbackInfo<v8_Value> &args) {
  auto _isolate = args.GetIsolate();
  auto _context = _isolate->GetCurrentContext();

  auto _screenWindowInfoArray = v8_Array::New(_isolate);
  auto _allWindows = getAllWindowInfo();
  for (auto i = 0; i < _allWindows.size(); i++) {
    auto _windowInfo = _allWindows[i];
    auto obj = v8_Object::New(_isolate);
#ifdef _WIN32
    UINT32 windowId = (UINT32)_windowInfo.windowId;
#elif defined(__APPLE__)
    unsigned int windowId = _windowInfo.windowId;
#endif
    v8_SET_OBJECT_PROP_UINT32(_isolate, obj, "windowId", windowId)
        v8_SET_OBJECT_PROP_STRING(_isolate, obj, "name",
                                  _windowInfo.name.c_str())
            v8_SET_OBJECT_PROP_STRING(_isolate, obj, "ownerName",
                                      _windowInfo.ownerName.c_str())
                v8_SET_OBJECT_PROP_BOOL(_isolate, obj, "isOnScreen",
                                        _windowInfo.isOnScreen)
                    v8_SET_OBJECT_PROP_UINT32(_isolate, obj, "width",
                                              _windowInfo.width)
                        v8_SET_OBJECT_PROP_UINT32(_isolate, obj, "height",
                                                  _windowInfo.height)
                            v8_SET_OBJECT_PROP_UINT32(_isolate, obj,
                                                      "originWidth",
                                                      _windowInfo.originWidth)
                                v8_SET_OBJECT_PROP_UINT32(
                                    _isolate, obj, "originHeight",
                                    _windowInfo.originHeight)

                                    if (_windowInfo.imageData) {
      v8_SET_OBJECT_PROP_UINT8_ARRAY(
          _isolate, obj, "image", _windowInfo.imageData,
          _windowInfo.imageDataLength) free(_windowInfo.imageData);
    }
    auto resultObj = _screenWindowInfoArray->Set(_context, i, obj);
    v8_MAYBE_CHECK_RESULT(resultObj);
  }
  args.GetReturnValue().Set(_screenWindowInfoArray);
}

void NodeIrisRtcEngine::GetScreenDisplaysInfo(
    const Nan_FunctionCallbackInfo<v8_Value> &args) {
  auto _isolate = args.GetIsolate();
  auto _context = _isolate->GetCurrentContext();
  auto _allDisplayInfoArray = v8_Array::New(_isolate);
  auto _allDisplays = getAllDisplayInfo();

  for (auto i = 0; i < _allDisplays.size(); i++) {
    auto _displayInfo = _allDisplays[i];
    auto _obj = v8_Object::New(_isolate);
    auto _displayId = _displayInfo.displayId;
    auto _displayIdObj = v8_Object::New(_isolate);
#ifdef _WIN32
    v8_SET_OBJECT_PROP_UINT32(_isolate, _displayIdObj, "x", _displayId.x)
        v8_SET_OBJECT_PROP_UINT32(_isolate, _displayIdObj, "y", _displayId.y)
            v8_SET_OBJECT_PROP_UINT32(_isolate, _displayIdObj, "width",
                                      _displayId.width)
                v8_SET_OBJECT_PROP_UINT32(_isolate, _displayIdObj, "height",
                                          _displayId.height)
#elif defined(__APPLE__)
    v8_SET_OBJECT_PROP_UINT32(_isolate, _displayIdObj, "id", _displayId.idVal)
#endif
                    auto propName =
                        v8_String::NewFromUtf8(_isolate, "displayId",
                                               v8::NewStringType::kInternalized)
                            .ToLocalChecked();
    auto resultObj = _obj->Set(_context, propName, _displayIdObj);
    v8_MAYBE_CHECK_RESULT(resultObj);

    v8_SET_OBJECT_PROP_UINT32(_isolate, _obj, "width", _displayInfo.width)
        v8_SET_OBJECT_PROP_UINT32(_isolate, _obj, "height", _displayInfo.height)
            v8_SET_OBJECT_PROP_BOOL(_isolate, _obj, "isMain",
                                    _displayInfo.isMain)
                v8_SET_OBJECT_PROP_BOOL(_isolate, _obj, "isActive",
                                        _displayInfo.isActive)
                    v8_SET_OBJECT_PROP_BOOL(
                        _isolate, _obj, "isBuiltin",
                        _displayInfo.isBuiltin) if (_displayInfo.imageData) {
      v8_SET_OBJECT_PROP_UINT8_ARRAY(
          _isolate, _obj, "image", _displayInfo.imageData,
          _displayInfo.imageDataLength) free(_displayInfo.imageData);
    }
    auto result = _allDisplayInfoArray->Set(_context, i, _obj);
    v8_MAYBE_CHECK_RESULT(result);
    args.GetReturnValue().Set(_allDisplayInfoArray);
  }
}

void NodeIrisRtcEngine::VideoSourceInitialize(
    const Nan_FunctionCallbackInfo<v8_Value> &args) {
  auto _engine = ObjectWrap::Unwrap<NodeIrisRtcEngine>(args.Holder());
  auto _isolate = args.GetIsolate();
  auto _ret = ERROR_PARAMETER_1;
  if (_engine->_video_source_proxy) {
    if (_engine->_video_source_proxy->Initialize(_engine->_iris_event_handler))
      _ret = ERROR_OK;
  } else {
    _ret = ERROR_NOT_INIT;
    LOG_F(INFO, "VideoSourceInitialize NodeIris Engine Not Init");
  }

  auto _retObj = v8_Object::New(_isolate);
  v8_SET_OBJECT_PROP_INT32(_isolate, _retObj, "retCode", _ret)
      v8_SET_OBJECT_PROP_STRING(_isolate, _retObj, "result", "")
          args.GetReturnValue()
              .Set(_retObj);
}

void NodeIrisRtcEngine::VideoSourceSetAddonLogFile(
    const Nan_FunctionCallbackInfo<v8_Value> &args) {
  auto _engine = ObjectWrap::Unwrap<NodeIrisRtcEngine>(args.Holder());
  auto _isolate = args.GetIsolate();
  auto _parameter = nan_api_get_value_utf8string_(args[0]);
  auto _ret = ERROR_PARAMETER_1;
  if (_engine->_video_source_proxy) {
    if (_engine->_video_source_proxy->SetAddonLogFile(_parameter.c_str()))
      _ret = ERROR_OK;
  } else {
    _ret = ERROR_NOT_INIT;
    LOG_F(INFO, "VideoSourceSetAddonLogFile NodeIris Engine Not Init");
  }

  auto _retObj = v8_Object::New(_isolate);
  v8_SET_OBJECT_PROP_INT32(_isolate, _retObj, "retCode", _ret)
      v8_SET_OBJECT_PROP_STRING(_isolate, _retObj, "result", "")
          args.GetReturnValue()
              .Set(_retObj);
}

void NodeIrisRtcEngine::VideoSourceRelease(
    const Nan_FunctionCallbackInfo<v8_Value> &args) {
  auto _engine = ObjectWrap::Unwrap<NodeIrisRtcEngine>(args.Holder());
  auto _isolate = args.GetIsolate();
  int _ret = ERROR_PARAMETER_1;
  if (_engine->_video_source_proxy) {
    _ret = _engine->VideoSourceRelease();
  } else {
    _ret = ERROR_NOT_INIT;
    LOG_F(INFO, "VideoSourceInitialize NodeIris Engine Not Init");
  }

  auto _retObj = v8_Object::New(_isolate);
  v8_SET_OBJECT_PROP_INT32(_isolate, _retObj, "retCode", _ret)
      v8_SET_OBJECT_PROP_STRING(_isolate, _retObj, "result", "")
          args.GetReturnValue()
              .Set(_retObj);
}

int NodeIrisRtcEngine::VideoSourceRelease() {
  LOG_F(INFO, "VideoSourceRelease");
  if (_video_source_proxy.get()) {
    _video_source_proxy->Release();
  }
  return ERROR_OK;
}

void NodeIrisRtcEngine::SetAddonLogFile(
    const Nan_FunctionCallbackInfo<v8_Value> &args) {
  auto _isolate = args.GetIsolate();
  auto _process_type = nan_api_get_value_int32_(args[0]);
  auto _filePath = nan_api_get_value_utf8string_(args[1]);
  int _ret = ERROR_PARAMETER_1;
  if (_process_type == PROCESS_TYPE::MAIN) {
    _ret = startLogService(_filePath.c_str());
  } else {
  }
  auto _result = ERROR_CODE::ERROR_OK;
  auto _retObj = v8_Object::New(_isolate);
  v8_SET_OBJECT_PROP_BOOL(_isolate, _retObj, "retCode", _ret)
      v8_SET_OBJECT_PROP_INT32(_isolate, _retObj, "result", _result)
          args.GetReturnValue()
              .Set(_retObj);
}

void NodeIrisRtcEngine::OnApiError(const char *errorMessage) {
  _iris_event_handler->OnEvent("apiError", errorMessage);
}

void NodeIrisRtcEngine::PluginCallApi(
    const Nan_FunctionCallbackInfo<v8_Value> &args) {
  auto _engine = ObjectWrap::Unwrap<NodeIrisRtcEngine>(args.Holder());
  auto _isolate = args.GetIsolate();
  auto _process_type = nan_api_get_value_int32_(args[0]);
  auto _apiType = nan_api_get_value_int32_(args[1]);
  auto _parameter = nan_api_get_value_utf8string_(args[2]);
  char _result[512];
  memset(_result, '\0', 512);
  LOG_F(INFO, "CallApi parameter: %s", _parameter.c_str());
  int _ret = ERROR_PARAMETER_1;

  if (_engine->_iris_engine) {
    try {
      if (_process_type == PROCESS_TYPE::MAIN) {
        _ret = _engine->_iris_raw_data_plugin_manager->CallApi(
            (ApiTypeRawDataPlugin)_apiType, _parameter.c_str(), _result);
      } else {
        _ret = _engine->_video_source_proxy->PluginCallApi(
            (ApiTypeRawDataPlugin)_apiType, _parameter.c_str(), _result);
      }
    } catch (std::exception &e) {
      LOG_F(INFO, "PluginCallApi catch exception %s", e.what());
      _engine->OnApiError(e.what());
    }
  } else {
    _ret = ERROR_NOT_INIT;
    LOG_F(INFO, "VideoSourceInitialize NodeIris Engine Not Init");
  }

  auto _retObj = v8_Object::New(_isolate);
  v8_SET_OBJECT_PROP_UINT32(_isolate, _retObj, "retCode", _ret)
      v8_SET_OBJECT_PROP_STRING(_isolate, _retObj, "result", _result)
          args.GetReturnValue()
              .Set(_retObj);
}

void NodeIrisRtcEngine::EnableVideoFrameCache(
    const Nan_FunctionCallbackInfo<v8_Value> &args) {
  auto _engine = ObjectWrap::Unwrap<NodeIrisRtcEngine>(args.Holder());
  auto _isolate = args.GetIsolate();
  auto _process_type = nan_api_get_value_int32_(args[0]);
  v8_Local<v8_Object> _obj = nan_api_get_value_object_(_isolate, args[1]);
  auto _uid = nan_api_get_object_uint32_(_isolate, _obj, "uid");
  auto _channelId = nan_api_get_object_utf8string_(_isolate, _obj, "channelId");
  auto _width = nan_api_get_object_int32_(_isolate, _obj, "width");
  auto _height = nan_api_get_object_int32_(_isolate, _obj, "height");

  int _ret = ERROR_PARAMETER_1;

  if (_engine->_iris_engine) {
    IrisRtcRendererCacheConfig config(
        IrisRtcVideoFrameObserver::VideoFrameType::kFrameTypeYUV420, nullptr,
        _width, _height);
    try {
      if (_process_type == PROCESS_TYPE::MAIN) {
        _ret = _engine->_video_processer->EnableVideoFrameCache(
            config, _uid, _channelId.c_str());
      } else {
        _ret = _engine->_video_source_proxy->EnableVideoFrameCache(
            _channelId.c_str(), _uid, _width, _height);
      }
    } catch (std::exception &e) {
      LOG_F(INFO, "PluginCallApi catch exception %s", e.what());
      _engine->OnApiError(e.what());
    }
  } else {
    _ret = ERROR_NOT_INIT;
    LOG_F(INFO, "VideoSourceInitialize NodeIris Engine Not Init");
  }

  auto _retObj = v8_Object::New(_isolate);
  v8_SET_OBJECT_PROP_UINT32(_isolate, _retObj, "retCode", _ret)
      v8_SET_OBJECT_PROP_STRING(_isolate, _retObj, "result", "")
          args.GetReturnValue()
              .Set(_retObj);
}

void NodeIrisRtcEngine::DisableVideoFrameCache(
    const Nan_FunctionCallbackInfo<v8_Value> &args) {
  auto _engine = ObjectWrap::Unwrap<NodeIrisRtcEngine>(args.Holder());
  auto _isolate = args.GetIsolate();
  auto _process_type = nan_api_get_value_int32_(args[0]);
  auto _obj = nan_api_get_value_object_(_isolate, args[1]);
  auto _uid = nan_api_get_object_uint32_(_isolate, _obj, "uid");
  auto _channelId = nan_api_get_object_utf8string_(_isolate, _obj, "channelId");

  int _ret = ERROR_PARAMETER_1;

  if (_engine->_iris_engine) {
    try {
      if (_process_type == PROCESS_TYPE::MAIN) {
        _ret = _engine->_video_processer->DisableVideoFrameCache(
            _channelId.c_str(), _uid);
      } else {
        _ret = _engine->_video_source_proxy->DisableVideoFrameCache(
            _channelId.c_str(), _uid);
      }
    } catch (std::exception &e) {
      _engine->OnApiError(e.what());
    }
  } else {
    _ret = ERROR_NOT_INIT;
    LOG_F(INFO, "VideoSourceInitialize NodeIris Engine Not Init");
  }

  auto _retObj = v8_Object::New(_isolate);
  v8_SET_OBJECT_PROP_UINT32(_isolate, _retObj, "retCode", _ret)
      v8_SET_OBJECT_PROP_STRING(_isolate, _retObj, "result", "")
          args.GetReturnValue()
              .Set(_retObj);
}

void NodeIrisRtcEngine::GetVideoStreamData(
    const Nan_FunctionCallbackInfo<v8_Value> &args) {
  auto _engine = ObjectWrap::Unwrap<NodeIrisRtcEngine>(args.Holder());
  auto _isolate = args.GetIsolate();

  auto _process_type = nan_api_get_value_int32_(args[0]);
  auto _videoStreamObj = nan_api_get_value_object_(_isolate, args[1]);
  auto _uid = nan_api_get_object_uint32_(_isolate, _videoStreamObj, "uid");
  auto _channelId =
      nan_api_get_object_utf8string_(_isolate, _videoStreamObj, "channelId");
  auto _yBufferVal =
      nan_api_get_object_property_value_(_isolate, _videoStreamObj, "yBuffer");
  auto _uBufferVal =
      nan_api_get_object_property_value_(_isolate, _videoStreamObj, "uBuffer");
  auto _vBufferVal =
      nan_api_get_object_property_value_(_isolate, _videoStreamObj, "vBuffer");
  auto _height =
      nan_api_get_object_uint32_(_isolate, _videoStreamObj, "height");
  auto _yStride =
      nan_api_get_object_uint32_(_isolate, _videoStreamObj, "yStride");
  auto _yBuffer = node::Buffer::Data(_yBufferVal);
  auto _uBuffer = node::Buffer::Data(_uBufferVal);
  auto _vBuffer = node::Buffer::Data(_vBufferVal);
  IrisRtcVideoFrameObserver::VideoFrame _videoFrame;
  _videoFrame.y_buffer = _yBuffer;
  _videoFrame.u_buffer = _uBuffer;
  _videoFrame.v_buffer = _vBuffer;
  _videoFrame.height = _height;
  _videoFrame.y_stride = _yStride;

  bool isFresh = false;
  bool ret = false;

  if (_engine->_iris_engine) {
    try {
      if (_process_type == PROCESS_TYPE::MAIN) {
        ret = _engine->_video_processer->GetVideoFrame(
            _videoFrame, isFresh, _uid, _channelId.c_str());
      } else {
        ret = _engine->_video_processer->VideoSourceGetVideoFrame(
            _videoFrame, isFresh, _uid, _channelId.c_str());
      }
    } catch (std::exception &e) {
      _engine->OnApiError(e.what());
    }
  } else {
    ret = false;
    LOG_F(INFO, "VideoSourceInitialize NodeIris Engine Not Init");
  }
  auto _retObj = v8_Object::New(_isolate);
  v8_SET_OBJECT_PROP_BOOL(_isolate, _retObj, "ret", ret);
  v8_SET_OBJECT_PROP_BOOL(_isolate, _retObj, "isNewFrame", isFresh);
  v8_SET_OBJECT_PROP_UINT32(_isolate, _retObj, "width", _videoFrame.width);
  v8_SET_OBJECT_PROP_UINT32(_isolate, _retObj, "height", _videoFrame.height);
  v8_SET_OBJECT_PROP_UINT32(_isolate, _retObj, "yStride", _videoFrame.y_stride);
  v8_SET_OBJECT_PROP_UINT32(_isolate, _retObj, "rotation", 0);
  v8_SET_OBJECT_PROP_UINT32(_isolate, _retObj, "timestamp",
                            _videoFrame.render_time_ms);
  args.GetReturnValue().Set(_retObj);
}

void NodeIrisRtcEngine::Release(
    const Nan_FunctionCallbackInfo<v8_Value> &args) {
  auto _engine = ObjectWrap::Unwrap<NodeIrisRtcEngine>(args.Holder());
  if (_engine->_iris_engine) {
    _engine->_video_processer.reset();
    _engine->_iris_event_handler.reset();
    _engine->_iris_raw_data_plugin_manager = nullptr;
    _engine->_iris_raw_data = nullptr;
    _engine->_iris_engine.reset();
    _engine->_video_source_proxy.reset();
    LOG_F(INFO, "NodeIrisRtcEngine::Release done");
  } else {
    LOG_F(INFO, "VideoSourceInitialize NodeIris Engine Not Init");
  }
}

} // namespace electron
} // namespace rtc
} // namespace agora