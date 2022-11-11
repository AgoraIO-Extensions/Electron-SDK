#include "win_enumer.h"
#include <Psapi.h>
#include <dwmapi.h>
#include <tchar.h>

namespace agora {
namespace electron {

BOOL WINAPI MonitorEnumCallback(HMONITOR monitor, HDC hdc, LPRECT lprc,
                                LPARAM data) {

  MONITORINFOEX info_ex;
  info_ex.cbSize = sizeof(MONITORINFOEX);

  GetMonitorInfo(monitor, &info_ex);

  // https://jira.agoralab.co/browse/CSD-26297
  // mirror mode or non-active do not return
  if (info_ex.dwFlags == DISPLAY_DEVICE_MIRRORING_DRIVER) return true;

  auto monitors = ((std::list<WindowEnumer::MONITOR_INFO> *) data);

  WindowEnumer::MONITOR_INFO info;
  info.index = monitors->size();
  info.rc = info_ex.rcMonitor;
  info.name = info_ex.szDevice;
  info.is_primary = info_ex.dwFlags & MONITORINFOF_PRIMARY;

  monitors->emplace_back(info);

  return true;
}

std::list<WindowEnumer::MONITOR_INFO> WindowEnumer::EnumAllMonitors() {
  std::list<WindowEnumer::MONITOR_INFO> monitors;

  ::EnumDisplayMonitors(NULL, NULL, MonitorEnumCallback, (LPARAM) &monitors);

  return monitors;
}

WindowEnumer::MONITOR_INFO WindowEnumer::GetMonitorInfoByIndex(int index) {
  auto monitors = EnumAllMonitors();
  for (auto monitor : monitors) {
    if (monitor.index == index) return monitor;
  }

  return {"", {0, 0}, false, -1};
}

BOOL IsInvisibleWin10BackgroundAppWindow(HWND hWnd) {

  HRESULT(__stdcall * pDwmGetWindowAttribute)
  (HWND hwnd, DWORD dwAttribute, PVOID pvAttribute, DWORD cbAttribute) = NULL;
  HINSTANCE hDll = LoadLibrary("Dwmapi.dll");
  if (hDll != NULL) {
    pDwmGetWindowAttribute = (HRESULT(__stdcall *)(
        HWND hwnd, DWORD dwAttribute, PVOID pvAttribute,
        DWORD cbAttribute)) GetProcAddress(hDll, "DwmGetWindowAttribute");
    int CloakedVal = 0;
    HRESULT hRes = pDwmGetWindowAttribute(hWnd, 14 /*DWMWA_CLOAKED*/,
                                          &CloakedVal, sizeof(CloakedVal));
    if (hRes != S_OK) { CloakedVal = 0; }
    return CloakedVal ? true : false;
  }
  return false;
}

BOOL WINAPI WindowEnumCallback(HWND hwnd, LPARAM data) {

  do {
    if (!::IsWindowVisible(hwnd)) break;

    if (IsInvisibleWin10BackgroundAppWindow(hwnd)) break;

    DWORD styles, ex_styles;
    styles = (DWORD) GetWindowLongPtr(hwnd, GWL_STYLE);
    ex_styles = (DWORD) GetWindowLongPtr(hwnd, GWL_EXSTYLE);

    if (ex_styles & WS_EX_TOOLWINDOW) break;
    if (styles & WS_CHILD) break;

    WindowEnumer::WINDOW_INFO info;

    RECT rc;
    ::GetWindowRect(hwnd, &rc);
    if (::IsRectEmpty(&rc)) break;

    TCHAR class_name[MAX_PATH]{0};
    ::GetClassName(hwnd, class_name, MAX_PATH);

    TCHAR window_name[MAX_PATH]{0};
    WCHAR szName[MAX_PATH] = {0};
    ::GetWindowTextW(hwnd, szName, MAX_PATH);

    ::WideCharToMultiByte(CP_UTF8, 0, szName, wcslen(szName), window_name,
                          MAX_PATH, NULL, NULL);
    if (_tcscmp(class_name, "TaskManagerWindow") == 0) break;

    if (_tcscmp(class_name, "Program") == 0
        && _tcscmp(window_name, "Program Manager") == 0)
      break;

    DWORD process_id = 0;
    GetWindowThreadProcessId(hwnd, &process_id);
    if (0 == process_id) break;

    HANDLE process = OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_VM_READ,
                                 FALSE, process_id);
    if (!process) break;

    TCHAR module_name[MAX_PATH]{0};
    DWORD ret = GetModuleFileNameEx(process, NULL, module_name, MAX_PATH - 1);

    CloseHandle(process);

    if (0 == ret) break;

    info.hwnd = hwnd;
    info.class_name = class_name;
    info.window_name = window_name;
    info.module_name = module_name;

    auto windows = (std::list<WindowEnumer::WINDOW_INFO> *) data;
    windows->push_back(info);
  } while (0);

  return TRUE;
}

std::list<WindowEnumer::WINDOW_INFO> WindowEnumer::EnumAllWindows() {
  std::list<WindowEnumer::WINDOW_INFO> windows;
  ::EnumWindows(WindowEnumCallback, (LPARAM) &windows);
  return windows;
}

}// namespace electron
}// namespace agora
