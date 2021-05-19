/*
 * @Author: zhangtao@agora.io
 * @Date: 2021-04-22 20:53:29
 * @Last Modified by: zhangtao@agora.io
 * @Last Modified time: 2021-05-10 21:24:56
 */
#include "node_iris_rtc_device_manager.h"

namespace agora {
namespace rtc {
namespace electron {
using namespace iris::rtc;

Nan_Persistent<v8_Function> NodeIrisRtcDeviceManager::_constructor;

NodeIrisRtcDeviceManager::NodeIrisRtcDeviceManager(
    v8_Isolate *isolate, IrisRtcDeviceManager *deviceManager)
    : _isolate(isolate), _deviceManager(deviceManager) {
  node::AddEnvironmentCleanupHook(isolate, ReleaseNodeSource, this);
}

NodeIrisRtcDeviceManager::~NodeIrisRtcDeviceManager() {
  _deviceManager = nullptr;
  _isolate = nullptr;
}

v8_Local<v8_Object>
NodeIrisRtcDeviceManager::Init(v8_Isolate *isolate,
                               IrisRtcDeviceManager *deviceManager) {
  auto _context = isolate->GetCurrentContext();
  auto _template = v8_FunctionTemplate::New(isolate, CreateInstance);
  _template->SetClassName(
      Nan::New<v8_String>("NodeIrisRtcDeviceManager").ToLocalChecked());
  _template->InstanceTemplate()->SetInternalFieldCount(5);

  Nan::SetPrototypeMethod(_template, "CallApiAudioDevice", CallApiAudioDevice);
  Nan::SetPrototypeMethod(_template, "CallApiVideoDevice", CallApiVideoDevice);
  Nan::SetPrototypeMethod(_template, "Release", Release);
  _constructor.Reset(_template->GetFunction(_context).ToLocalChecked());

  auto cons = _template->GetFunction(_context).ToLocalChecked();
  auto argDeviceManager = v8_Local<v8_External>::New(
      isolate, v8_External::New(isolate, deviceManager));
  v8_Local<v8_Value> argv[1] = {argDeviceManager};
  auto jsDeviceManager = cons->NewInstance(_context, 1, argv).ToLocalChecked();
  return jsDeviceManager;
}

void NodeIrisRtcDeviceManager::CreateInstance(
    const v8_FunctionCallbackInfo<v8_Value> &args) {
  auto *_isolate = args.GetIsolate();
  auto _argDeviceManager = v8_Local<v8_External>::Cast(args[0]);
  auto *_irisDeviceManager =
      static_cast<IrisRtcDeviceManager *>(_argDeviceManager->Value());
  auto *_deviceManager =
      new NodeIrisRtcDeviceManager(_isolate, _irisDeviceManager);
  _deviceManager->Wrap(args.This());
  args.GetReturnValue().Set(args.This());
}

void NodeIrisRtcDeviceManager::CallApiAudioDevice(
    const Nan_FunctionCallbackInfo<v8_Value> &args) {
  auto _deviceManager =
      ObjectWrap::Unwrap<NodeIrisRtcDeviceManager>(args.Holder());
  auto _isolate = args.GetIsolate();
  auto _apiType = nan_api_get_value_int32_(args[0]);
  auto _parameter = nan_api_get_value_utf8string_(args[1]);
  char _result[512];
  memset(_result, '\0', 512);

  int _ret = ERROR_PARAMETER_1;

  if (_deviceManager->_deviceManager) {
    _ret = _deviceManager->_deviceManager->CallApi(
        (ApiTypeAudioDeviceManager)_apiType, _parameter.c_str(), _result);
  } else {
    _ret = ERROR_NOT_INIT;
  }

  auto _retObj = v8_Object::New(_isolate);
  v8_SET_OBJECT_PROP_UINT32(_isolate, _retObj, "retCode", _ret)
      v8_SET_OBJECT_PROP_STRING(_isolate, _retObj, "result", _result)
          args.GetReturnValue()
              .Set(_retObj);
}

void NodeIrisRtcDeviceManager::CallApiVideoDevice(
    const Nan_FunctionCallbackInfo<v8_Value> &args) {
  auto _deviceManager =
      ObjectWrap::Unwrap<NodeIrisRtcDeviceManager>(args.Holder());
  auto _isolate = args.GetIsolate();
  auto _apiType = nan_api_get_value_int32_(args[0]);
  auto _parameter = nan_api_get_value_utf8string_(args[1]);
  char _result[512];
  memset(_result, '\0', 512);
  int _ret = ERROR_PARAMETER_1;

  if (_deviceManager->_deviceManager) {
    _ret = _deviceManager->_deviceManager->CallApi(
        (ApiTypeVideoDeviceManager)_apiType, _parameter.c_str(), _result);
  } else {
    _ret = ERROR_NOT_INIT;
  }

  auto _retObj = v8_Object::New(_isolate);
  v8_SET_OBJECT_PROP_UINT32(_isolate, _retObj, "retCode", _ret)
      v8_SET_OBJECT_PROP_STRING(_isolate, _retObj, "result", _result)
          args.GetReturnValue()
              .Set(_retObj);
}

void NodeIrisRtcDeviceManager::Release(
    const Nan_FunctionCallbackInfo<v8_Value> &args) {
  auto _deviceManager =
      ObjectWrap::Unwrap<NodeIrisRtcDeviceManager>(args.Holder());
  _deviceManager->_deviceManager = nullptr;
}

void NodeIrisRtcDeviceManager::ReleaseNodeSource(void *selfPtr) {
  auto _selfPtr = static_cast<NodeIrisRtcDeviceManager *>(selfPtr);
  delete _selfPtr;
  _selfPtr = nullptr;
}
} // namespace electron
} // namespace rtc
} // namespace agora