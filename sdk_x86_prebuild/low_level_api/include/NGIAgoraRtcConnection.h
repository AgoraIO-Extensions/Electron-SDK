//
//  Agora SDK
//
//  Created by Sting Feng in 2018-01.
//  Copyright (c) 2018 Agora.io. All rights reserved.
//

#pragma once  // NOLINT(build/header_guard)

#include "AgoraBase.h"
#include "AgoraRefPtr.h"
#include "NGIAgoraLocalUser.h"

namespace agora {
namespace rtc {
class IAudioEncodedFrameSender;
class IRtcConnectionObserver;
class INetworkObserver;
class IRtcConnection;
class IVideoEncodedImageSender;

/**
 * The information of the RTC Connection.
 */
struct TConnectionInfo {
  /**
   * ID of the RTC Connection.
   */
  conn_id_t id;
  /**
   * ID of the channel. If you have not called \ref agora::rtc::IRtcConnection::connect "connect", this member is `NULL`.
   */
  util::AString channelId;
  /**
   * The connection state: #CONNECTION_STATE_TYPE.
   */
  CONNECTION_STATE_TYPE state;
  /**
   * ID of the local user.
   */
  util::AString localUserId;

  TConnectionInfo() : id(-1), channelId(nullptr), state(CONNECTION_STATE_DISCONNECTED), localUserId(nullptr) {}
};

/**
 * The audio subscription options.
 */
struct AudioSubscriptionOptions {
  AudioSubscriptionOptions() :
    packetOnly(false),
    bytesPerSample(0),
    numberOfChannels(0),
    sampleRateHz(0) {
  }

  AudioSubscriptionOptions(const AudioSubscriptionOptions &rhs) :
      packetOnly(rhs.packetOnly),
      bytesPerSample(rhs.bytesPerSample),
      numberOfChannels(rhs.numberOfChannels),
      sampleRateHz(rhs.sampleRateHz) {
  }

  AudioSubscriptionOptions& operator=(const AudioSubscriptionOptions &rhs) {
    if (this == &rhs) {
      return *this;
    }
    
    packetOnly = rhs.packetOnly;
    bytesPerSample = rhs.bytesPerSample;
    numberOfChannels = rhs.numberOfChannels;
    sampleRateHz = rhs.sampleRateHz;
    return *this;
  }
  /**
   * Whether to only subscribe to audio packets in RTP format.
   * - `true`: Only subscribe to audio packets in RTP format, which means that the SDK does not decode the remote audio stream. You can use this mode to receive audio packets and handle them in your app.
   * - `false`: (Default) The SDK automatically decodes the remote audio stream.
   *
   * @note If you set `packetOnly` as `true`, other fields in `AudioSubscriptionOptions` are ignored.
  */
  bool packetOnly;
  /**
   * The number of bytes that you expect for each audio sample.
   */
  size_t bytesPerSample;
  /**
   * The number of audio channels that you expect.
   */
  size_t numberOfChannels;
  /**
   * The audio sample rate (Hz) that you expect.
   */
  uint32_t sampleRateHz;
};

enum RECV_TYPE : uint8_t {
  /**
   * Receive the packet as a media packet that just processed by Agora media pipeline.
   */
  RECV_MEDIA_ONLY = 0,
  /**
   * The received packet will just be delivered to user by a receiver that registered by user.
   */
  RECV_PACKET_ONLY,
  /**
   * The received packet will be delivered to user by a receiver while be processed by Agora media pipeline.
   */
  RECV_PACKET_AND_MEDIA,
};

/**
 * Configurations for the RTC connection.
 *
 * Set these configurations when calling \ref agora::base::IAgoraService::createRtcConnection "createRtcConnection".
 */
struct RtcConnectionConfiguration {
  /**
   * Whether to subscribe to all audio tracks automatically.
   * - `true`: (Default) Subscribe to all audio tracks automatically.
   * - `false`: Do not subscribe to any audio track automatically.
   */
  bool autoSubscribeAudio;
  /**
   * Whether to subscribe to all video tracks automatically.
   * - `true`: (Default) Subscribe to all video tracks automatically.
   * - `false`: Do not subscribe to any video track automatically.
   */
  bool autoSubscribeVideo;
  /**
   * Determines whether to enable audio recording or playout.
   * - true: It's used to publish audio and mix microphone, or subscribe audio and playout
   * - false: It's used to publish extenal audio frame only without mixing microphone, or no need audio device to playout audio either
   */
  bool enableAudioRecordingOrPlayout;
  /**
   * The maximum sending bitrate.
   */
  int maxSendBitrate;
  /**
   * The minimum port.
   */
  int minPort;
  /**
   * The maximum port.
   */
  int maxPort;
  /**
   * The options for audio subscription. See \ref agora::rtc::AudioSubscriptionOptions "AudioSubscriptionOptions".
   */
  AudioSubscriptionOptions audioSubscriptionOptions;
  /**
   * The user role. For details, see \ref agora::rtc::CLIENT_ROLE_TYPE "CLIENT_ROLE_TYPE". The default user role is `CLIENT_ROLE_AUDIENCE`.
   */
  CLIENT_ROLE_TYPE clientRoleType;
  /** The channel profile. For details, see \ref agora::CHANNEL_PROFILE_TYPE "CHANNEL_PROFILE_TYPE". The default channel profile is `CHANNEL_PROFILE_LIVE_BROADCASTING`.
   */
  CHANNEL_PROFILE_TYPE  channelProfile;

  /**
   * The receiving type.
   */
  RECV_TYPE recvType;

  RtcConnectionConfiguration()
      : autoSubscribeAudio(true),
        autoSubscribeVideo(true),
        enableAudioRecordingOrPlayout(true),
        maxSendBitrate(-1),
        minPort(0),
        maxPort(0),
        clientRoleType(CLIENT_ROLE_AUDIENCE),
        channelProfile(CHANNEL_PROFILE_LIVE_BROADCASTING),
        recvType(RECV_MEDIA_ONLY) {}
};

/**
 * The `IRtcConnection` class.
 *
 * You can use this class for managing the connection between your app and an Agora Channel.
 *
 * Once connected, your app gets an `AgoraLocalUser` object for publishing and subscribing to media streams in the Agora Channel.
 *
 * Connecting to a channel is done asynchronously, and your app can listen for the connection states or events with `IRtcConnectionObserver`. `IRtcConnection` also monitors remote users in the channel. The SDK notifies your app when a remote user joins or leaves the channel.
 */
class IRtcConnection : public RefCountInterface {
 protected:
  ~IRtcConnection() = default;

 public:
  /**
   * Connects to an Agora channel.
   *
   * When the method call succeeds, the connection state changes from `CONNECTION_STATE_DISCONNECTED(1)` to
   * `CONNECTION_STATE_CONNECTING(2)`.
   *
   * Depending on the whether the connection succeeds or not, the
   * connection state changes to either `CONNECTION_STATE_CONNECTED(3)` or `CONNECTION_STATE_FAILED(5)`. The SDK also triggers `onConnected` or `onDisconnected` to notify you of the state change.
   *
   * @param token The App ID.
   * @param channelId The unique channel name. It must be in the string format and not exceed 64 bytes in length. Supported character scopes are:
   * - All lowercase English letters: a to z.
   * - All uppercase English letters: A to Z.
   * - All numeric characters: 0 to 9.
   * - The space character.
   * - Punctuation characters and other symbols, including: "!", "#", "$", "%", "&", "(", ")", "+",
   * "-", ":", ";", "<", "=",
   * ".", ">", "?", "@", "[", "]", "^", "_", " {", "}", "|", "~", ","
   * @param userId ID of the local user. If you do not specify a user ID or set `userId` as `null`,
   * the SDK returns a user ID in the \ref IRtcConnectionObserver::onConnected "onConnected"
   * callback. Your app must record and maintain the `userId` since the SDK does not do so.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   *   - ERR_INVALID_ARGUMENT: The argument that you pass is invalid.
   *   - ERR_INVALID_STATE: The current connection state is not CONNECTION_STATE_DISCONNECTED(1).
   */
  virtual int connect(const char* token, const char* channelId, user_id_t userId) = 0;

  /**
   * Disconnects from the Agora channel.
   *
   * Once your app successful disconnects from the channel, the connection state changes to
   * `CONNECTION_STATE_DISCONNECTED(1)`. You will be also notified with the callback
   * \ref IRtcConnectionObserver::onDisconnected "onDisconnected".
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int disconnect() = 0;

  /**
   * Starts the last-mile network probe test.
   *
   * Call this method before connecting to the channel to get the uplink and
   * downlink last-mile network statistics, including the bandwidth, packet loss, jitter, and
   * round-trip time (RTT).
   *
   * After you enable the last-mile network probe test, the SDK triggers the following callbacks:
   * - \ref IRtcConnectionObserver::onLastmileQuality "onLastmileQuality": The SDK triggers this
   * callback within two seconds depending on the network conditions. This callback rates the network
   * conditions and is more closely linked to the user experience.
   * - \ref IRtcConnectionObserver::onLastmileProbeResult "onLastmileProbeResult": The SDK triggers
   * this callback within 30 seconds depending on the network conditions. This callback reports the
   * real-time statistics of the network conditions and is more objective.
   *
   * @note
   * - Do not call any other method before receiving the \ref IRtcConnectionObserver::onLastmileQuality
   * "onLastmileQuality" and \ref IRtcConnectionObserver::onLastmileProbeResult "onLastmileProbeResult"
   * callbacks. Otherwise, the callbacks may be interrupted.
   * - In the live-broadcast profile, a host should not call this method after connecting to a channel.
   *
   * @param config The configurations of the last-mile network probe test: #LastmileProbeConfig.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int startLastmileProbeTest(const LastmileProbeConfig& config) = 0;

  /**
   * Stops the last-mile network probe test.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int stopLastmileProbeTest() = 0;

  /**
   * Renews the Token.
   *
   * The token expires after a certain period of time once the token schema is enabled.
   * When the \ref IRtcConnectionObserver::onError "onError" callback reports `ERR_TOKEN_EXPIRED(109)`, you must generate a new token from the server
   * and then call this method to renew it. Otherwise, the SDK disconnects from the Agora channel.
   *
   * @param token The pointer to the new token.
   */
  virtual int renewToken(const char* token) = 0;

  /**
   * Gets the connection information.
   *
   * @return
   * - The pointer to the \ref agora::rtc::TConnectionInfo "TConnectionInfo" object, if the method call succeeds.
   * - A null pointer, if the method call fails.
   */
  virtual TConnectionInfo getConnectionInfo() = 0;

  /**
   * Gets the \ref agora::rtc::ILocalUser "ILocalUser" object.
   *
   * @return
   * - The pointer to the \ref agora::rtc::ILocalUser "ILocalUser" object, if the method call succeeds.
   * - A null pointer, if the method call fails.
   */
  virtual ILocalUser* getLocalUser() = 0;

  /**
   * Gets the information of all the remote users in the channel.
   *
   * After a user successfully connects to the channel, you can also get the information of this remote user
   * with the \ref IRtcConnectionObserver::onUserJoined "onUserJoined" callback.
   *
   * @param users[out] The reference to the \ref agora::UserList "UserList" object, which contains the information of all users
   * in the channel.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int getRemoteUsers(UserList& users) = 0;

  /**
   * Gets the information of a specified remote user in the channel.
   *
   * @param userId[in] ID of the user whose information you want to get.
   * @param userInfo[out] The reference to the \ref agora::UserInfo "UserInfo" object, which contains the information of the
   * specified user.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int getUserInfo(user_id_t userId, UserInfo& userInfo) = 0;

  /**
   * Registers an RTC connection observer.
   *
   * @param observer The pointer to the IRtcConnectionObserver object.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int registerObserver(IRtcConnectionObserver* observer) = 0;

  /**
   * Releases the registered IRtcConnectionObserver object.
   *
   * @param observer The pointer to the IRtcConnectionObserver object created by the \ref registerObserver
   * "registerObserver" method.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int unregisterObserver(IRtcConnectionObserver* observer) = 0;

  /**
   * Registers an network observer object.
   *
   * @param observer The pointer to the INetworkObserver object.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int registerNetworkObserver(INetworkObserver* observer) = 0;

  /**
   * Releases the registered INetworkObserver object.
   *
   * @param observer The pointer to the INetworkObserver object created by the \ref registerNetworkObserver
   * "registerNetworkObserver" method.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int unregisterNetworkObserver(INetworkObserver* observer) = 0;

  /**
   * Gets the ID of the connection.
   *
   * @return
   * - The connection ID, if the method call succeeds.
   * - A null pointer, if the method call fails.
   */
  virtual conn_id_t getConnId() = 0;

  /**
   * Gets the transportation statistics of the RTC connection.
   *
   * @return
   * - The pointer to \ref agora::rtc::RtcStats "RtcStats", if the method call succeeds.
   * - A null pointer, if the method call fails.
   */
  virtual RtcStats getTransportStats() = 0;

  /**
   * Gets the IAgoraParameter object.
   *
   * @return
   * - The pointer to the \ref agora::base::IAgoraParameter "IAgoraParameter" object.
   * - A null pointer, if the method call fails.
   */
  virtual agora::base::IAgoraParameter* getAgoraParameter() = 0;

  /**
   * Creates a data stream.
   *
   * Each user can create up to five data streams during the lifecycle of the RTC connection.
   *
   * @note Set both the `reliable` and `ordered` parameters to `true` or `false`. Do not set one as `true` and the other as `false`.
   *
   * @param streamId The pointer to the ID of the data stream.
   * @param reliable Whether to guarantee the receivers receive the data stream within five seconds:
   * - `true`: Guarantee that the receivers receive the data stream within five seconds. If the receivers do not receive the data stream within five seconds, the SDK reports an error to the application.
   * - `false`: Do not guarantee that the receivers receive the data stream within five seconds and the SDK does not report any error message for data stream delay or missing.
   * @param ordered Whether the receivers receive the data stream in the order of sending:
   * - `true`: The receivers receive the data stream in the order of sending.
   * - `false`: The receivers do not receive the data stream in the order of sending.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int createDataStream(int* streamId, bool reliable, bool ordered) = 0;

  /** Sends data stream messages to all users in a channel.
   *
   * @note This method has the following restrictions:
   * - Up to 30 packets can be sent per second in a channel with a maximum size of 1 kB for each packet.
   * - Each client can send up to 6 kB of data per second.
   * - Each user can have up to five data streams simultaneously.
   *
   * @param streamId ID of the sent data stream, returned in the \ref IRtcEngine::createDataStream "createDataStream" method.
   * @param data The pointer to the sent data.
   * @param length The length of the sent data.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int sendStreamMessage(int streamId, const char* data, size_t length) = 0;

  /** Enables/Disables the built-in encryption.
   *
   * In scenarios requiring high security, Agora recommends calling this method to enable the built-in encryption before joining a channel.
   *
   * All users in the same channel must use the same encryption mode and encryption key. Once all users leave the channel, the encryption key of this channel is automatically cleared.
   *
   * @note
   * - If you enable the built-in encryption, you cannot use the RTMP streaming function.
   * - Agora only supports `SM4_128_ECB` encryption mode for now.
   *
   * @param enabled Whether to enable the built-in encryption:
   * - true: Enable the built-in encryption.
   * - false: Disable the built-in encryption.
   * @param config Configurations of built-in encryption schemas. See EncryptionConfig.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int enableEncryption(bool enabled, const EncryptionConfig& config) = 0;

  /**
   * Report custom event to argus.
   *
   * @param id Custom Event ID
   * @param category Custom Event category
   * @param event Custom Event to report
   * @param label Custom Event label
   * @param value Custom Event value
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int sendCustomReportMessage(const char* id, const char* category, const char* event, const char* label, int value) = 0;
};

/**
 * The IRtcConnectionObserver class, which observes the connection state of the SDK.
 */
class IRtcConnectionObserver {
 public:
  virtual ~IRtcConnectionObserver() = default;

  /**
   * Occurs when the connection state between the SDK and the Agora channel changes to `CONNECTION_STATE_CONNECTED(3)`.
   *
   * @param connectionInfo The information of the connection: TConnectionInfo.
   * @param reason The reason of the connection state change: #CONNECTION_CHANGED_REASON_TYPE.
   */
  virtual void onConnected(const TConnectionInfo& connectionInfo, CONNECTION_CHANGED_REASON_TYPE reason) = 0;

  /**
   * Occurs when the connection state between the SDK and the Agora channel changes to `CONNECTION_STATE_DISCONNECTED(1)`.
   *
   * @param connectionInfo The information of the connection: TConnectionInfo.
   * @param reason The reason of the connection state change: #CONNECTION_CHANGED_REASON_TYPE.
   */
  virtual void onDisconnected(const TConnectionInfo& connectionInfo, CONNECTION_CHANGED_REASON_TYPE reason) = 0;

  /**
   * Occurs when the connection state between the SDK and the Agora channel changes to `CONNECTION_STATE_CONNECTING(2)`.
   *
   * @param connectionInfo The information of the connection: TConnectionInfo.
   * @param reason The reason of the connection state change: #CONNECTION_CHANGED_REASON_TYPE.
   */
  virtual void onConnecting(const TConnectionInfo& connectionInfo, CONNECTION_CHANGED_REASON_TYPE reason) = 0;

  /**
   * Occurs when the connection state between the SDK and the Agora channel changes to `CONNECTION_STATE_RECONNECTING(4)`.
   *
   * @param connectionInfo The information of the connection: TConnectionInfo.
   * @param reason The reason of the connection state change: #CONNECTION_CHANGED_REASON_TYPE.
   */
  virtual void onReconnecting(const TConnectionInfo& connectionInfo, CONNECTION_CHANGED_REASON_TYPE reason) = 0;

  // This should be deleted. onConnected is enough.
  virtual void onReconnected(const TConnectionInfo& connectionInfo, CONNECTION_CHANGED_REASON_TYPE reason) = 0;

  /**
   * Occurs when the SDK loses connection with the Agora channel.
   *
   * @param connectionInfo The information of the connection: TConnectionInfo.
   */
  virtual void onConnectionLost(const TConnectionInfo& connectionInfo) = 0;

  /**
   * Reports the quality of the last-mile network.
   *
   * The SDK triggers this callback within two seconds after the app calls \ref IRtcConnection::startLastmileProbeTest "startLastmileProbeTest".
   *
   * @param quality Quality of the last-mile network: #QUALITY_TYPE.
   */
  virtual void onLastmileQuality(const QUALITY_TYPE quality) = 0;

  /**
   * Reports the result of the last-mile network probe test.
   *
   * The SDK triggers this callback within 30 seconds after the app calls \ref IRtcConnection::startLastmileProbeTest "startLastmileProbeTest".
   *
   * @param result The result of the last-mile network probe test: #LastmileProbeResult.
   */
  virtual void onLastmileProbeResult(const LastmileProbeResult& result) = 0;

  /**
   * Occurs when the token expires in 30 seconds.
   *
   * The SDK triggers this callback to remind the app to get a new token before the token privilege expires.
   *
   * Upon receiving this callback, you must generate a new token on your server and call \ref IRtcConnection::renewToken
   * "renewToken" to pass the new token to the SDK.
   *
   * @param token The pointer to the token that expires in 30 seconds.
   */
  virtual void onTokenPrivilegeWillExpire(const char* token) = 0;

  /**
   * Occurs when the token has expired.
   *
   * Upon receiving this callback, you must generate a new token on your server and call \ref IRtcConnection::renewToken
   * "renewToken" to pass the new token to the SDK.
   */
  virtual void onTokenPrivilegeDidExpire() = 0;

  /**
   * Occurs when the connection state between the SDK and the Agora channel changes to `CONNECTION_STATE_FAILED(5)`.
   *
   * @param connectionInfo The connection information: TConnectionInfo.
   * @param reason The reason of the connection state change: #CONNECTION_CHANGED_REASON_TYPE.
   */
  virtual void onConnectionFailure(const TConnectionInfo& connectionInfo,
                                   CONNECTION_CHANGED_REASON_TYPE reason) = 0;

  /**
   * Occurs when a remote user joins the channel.
   *
   * You can get the ID of the remote user in this callback.
   *
   * @param userId ID of the remote user who joins the channel.
   */
  virtual void onUserJoined(user_id_t userId) = 0;

  /**
   * Occurs when a remote user leaves the channel.
   *
   * You can know why the user leaves the channel with the `reason` parameter.
   *
   * @param userId ID of the user who leaves the channel.
   * @param reason The reason why the remote user leaves the channel: #USER_OFFLINE_REASON_TYPE.
   */
  virtual void onUserLeft(user_id_t userId, USER_OFFLINE_REASON_TYPE reason) = 0;

  /**
   * Reports the transport statistics of the connection.
   *
   * The SDK triggers this callback once every two seconds when the connection state is `CONNECTION_STATE_CONNECTED`.
   *
   * @param stats The pointer to \ref rtc::RtcStats "RtcStats".
   */
  virtual void onTransportStats(const RtcStats& stats) = 0;

  /**
   * Occurs when the role of the local user changes.
   *
   * @param oldRole The previous role of the local user: \ref rtc::CLIENT_ROLE_TYPE "CLIENT_ROLE_TYPE".
   * @param newRole The current role of the local user: \ref rtc::CLIENT_ROLE_TYPE "CLIENT_ROLE_TYPE".
   */
  virtual void onChangeRoleSuccess(CLIENT_ROLE_TYPE oldRole, CLIENT_ROLE_TYPE newRole) {
    (void)oldRole;
    (void)newRole;
  }

  /**
   * Occurs when the local user fails to change the user role.
   */
  virtual void onChangeRoleFailure() {}

  /**
   * Reports the network quality of each user.
   *
   * The SDK triggers this callback once every two seconds to report the uplink and downlink network conditions
   * of each user in the channel, including the local user.
   *
   * @param userId ID of the user. If `userId` is empty, this callback reports the network quality of the local user.
   * @param txQuality The uplink network quality: #QUALITY_TYPE.
   * @param rxQuality The downlink network quality: #QUALITY_TYPE.
   */
  virtual void onUserNetworkQuality(user_id_t userId, QUALITY_TYPE txQuality,
                                    QUALITY_TYPE rxQuality) {
    (void)userId;
    (void)txQuality;
    (void)rxQuality;
  }

  /** Occurs when the network type is changed.

  @param type See #NETWORK_TYPE.
   */
  virtual void onNetworkTypeChanged(NETWORK_TYPE type) {
    (void)type;
  }

  /**
   * Occurs when an API method is executed.
   *
   * @param err The error code that the SDK reports when the method call fails. If the SDK reports 0,
   * the method call succeeds.
   * @param api The API method that is executed.
   * @param result The result of the method call.
   */
  virtual void onApiCallExecuted(int err, const char* api, const char* result) {
    (void)err;
    (void)api;
    (void)result;
  }

  /**
   * Reports the error code and error message.
   * @param error The error code: #ERROR_CODE_TYPE.
   * @param msg The error message.
   */
  virtual void onError(ERROR_CODE_TYPE error, const char* msg) {
    (void)error;
    (void)msg;
  }

  /**
   * Reports the warning code and warning message.
   * @param warning The warning code: #WARN_CODE_TYPE.
   * @param msg The warning message.
   */
  virtual void onWarning(WARN_CODE_TYPE warning, const char* msg) {
    (void)warning;
    (void)msg;
  }

  /**
   * Occurs when the state of the channel media relay changes.
   *
   * After you successfully call the `startChannelMediaRelay` method, the SDK triggers this callback to report
   * the state of the media relay.
   *
   * @param state The state code of the channel media relay.
   * @param code The error code of the channel media relay.
   */
  virtual void onChannelMediaRelayStateChanged(int state, int code) = 0;

  /**
   * Occurs when receiving data stream messages from a remote user in the channel.
   *
   * @param userId ID of the user sending the data stream.
   * @param streamId  ID of the sent data stream, returned in the \ref IRtcEngine::createDataStream "createDataStream" method.
   * @param data The pointer to the sent data.
   * @param length The length of the sent data.
   */
  virtual void onStreamMessage(user_id_t userId, int streamId, const char* data,
                               size_t length) {}

  /**
   * Reports the error that occurs when receiving data stream messages.
   *
   * @param userId ID of the user sending the data stream.
   * @param streamId  ID of the sent data stream, returned in the \ref IRtcEngine::createDataStream "createDataStream" method.
   * @param code
   * @param missed
   * @param cached
   */
  virtual void onStreamMessageError(user_id_t userId, int streamId, int code, int missed,
                                    int cached) {}
};

class INetworkObserver {
 public:
  virtual ~INetworkObserver() = default;

 public:
  virtual void onBandwidthEstimationUpdated(const NetworkInfo& info) {};
};

}  // namespace rtc
}  // namespace agora
