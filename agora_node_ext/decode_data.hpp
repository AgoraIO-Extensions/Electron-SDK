//
//  encoder_data.hpp
//  agora_node_ext
//
//  Created by Jerry-Luo on 2022/4/20.
//

#ifndef encoder_data_hpp
#define encoder_data_hpp

#include "IAgoraRtcEngine2.h"
#include "IAgoraRtcEngineEx.h"
#include "node_napi_api.h"

using namespace agora;
using namespace agora::rtc;
using namespace agora::base;
typedef NodeString nodestring;

void decodeChannelMediaOptions(ChannelMediaOptions &option, std::string &token,
                               const Nan::FunctionCallbackInfo<Value> &args,
                               const Local<Object> &value);
void decodeVideoEncoderConfiguration(
    VideoEncoderConfiguration &config, napi_status &status,
    const Nan::FunctionCallbackInfo<Value> &args, const Local<Object> &value);

void decodeRtcConnection(RtcConnection &connection, std::string &channelId,
                         napi_status &status,
                         const Nan::FunctionCallbackInfo<Value> &args,
                         const Local<Object> &value);
void decodeStreamConfig(SimulcastStreamConfig &config,
                        napi_status &status,
                        const Nan::FunctionCallbackInfo<Value> &args,
                        const Local<Object> &value);
#endif /* encoder_data_hpp */
