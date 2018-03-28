node-gyp rebuild --debug --target=1.7.9 --dist-url=https://atom.io/download/electron
install_name_tool -change /usr/local/lib/libnode.dylib @rpath/"Electron Framework.framework"/Versions/A/Libraries/libnode.dylib build/Debug/agora_node_ext.dylib
mv build/Debug/agora_node_ext.dylib build/Debug/agora_node_ext.node
