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
#include <string>

bool startLogService(const char* path);

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

class LogHelper {
public:
  LogHelper(const char *name) : name_(name) {
    // write function enter log.
    LOG_INFO("==> %s\n", name_.c_str());
  }
  ~LogHelper() {
    // write function leave log.
    LOG_INFO("<== %s\n", name_.c_str());
  }

private:
  std::string name_;
};

/**
 * write function enter log.
 */
#define LOG_ENTER auto log_helper(std::make_unique<LogHelper>(__FUNCTION__));

#endif
