export enum NativeEngineEvents {
  onJoinChannelSuccess = "onJoinChannelSuccess",
  onLeaveChannel = "onLeaveChannel",
  onUserOffline = "onUserOffline",
  onFirstLocalVideoFrame = "onFirstLocalVideoFrame",
  onFirstRemoteVideoFrame = "onFirstRemoteVideoFrame",
}

export enum NativeVideoSourceEvents {
  onFirstLocalVideoFrame = "onFirstLocalVideoFrame",
  onFirstRemoteVideoDecoded = "onFirstRemoteVideoDecoded",
}
