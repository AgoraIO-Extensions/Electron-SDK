# About the `agora_node_ext` folder

### NodeJS Add-on support

Electron integrates NodeJS and supports NodeJS C++ add-ons. The NodeJS add-ons use C++ functions to invoke the Electron JavaScript functions.

If the add-on is a single C++ created thread, the add-on will not have permission to invoke the Electron JavaScript functions. The C++ origin thread must take advantage of a default UV loop in order to invoke the JavaScript functions.
	
**Note:** Electron and NodeJS use different versions, so the NodeJS add-ons must be rebuilt using the Electron's library and headers, in order for NodeJS to run correctly with Electron.


### `agora_node_ext ` add-on

The [`agora_node_ext`](agora_node_ext/agora_node_ext.cpp) is a NodeJS add-on. It wraps Agora's native SDK functionality and enables JavaScript developers to develop Electron Apps.