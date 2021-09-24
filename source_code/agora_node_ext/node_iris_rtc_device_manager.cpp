/*
 * @Author: zhangtao@agora.io
 * @Date: 2021-04-22 20:53:29
 * @Last Modified by: zhangtao@agora.io
 * @Last Modified time: 2021-05-10 21:24:56
 */
#include "node_iris_rtc_device_manager.h"
#include <assert.h>
#include "node_api_header.h"

namespace agora {
namespace rtc {
namespace electron {
using namespace iris::rtc;
const char* NodeIrisRtcDeviceManager::_class_name = "NodeIrisRtcDeviceManager";
const char* NodeIrisRtcDeviceManager::_ret_code_str = "retCode";
const char* NodeIrisRtcDeviceManager::_ret_result_str = "result";
NodeIrisRtcDeviceManager::NodeIrisRtcDeviceManager(
                                                   napi_env env,
                                                   IrisRtcDeviceManager* deviceManager)
: _env(env), _deviceManager(deviceManager) {
    napi_add_env_cleanup_hook(env, ReleaseNodeSource, this);
}

NodeIrisRtcDeviceManager::~NodeIrisRtcDeviceManager() {
    _deviceManager = nullptr;
    _env = nullptr;
}

napi_value NodeIrisRtcDeviceManager::New(napi_env env, napi_callback_info info) {
    napi_status status;
    napi_value target;
    status = napi_get_new_target(env, info, &target);
    assert(status == napi_ok);
    bool is_constructor = target != nullptr;
    
    if (is_constructor) {
        napi_value jsthis;
        status = napi_get_cb_info(env, info, nullptr, nullptr, &jsthis, nullptr);
        assert(status == napi_ok);
        
        auto deviceManager = new NodeIrisRtcDeviceManager(env, staticDeviceManager);
        deviceManager->_env = env;
        status =
        napi_wrap(env, jsthis, reinterpret_cast<void*>(deviceManager),
                  NodeIrisRtcDeviceManager::Destructor, nullptr, &deviceManager->_ref);
        assert(status == napi_ok);
    } else {
        napi_value instance;
        status = napi_new_instance(env, Constructor(env), 0, nullptr, &instance);
        assert(status == napi_ok);
        return instance;
    }
}

napi_value NodeIrisRtcDeviceManager::Constructor(napi_env env) {
    void* instance = nullptr;
    napi_status status = napi_get_instance_data(env, &instance);
    assert(status == napi_ok);
    napi_ref* constructor = static_cast<napi_ref*>(instance);
    
    napi_value cons;
    status = napi_get_reference_value(env, *constructor, &cons);
    assert(status == napi_ok);
    return cons;
}


void NodeIrisRtcDeviceManager::Destructor(napi_env env,
                                          void* nativeObject,
                                          void* finalize_hint) {
    reinterpret_cast<NodeIrisRtcDeviceManager*>(nativeObject)->~NodeIrisRtcDeviceManager();
}


napi_value NodeIrisRtcDeviceManager::Init(
                                          napi_env env,
                                          napi_callback_info info,
                                          IrisRtcDeviceManager* deviceManager) {
    napi_status status;
    napi_property_descriptor properties[] = {
        DECLARE_NAPI_METHOD("CallApiAudioDevice", CallApiAudioDevice),
        DECLARE_NAPI_METHOD("CallApiVideoDevice", CallApiVideoDevice),
        DECLARE_NAPI_METHOD("Release", Release)
        
    };
    staticDeviceManager = deviceManager;
    
    napi_value cons;
    status = napi_define_class(env, _class_name, NAPI_AUTO_LENGTH, New, nullptr,
                               3, properties, &cons);
    assert(status == napi_ok);
    
    napi_ref* constructor = new napi_ref();
    status = napi_create_reference(env, cons, 1, constructor);
    assert(status == napi_ok);
    
    status = napi_set_instance_data(
                                    env, constructor,
                                    [](napi_env env, void* data, void* hint) {
        napi_ref* constructor = static_cast<napi_ref*>(data);
        napi_status status = napi_delete_reference(env, *constructor);
        assert(status == napi_ok);
        delete constructor;
    },
                                    nullptr);
    
    assert(status == napi_ok);
    
    return cons;
}


napi_value NodeIrisRtcDeviceManager::CallApiAudioDevice(napi_env env, napi_callback_info info) {
    napi_status status;
    size_t argc = 3;
    napi_value args[3];
    napi_value jsthis;
    status = napi_get_cb_info(env, info, &argc, args, &jsthis, nullptr);
    assert(status == napi_ok);
    
    NodeIrisRtcDeviceManager* _deviceManager;
    status =
    napi_unwrap(env, jsthis, reinterpret_cast<void**>(&_deviceManager));
    
    int _apiType = 0;
    std::string parameter = "";
    
    status = napi_get_value_int32(env, args[0], &_apiType);
    status = napi_get_value_utf8string(env, args[1], parameter);
    char result[512];
    memset(result, '\0', 512);
    int ret = ERROR_PARAMETER_1;
    
    if (_deviceManager->_deviceManager) {
        ret = _deviceManager->_deviceManager->CallApi(
                                                      (ApiTypeAudioDeviceManager)_apiType, parameter.c_str(), result);
    } else {
        ret = ERROR_NOT_INIT;
    }
    RETURE_NAPI_OBJ();
}

napi_value NodeIrisRtcDeviceManager::CallApiVideoDevice(napi_env env, napi_callback_info info) {
    napi_status status;
    size_t argc = 3;
    napi_value args[3];
    napi_value jsthis;
    status = napi_get_cb_info(env, info, &argc, args, &jsthis, nullptr);
    assert(status == napi_ok);
    
    NodeIrisRtcDeviceManager* _deviceManager;
    status =
    napi_unwrap(env, jsthis, reinterpret_cast<void**>(&_deviceManager));
    
    int _apiType = 0;
    std::string parameter = "";
    
    status = napi_get_value_int32(env, args[0], &_apiType);
    status = napi_get_value_utf8string(env, args[1], parameter);
    char result[512];
    memset(result, '\0', 512);
    int ret = ERROR_PARAMETER_1;
    
    if (_deviceManager->_deviceManager) {
        ret = _deviceManager->_deviceManager->CallApi(
                                                      (ApiTypeVideoDeviceManager)_apiType, parameter.c_str(), result);
    } else {
        ret = ERROR_NOT_INIT;
    }
    RETURE_NAPI_OBJ();
}

napi_value NodeIrisRtcDeviceManager::Release(napi_env env, napi_callback_info info) {
    napi_status status;
    
    napi_value jsthis;
    status = napi_get_cb_info(env, info, nullptr, nullptr, &jsthis, nullptr);
    assert(status == napi_ok);
    
    NodeIrisRtcDeviceManager* _deviceManager;
    status =
    napi_unwrap(env, jsthis, reinterpret_cast<void**>(&_deviceManager));
    _deviceManager->_deviceManager = nullptr;
}

void NodeIrisRtcDeviceManager::ReleaseNodeSource(void* selfPtr) {
    auto _selfPtr = static_cast<NodeIrisRtcDeviceManager*>(selfPtr);
    delete _selfPtr;
    _selfPtr = nullptr;
}
}  // namespace electron
}  // namespace rtc
}  // namespace agora
