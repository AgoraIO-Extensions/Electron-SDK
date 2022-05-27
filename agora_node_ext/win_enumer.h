#pragma once

#include <list>
#include <map>

#include "node_screen_window_info.h"

#include <gdiplus.h>
#include <gdiplusheaders.h>
#include <unordered_set>
#include <tchar.h>
#include <Psapi.h>
#include <algorithm>

namespace agora {
namespace electron {

class WindowEnumer {
public:

  typedef struct {
    std::string name;
    RECT rc;
    bool is_primary;
    int index;
  }MONITOR_INFO;

  static std::list<MONITOR_INFO> EnumAllMonitors();

  static MONITOR_INFO GetMonitorInfoByIndex(int index);


  typedef struct {
    HWND hwnd;
    std::string window_name;
    std::string class_name;
    std::string module_name;
  }WINDOW_INFO;
  static std::list <WindowEnumer::WINDOW_INFO> EnumAllWindows();
};

}
}
