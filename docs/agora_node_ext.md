agora_node_ext.md

=========================================================================================
NOTE:

	1. agora_node_ext is the NodeJs addon which wraps functionalities of agora native SDK, and enables JS developers to develop Electron APPs.

	2. Electron integrates NodeJs, and support NodeJs c++ addons. But beacuse Electron and Nodejs use different V8, so NodeJs addons must be rebuilt using Electron's headers and library to run correctly with Electron;
	
	3. In NodeJs Addon, in the context of JS thread, C++ functions could invoke JS function directly. But if it's one C++ created thread, it's not allowed to invoke JS functions. C++ origin thread need to take advantage of default UV loop to invoke JS function.
	
=========================================================================================

