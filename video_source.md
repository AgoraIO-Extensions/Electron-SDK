Video source communicate with agora_node_ext via IPC.

When agora_node_ext need multiple video source, it will create VideoSource process. After video source initialized, it then waiting for CMDs from agora_node_ext. Then use Agora SDK's self render interface to get video frame data, and transfer to agora_node_ext via IPC.

