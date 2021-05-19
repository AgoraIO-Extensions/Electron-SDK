//
// Created by LXH on 2021/1/21.
//

#include "iris_rtc_device_manager.h"
#include "internal/iris_json_utils.h"
#include "internal/iris_rtc_json_decoder.h"
#include "iris_proxy.h"

#define GET_VALUE$(val, key, type) GET_VALUE(val, key, key, type)

#define GET_VALUE_UINT$(val, key, type) GET_VALUE_UINT(val, key, key, type)

#define SET_VALUE_CHAR$(doc, val, key) SET_VALUE_CHAR(doc, val, key, key)

namespace agora {
using namespace rtc;

namespace iris {
namespace rtc {
using rapidjson::Document;
using rapidjson::Value;

class IrisRtcDeviceManager::IrisRtcDeviceManagerImpl {
 public:
  IrisRtcDeviceManagerImpl() : rtc_engine_(nullptr) {}

  ~IrisRtcDeviceManagerImpl() = default;

  void Initialize(IRtcEngine *engine) { rtc_engine_ = engine; }

  void Release() { rtc_engine_ = nullptr; }

  int CallApi(ApiTypeAudioDeviceManager api_type, const char *params,
              char *result) {
    if (!rtc_engine_) { return -ERROR_CODE_TYPE::ERR_NOT_INITIALIZED; }

    int error_code = -ERROR_CODE_TYPE::ERR_FAILED;
    Document document;
    document.Parse(params);

    AAudioDeviceManager audio_device_manager(rtc_engine_);

    switch (api_type) {
      case kGetAudioPlaybackDeviceCount: {
        auto devices = audio_device_manager->enumeratePlaybackDevices();
        error_code = devices->getCount();
        devices->release();
        break;
      }
      case kGetAudioPlaybackDeviceInfoByIndex: {
        auto devices = audio_device_manager->enumeratePlaybackDevices();
        int index;
        GET_VALUE$(document, index, int)
        char deviceName[MAX_DEVICE_ID_LENGTH];
        char deviceId[MAX_DEVICE_ID_LENGTH];

        error_code = devices->getDevice(index, deviceName, deviceId);

        Value value(rapidjson::kObjectType);
        SET_VALUE_CHAR$(document, value, deviceName)
        SET_VALUE_CHAR$(document, value, deviceId)
        strcpy(result, ToJsonString(value).c_str());
        break;
      }
      case kSetCurrentAudioPlaybackDeviceId: {
        const char *deviceId;
        GET_VALUE$(document, deviceId, const char *)
        error_code = audio_device_manager->setPlaybackDevice(deviceId);
        break;
      }
      case kGetCurrentAudioPlaybackDeviceId: {
        char deviceId[MAX_DEVICE_ID_LENGTH];
        error_code = audio_device_manager->getPlaybackDevice(deviceId);
        strcpy(result, deviceId);
        break;
      }
      case kGetCurrentAudioPlaybackDeviceInfo: {
        char deviceId[MAX_DEVICE_ID_LENGTH];
        char deviceName[MAX_DEVICE_ID_LENGTH];

        error_code =
            audio_device_manager->getPlaybackDeviceInfo(deviceId, deviceName);

        Value value(rapidjson::kObjectType);
        SET_VALUE_CHAR$(document, value, deviceId)
        SET_VALUE_CHAR$(document, value, deviceName)
        strcpy(result, ToJsonString(value).c_str());
        break;
      }
      case kSetAudioPlaybackDeviceVolume: {
        int volume;
        GET_VALUE$(document, volume, int)
        error_code = audio_device_manager->setPlaybackDeviceVolume(volume);
        break;
      }
      case kGetAudioPlaybackDeviceVolume: {
        int volume;
        audio_device_manager->getPlaybackDeviceVolume(&volume);
        error_code = volume;
        break;
      }
      case kSetAudioPlaybackDeviceMute: {
        bool mute;
        GET_VALUE$(document, mute, bool)
        error_code = audio_device_manager->setPlaybackDeviceMute(mute);
        break;
      }
      case kGetAudioPlaybackDeviceMute: {
        bool mute;
        audio_device_manager->getPlaybackDeviceMute(&mute);
        error_code = mute;
        break;
      }
      case kStartAudioPlaybackDeviceTest: {
        const char *testAudioFilePath;
        GET_VALUE$(document, testAudioFilePath, const char *)
        error_code =
            audio_device_manager->startPlaybackDeviceTest(testAudioFilePath);
        break;
      }
      case kStopAudioPlaybackDeviceTest: {
        error_code = audio_device_manager->stopPlaybackDeviceTest();
        break;
      }
      case kGetAudioRecordingDeviceCount: {
        auto devices = audio_device_manager->enumerateRecordingDevices();
        error_code = devices->getCount();
        devices->release();
        break;
      }
      case kGetAudioRecordingDeviceInfoByIndex: {
        auto devices = audio_device_manager->enumerateRecordingDevices();
        int index;
        GET_VALUE$(document, index, int)
        char deviceName[MAX_DEVICE_ID_LENGTH];
        char deviceId[MAX_DEVICE_ID_LENGTH];

        error_code = devices->getDevice(index, deviceName, deviceId);

        Value value(rapidjson::kObjectType);
        SET_VALUE_CHAR$(document, value, deviceName)
        SET_VALUE_CHAR$(document, value, deviceId)
        strcpy(result, ToJsonString(value).c_str());
        break;
      }
      case kSetCurrentAudioRecordingDeviceId: {
        const char *deviceId;
        GET_VALUE$(document, deviceId, const char *)
        error_code = audio_device_manager->setRecordingDevice(deviceId);
        break;
      }
      case kGetCurrentAudioRecordingDeviceId: {
        char deviceId[MAX_DEVICE_ID_LENGTH];
        error_code = audio_device_manager->getRecordingDevice(deviceId);
        strcpy(result, deviceId);
        break;
      }
      case kGetCurrentAudioRecordingDeviceInfo: {
        char deviceId[MAX_DEVICE_ID_LENGTH];
        char deviceName[MAX_DEVICE_ID_LENGTH];

        error_code =
            audio_device_manager->getRecordingDeviceInfo(deviceId, deviceName);

        Value value(rapidjson::kObjectType);
        SET_VALUE_CHAR$(document, value, deviceId)
        SET_VALUE_CHAR$(document, value, deviceName)
        strcpy(result, ToJsonString(value).c_str());
        break;
      }
      case kSetAudioRecordingDeviceVolume: {
        int volume;
        GET_VALUE$(document, volume, int)
        error_code = audio_device_manager->setRecordingDeviceVolume(volume);
        break;
      }
      case kGetAudioRecordingDeviceVolume: {
        int volume;
        audio_device_manager->getRecordingDeviceVolume(&volume);
        error_code = volume;
        break;
      }
      case kSetAudioRecordingDeviceMute: {
        bool mute;
        GET_VALUE$(document, mute, bool)
        error_code = audio_device_manager->setRecordingDeviceMute(mute);
        break;
      }
      case kGetAudioRecordingDeviceMute: {
        bool mute;
        audio_device_manager->getRecordingDeviceMute(&mute);
        error_code = mute;
        break;
      }
      case kStartAudioRecordingDeviceTest: {
        int indicationInterval;
        GET_VALUE$(document, indicationInterval, int)
        error_code =
            audio_device_manager->startRecordingDeviceTest(indicationInterval);
        break;
      }
      case kStopAudioRecordingDeviceTest: {
        error_code = audio_device_manager->stopRecordingDeviceTest();
        break;
      }
      case kStartAudioDeviceLoopbackTest: {
        int indicationInterval;
        GET_VALUE$(document, indicationInterval, int)
        error_code = audio_device_manager->startAudioDeviceLoopbackTest(
            indicationInterval);
        break;
      }
      case kStopAudioDeviceLoopbackTest: {
        error_code = audio_device_manager->stopAudioDeviceLoopbackTest();
        break;
      }
    }

    return error_code;
  }

  int CallApi(ApiTypeVideoDeviceManager api_type, const char *params,
              char *result) {
    if (!rtc_engine_) { return -ERROR_CODE_TYPE::ERR_NOT_INITIALIZED; }

    int error_code = -ERROR_CODE_TYPE::ERR_FAILED;
    Document document;
    document.Parse(params);

    AVideoDeviceManager *video_device_manager =
        new AVideoDeviceManager(rtc_engine_);

    if (!video_device_manager->get()) { return error_code; }

    switch (api_type) {
      case kGetVideoDeviceCount: {
        auto devices = video_device_manager->get()->enumerateVideoDevices();
        error_code = devices->getCount();
        devices->release();
        break;
      }
      case kGetVideoDeviceInfoByIndex: {
        auto devices = video_device_manager->get()->enumerateVideoDevices();
        int index;
        GET_VALUE$(document, index, int)
        char deviceName[MAX_DEVICE_ID_LENGTH];
        char deviceId[MAX_DEVICE_ID_LENGTH];

        error_code = devices->getDevice(index, deviceName, deviceId);

        Value value(rapidjson::kObjectType);
        SET_VALUE_CHAR$(document, value, deviceName)
        SET_VALUE_CHAR$(document, value, deviceId)
        strcpy(result, ToJsonString(value).c_str());
        break;
      }
      case kSetCurrentVideoDeviceId: {
        const char *deviceId;
        GET_VALUE$(document, deviceId, const char *)
        error_code = video_device_manager->get()->setDevice(deviceId);
        break;
      }
      case kGetCurrentVideoDeviceId: {
        char deviceId[MAX_DEVICE_ID_LENGTH];
        error_code = video_device_manager->get()->getDevice(deviceId);
        strcpy(result, deviceId);
        break;
      }
      case kStartVideoDeviceTest: {
        view_t hwnd;
        GET_VALUE_UINT$(document, hwnd, view_t)
        error_code = video_device_manager->get()->startDeviceTest(hwnd);
        break;
      }
      case kStopVideoDeviceTest: {
        error_code = video_device_manager->get()->stopDeviceTest();
        break;
      }
    }
    video_device_manager->release();

    return error_code;
  }

 private:
  IRtcEngine *rtc_engine_;
};

IrisRtcDeviceManager::IrisRtcDeviceManager()
    : device_manager_(new IrisRtcDeviceManagerImpl), proxy_(nullptr) {}

IrisRtcDeviceManager::~IrisRtcDeviceManager() {
  if (device_manager_) {
    delete device_manager_;
    device_manager_ = nullptr;
  }
}

void IrisRtcDeviceManager::Initialize(IRtcEngine *engine) {
  device_manager_->Initialize(engine);
}

void IrisRtcDeviceManager::Release() { device_manager_->Release(); }

void IrisRtcDeviceManager::SetProxy(IrisProxy *proxy) { proxy_ = proxy; }

int IrisRtcDeviceManager::CallApi(ApiTypeAudioDeviceManager api_type,
                                  const char *params, char *result) {
  if (proxy_) { return proxy_->CallApi(api_type, params, result); }
  if (!device_manager_) { return -ERROR_CODE_TYPE::ERR_NOT_INITIALIZED; }
  return device_manager_->CallApi(api_type, params, result);
}

int IrisRtcDeviceManager::CallApi(ApiTypeVideoDeviceManager api_type,
                                  const char *params, char *result) {
  if (proxy_) { return proxy_->CallApi(api_type, params, result); }
  if (!device_manager_) { return -ERROR_CODE_TYPE::ERR_NOT_INITIALIZED; }
  return device_manager_->CallApi(api_type, params, result);
}
}// namespace rtc
}// namespace iris
}// namespace agora
