#include "log_helper.h"
#include <thread>
#include <mutex>

std::mutex LogHelper::m_tex;
LogHelper *  LogHelper::instance = nullptr;

LogHelper *&LogHelper::getInstance(const char* log_path){
    if (instance == nullptr)
    {
        std::unique_lock<std::mutex> lock(m_tex);
        if (instance == nullptr)
        {
            instance = new (std::nothrow) LogHelper(log_path);
        }
    }
    return instance;
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
