/*
 * Copyright (c) 2017 Agora.io
 * All rights reserved.
 * Proprietary and Confidential -- Agora.io
 */

/*
 *  Created by Wang Yongli, 2018
 */

#ifndef log_helper_h
#define log_helper_h

#include "node_log.h"
#include "node_process.h"
#include <string>
#include <thread>
#include <mutex>

class LogHelper
{
public:
    static LogHelper* getInstance(const char* log_path = "");
    static std::mutex m_tex;
    int setAddonLogPath(const char* log_path = "");
    ~LogHelper();
    LogHelper(const LogHelper& helper) = delete;
    LogHelper(LogHelper&& helper) = delete;
    LogHelper& operator = (const LogHelper& helper) = delete;
    LogHelper& operator = (LogHelper&& helper) = delete;
private:
    LogHelper(const char* log_path = "");
};

#endif /* log_helper_h */
