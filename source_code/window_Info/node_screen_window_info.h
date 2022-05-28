#ifndef AGORA_SCREEN_WINDOW_INFO_H
#define AGORA_SCREEN_WINDOW_INFO_H

#include <string>
#include <vector>

#if defined(_WIN32)
#include <windows.h>
#endif
#define IMAGE_MAX_PIXEL_SIZE 500

#if defined(__APPLE__) || defined(__linux__)
struct DisplayID {
  unsigned int idVal;

  DisplayID() : idVal(0) {}
};
typedef DisplayID ScreenIDType;
#elif defined(_WIN32)
typedef agora::rtc::Rectangle ScreenIDType;
#endif

/** The relative location of the region to the screen or window.
 */
struct Rectangle {
  /** The horizontal offset from the top-left corner.
   */
  int x;
  /** The vertical offset from the top-left corner.
   */
  int y;
  /** The width of the region.
   */
  int width;
  /** The height of the region.
   */
  int height;

  Rectangle() : x(0), y(0), width(0), height(0) {}
  Rectangle(int xx, int yy, int ww, int hh) : x(xx), y(yy), width(ww), height(hh) {}
};


typedef struct DisplayInfo {
  DisplayInfo() : idVal(0) {}
  unsigned int idVal;
} DisplayInfo;
struct ScreenDisplayInfo {
  ScreenIDType displayId;
  DisplayInfo displayInfo;

  std::string name;
  std::string ownerName;

  unsigned int width;
  unsigned int height;
  int x;
  int y;
  bool isActive;
  bool isMain;
  bool isBuiltin;

  unsigned char* imageData;
  unsigned int imageDataLength;

  ScreenDisplayInfo()
      : width(0),
        height(0),
        isActive(false),
        isMain(false),
        isBuiltin(false),
        imageData(nullptr),
        imageDataLength(0) {}
};

struct ScreenWindowInfo {
#if defined(__APPLE__) || defined(__linux__)
  unsigned int windowId;
  int processId;
  int currentProcessId;
#elif defined(_WIN32)
  HWND windowId;
  DWORD processId;
  DWORD currentProcessId;
#endif

  std::string name;
  std::string ownerName;

  unsigned int width;
  unsigned int height;
  int x;
  int y;

  unsigned char* imageData;
  unsigned int imageDataLength;

  unsigned int originWidth;
  unsigned int originHeight;

  ScreenWindowInfo()
      : windowId(0),
        width(0),
        height(0),
        imageData(nullptr),
        imageDataLength(0),
        originWidth(0),
        originHeight(0) {}
};

std::vector<ScreenDisplayInfo> getAllDisplayInfo();
std::vector<ScreenWindowInfo> getAllWindowInfo();

#if defined(_WIN32)
void DestroyGdiplus();
#endif

#endif /* AGORA_SCREEN_WINDOW_INFO_H */
