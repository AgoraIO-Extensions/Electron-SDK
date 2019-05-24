/*
* Copyright (c) 2017 Agora.io
* All rights reserved.
* Proprietry and Confidential -- Agora.io
*/

/*
*  Created by Wang Yongli, 2017
*/

#include <stdio.h>
#include <stdarg.h>
#include "node_log.h"

using namespace std;

static FILE* log_stream = nullptr;
static log_level s_level = LOG_LEVEL_INFO;

bool startLogService(const char* path)
{
    if(log_stream)
        return false;
    if(path){
        log_stream = fopen(path, "w");
        return true;
    }
    return false;
}

void stopLogService()
{
    if(log_stream){
        fflush(log_stream);
        fclose(log_stream);
        log_stream = nullptr;
    }
}

void setLogLevel(log_level level)
{
    s_level = level;
}

void node_log(enum log_level level, const char *format, ...)
{
    //
    va_list la;
    va_start(la, format);
    if(!log_stream)
        return;
    if(level > s_level)
        return;
    vfprintf(log_stream, format, la);
    va_end(la);
    fprintf(log_stream, "\n");
    fflush(log_stream);
}
