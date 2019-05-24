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

class LogHelper
{
public:
    LogHelper(const char* log_path = "")
    {
        std::string path(log_path);
        if(path.empty()) {
            INodeProcess::getCurrentModuleFileName(path);
            path.append("log.txt");
        }
        startLogService(path.c_str());
    }
    ~LogHelper()
    {
        stopLogService();
    }
    
    LogHelper(const LogHelper& helper) = delete;
    LogHelper(LogHelper&& helper) = delete;
    LogHelper& operator = (const LogHelper& helper) = delete;
    LogHelper& operator = (LogHelper&& helper) = delete;
};

#endif /* log_helper_h */
