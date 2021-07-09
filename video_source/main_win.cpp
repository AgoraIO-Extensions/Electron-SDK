#include "video_source.h"
#include <thread>  
#include <chrono> 

int main(int argc, char* argv[])
{
    initLogService();
    if (argc < 3){
        LOG_ERROR("Need at least 3 parameter. Current parameter num : %d\n", argc);
        return 0;
    }

    std::string param;
    LOG_INFO("Args : %s\n", param.c_str());

    for (int i = 1; i < argc; i++) {
        param.append(argv[i]);
        param.append(" ");
    }
    run(param);
}