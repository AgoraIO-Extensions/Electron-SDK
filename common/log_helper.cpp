#include "log_helper.h"
#include <thread>
#include <mutex>
LogHelper *LogHelper::getInstance(const char* log_path){

    static LogHelper _log_helper(log_path);
    return &_log_helper;
}

LogHelper::LogHelper(const char* log_path)
{
    std::string path(log_path);
    if(path.empty()) {
        INodeProcess::getCurrentModuleFileName(path);
        path.append("log.txt");
    }
    startLogService(path.c_str());
}

int LogHelper::setAddonLogPath(const char* log_path)
{
    std::string path(log_path);
    if(path.empty()) {
        INodeProcess::getCurrentModuleFileName(path);
        path.append("log.txt");
    }
    stopLogService();
    startLogService(path.c_str());
    return 0;
}
LogHelper::~LogHelper()
{
    stopLogService();
}
