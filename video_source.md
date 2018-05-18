# About the `video_source` folder

The `video_source` folder contains files that communicate with `agora_node_ext` using IPC.

- If `agora_node_ext` needs multiple video sources, it creates a `VideoSource` process.

- Once the video source is initialized, it waits for CMDs from `agora_node_ext`.

- The Agora SDK will then render the interface for the retrieved video frame data, and transfer it to `agora_node_ext` using IPC.

## Video Source Usage

The video source API supports the ability to:

- Join / leave a channel
- Set a profile for a channel / video
- Start / stop / update screen captures
- Start / stop screen capture previews


### Video Source API Methods

These methods manage the video source.

Method name|Description
---|---
`videoSourceInitialize`|Initializes the video source.
`videoSourceJoin`|Joins the channel.
`videoSourceSetChannelProfile`|Sets the channel profile.
`videoSourceSetVideoProfile`|Sets the video profile.
`setupLocaVideoSource`|Binds the video view.


### Shared Video Preview API Methods

These methods handle screen capture functionality.

Method name|Description
---|---
`startScreenCapturePreview`|Starts the preview.
`stopScreenCapturePreview`|Stops the preview.
`startScreenCapture2`|Starts screen sharing.
`stopScreenCapture2`|Stops screen sharing.