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

1. `videoSourceInitialize` - Initializes the video source

2. `videoSourceJoin` - Joins the channel

3. `videoSourceSetChannelProfile` - Sets the channel profile

4. `videoSourceSetVideoProfile` - Sets the video profile

5. `stopScreenCapture2` - Starts screen shares 


### Shared Video Preview API Methods

1. `setupLocaVideoSource` - Binds the video view

2. `startScreenCapturePreview` - Starts the preview

3. `stopScreenCapturePreview` - Stops the preview 

4. `stopScreenCapture2 ` - Stops screen sharing

