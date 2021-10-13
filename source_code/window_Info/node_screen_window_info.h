#pragma once

#include "IAgoraRtcEngine.h"
#include <string>
#include <vector>

#if defined(_WIN32)
#include <windows.h>
#endif
#define IMAGE_MAX_PIXEL_SIZE 500

#if defined(__APPLE__)
struct DisplayID {
  unsigned int idVal;

  DisplayID() : idVal(0) {}
};
typedef DisplayID ScreenIDType;
#elif defined(_WIN32)
typedef agora::rtc::Rectangle ScreenIDType;
#endif

struct ScreenDisplayInfo {
  ScreenIDType displayId;

  std::string name;
  std::string ownerName;

  unsigned int width;
  unsigned int height;
  bool isActive;
  bool isMain;
  bool isBuiltin;

  unsigned char *imageData;
  unsigned int imageDataLength;

  ScreenDisplayInfo()
      : width(0), height(0), isActive(false), isMain(false), isBuiltin(false),
        imageData(nullptr), imageDataLength(0) {}
};

struct ScreenWindowInfo {
#if defined(__APPLE__)
  unsigned int windowId;
#elif defined(_WIN32)
  HWND windowId;
#endif

  std::string name;
  std::string ownerName;
  bool isOnScreen;

  unsigned int width;
  unsigned int height;

  unsigned char *imageData;
  unsigned int imageDataLength;

  unsigned int originWidth;
  unsigned int originHeight;

  ScreenWindowInfo()
      : windowId(0), isOnScreen(false), width(0), height(0), imageData(nullptr),
        imageDataLength(0), originWidth(0), originHeight(0) {}
};

std::vector<ScreenDisplayInfo> getAllDisplayInfo();
std::vector<ScreenWindowInfo> getAllWindowInfo();

#if defined(_WIN32)
void DestroyGdiplus();
#endif
