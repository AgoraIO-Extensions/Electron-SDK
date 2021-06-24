/*
* Copyright (c) 2017 Agora.io
* All rights reserved.
* Proprietary and Confidential -- Agora.io
*/

/*
*  Created by Wang Yongli, 2017
*/
#ifndef AGORA_NODE_LOG_H
#define AGORA_NODE_LOG_H
#include "loguru.hpp"

bool startLogService(const char *path);

void stopLogService();


/** write log with error log level */
#define LOG_ERROR(format, ...) LOG_F(ERROR, format, ##__VA_ARGS__)

/**
 * write log with warning log level
 */
#define LOG_WARNING(format, ...) LOG_F(WARNING, format, ##__VA_ARGS__)


/**
 * write log with info log level
 */
#define LOG_INFO(format, ...) LOG_F(INFO, format, ##__VA_ARGS__)

/**
 * write log with verbose log level
 */
#define LOG_VERBOSE(format, ...) LOG_F(INFO, format, ##__VA_ARGS__)

/**
 * write function enter log.
 */
#define LOG_ENTER LOG_VERBOSE("==> %s\n", __FUNCTION__)

/**
 * write function leave log.
 */
#define LOG_LEAVE LOG_VERBOSE("<== %s\n", __FUNCTION__)

#endif
