#include "windows_system_api.h"

bool haveSetDpi = false;

int SetProcessDpiAwarenessEx() {
#if defined(_WIN32)
  HMODULE shcore = LoadLibraryW(L"SHCore.dll");
  if (shcore) {
    typedef HRESULT*(WINAPI * PFN_SetProcessDpiAwareness)(int);
    PFN_SetProcessDpiAwareness pSetProcessDpiAwareness =
        (PFN_SetProcessDpiAwareness)GetProcAddress(shcore,
                                                   "SetProcessDpiAwareness");
    if (pSetProcessDpiAwareness) {
      constexpr int kPROCESS_PER_MONITOR_DPI_AWARE = 2;
      pSetProcessDpiAwareness(kPROCESS_PER_MONITOR_DPI_AWARE);
      haveSetDpi = true;
    }
    FreeLibrary(shcore);
    shcore = nullptr;
  }
  return 0;
#else
  return -4;
#endif
}