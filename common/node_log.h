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

/**
 * Log level definition
 */
enum log_level
{
	LOG_LEVEL_ERROR,
	LOG_LEVEL_WARNING,
	LOG_LEVEL_INFO,
	LOG_LEVEL_VERBOSE
};

bool startLogService(const char *path);

void stopLogService();

void setLogLevel(log_level level);

/**
 * To write log
 * @param level - log level
 * @format - message format
 */
void node_log(enum log_level level, const char *format, ...);

/** write log with error log level */
#define LOG_ERROR(format, ...) node_log(LOG_LEVEL_ERROR, format, ##__VA_ARGS__)

/**
 * write log with warning log level
 */
#define LOG_WARNING(format, ...) node_log(LOG_LEVEL_WARNING, format, ##__VA_ARGS__)

/**
 * write log with info log level
 */
#define LOG_INFO(format, ...) node_log(LOG_LEVEL_INFO, format, ##__VA_ARGS__)

/**
 * write log with verbose log level
 */
#define LOG_VERBOSE(format, ...) node_log(LOG_LEVEL_VERBOSE, format, ##__VA_ARGS__)

/**
 * write function enter log.
 */
#define LOG_ENTER LOG_VERBOSE("==> %s\n", __FUNCTION__)

/**
 * write function leave log.
 */
#define LOG_LEAVE LOG_VERBOSE("<== %s\n", __FUNCTION__)

#endif
