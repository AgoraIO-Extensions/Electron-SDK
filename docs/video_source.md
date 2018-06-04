Video source communicate with agora_node_ext via IPC.

When agora_node_ext need multiple video source, it will create VideoSource process. After video source initialized, it then waiting for CMDs from agora_node_ext. Then use Agora SDK's self render interface to get video frame data, and transfer to agora_node_ext via IPC.

=====================useage of video source===============================
Video source API support join/leave channel, set channel/video profile, start/stop/update screen capture, start/stop screen capture preview.

To use Video source feature, follow following steps:
1. initialize video source via API videoSourceInitialize

2. join channel via API videoSourceJoin

3. set channel/video profile via API videoSourceSetChannelProfile/videoSourceSetVideoProfile

4. start to share screen via API stopScreenCapture2

To preview screen sharing video:

5. bind video view via API setupLocaVideoSource

6. start preview via API startScreenCapturePreview

7. stop Preview via API stopScreenCapturePreview

8. stop screen sharing via stopScreenCapture2

