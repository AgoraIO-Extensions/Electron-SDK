/*
 * Copyright (c) 2017 Agora.io
 * All rights reserved.
 * Proprietry and Confidential -- Agora.io
 */

/*
 *  Created by Wang Yongli, 2017
 */

#include "node_log.h"
#include <stdarg.h>
#include <stdio.h>

using namespace std;

bool startLogService(const char* path) {
  bool res = loguru::add_file(path, loguru::Append, loguru::Verbosity_MAX);
  return res;
}

void stopLogService() {
  loguru::shutdown();
}
