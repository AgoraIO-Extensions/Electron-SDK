let configs = {
    devtool: "source-map"
};

if(process.env.NODE_ENV !== 'development') {
    configs.externals = "../../build/Release/agora_node_ext"
}

module.exports = configs
