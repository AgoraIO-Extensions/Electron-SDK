
#include "loguru.hpp"
#include "node_log.h"
#include "node_screen_window_info.h"
#include <CoreFoundation/CoreFoundation.h>
#include <CoreGraphics/CoreGraphics.h>
#include <CoreServices/CoreServices.h>
#include <ImageIO/ImageIO.h>

void ConvertRGBToBMP(void *srcRGBABuffer, BufferInfo &bufferInfo, int32_t width,
                     int32_t height) {
  CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();
  CGContextRef bitmapContext =
      CGBitmapContextCreate(srcRGBABuffer, width, height,
                            8,        // bitsPerComponent
                            4 * width,// bytesPerRow
                            colorSpace, kCGImageAlphaPremultipliedLast);

  CFRelease(colorSpace);

  CGImageRef cgImage = CGBitmapContextCreateImage(bitmapContext);

  CFMutableDataRef cfImageData = CFDataCreateMutable(NULL, 0);
  CGImageDestinationRef dest =
      CGImageDestinationCreateWithData(cfImageData, kUTTypeBMP, 1, 0);

  CGImageDestinationAddImage(dest, cgImage, 0);

  CFRelease(cgImage);
  CFRelease(bitmapContext);
  CGImageDestinationFinalize(dest);
  CFRelease(dest);

  unsigned int imageDataLength = (unsigned int) CFDataGetLength(cfImageData);
  if (imageDataLength > 0) {
    unsigned char *imageData =
        (unsigned char *) calloc(imageDataLength, sizeof(unsigned char));
    if (imageData == NULL) {
      LOG_ERROR("Out of memory.");
    } else {
      memcpy(imageData, CFDataGetBytePtr(cfImageData), imageDataLength);
      bufferInfo.buffer = imageData;
      bufferInfo.length = imageDataLength;
    }
  }
  CFRelease(cfImageData);
}

void copyImageDataToWindowInfo(CGImageRef image, ScreenWindowInfo &windowInfo) {
  int maxSize = IMAGE_MAX_PIXEL_SIZE;

  CFMutableDataRef cfImageData = CFDataCreateMutable(NULL, 0);
  CGImageDestinationRef destination =
      CGImageDestinationCreateWithData(cfImageData, kUTTypeJPEG, 1, NULL);
  CFMutableDictionaryRef properties = CFDictionaryCreateMutable(
      nil, 0, &kCFTypeDictionaryKeyCallBacks, &kCFTypeDictionaryValueCallBacks);
  CFNumberRef imageMaxSize = CFNumberCreate(NULL, kCFNumberIntType, &maxSize);
  CFDictionarySetValue(properties, kCGImageDestinationImageMaxPixelSize,
                       (CFTypeRef) imageMaxSize);
  CFRelease(imageMaxSize);
  CGImageDestinationAddImage(destination, image, properties);
  CFRelease(properties);
  CGImageDestinationFinalize(destination);
  CFRelease(destination);

  unsigned int imageDataLength = (unsigned int) CFDataGetLength(cfImageData);
  if (imageDataLength > 0) {
    unsigned char *imageData =
        (unsigned char *) calloc(imageDataLength, sizeof(unsigned char));
    if (imageData == NULL) {
      LOG_ERROR("Out of memory.");
    } else {
      memcpy(imageData, CFDataGetBytePtr(cfImageData), imageDataLength);
      windowInfo.imageData = imageData;
      windowInfo.imageDataLength = imageDataLength;
    }
  }
  CFRelease(cfImageData);
}

void copyImageDataToDisplayInfo(CGImageRef image,
                                ScreenDisplayInfo &displayInfo) {
  int maxSize = IMAGE_MAX_PIXEL_SIZE;

  CFMutableDataRef cfImageData = CFDataCreateMutable(NULL, 0);
  CGImageDestinationRef destination =
      CGImageDestinationCreateWithData(cfImageData, kUTTypeJPEG, 1, NULL);
  CFMutableDictionaryRef properties = CFDictionaryCreateMutable(
      nil, 0, &kCFTypeDictionaryKeyCallBacks, &kCFTypeDictionaryValueCallBacks);
  CFNumberRef imageMaxSize = CFNumberCreate(NULL, kCFNumberIntType, &maxSize);
  CFDictionarySetValue(properties, kCGImageDestinationImageMaxPixelSize,
                       (CFTypeRef) imageMaxSize);
  CFRelease(imageMaxSize);
  CGImageDestinationAddImage(destination, image, properties);
  CFRelease(properties);
  CGImageDestinationFinalize(destination);
  CFRelease(destination);

  unsigned int imageDataLength = (unsigned int) CFDataGetLength(cfImageData);
  if (imageDataLength > 0) {
    unsigned char *imageData =
        (unsigned char *) calloc(imageDataLength, sizeof(unsigned char));
    if (imageData == NULL) {
      LOG_ERROR("Out of memory.");
    } else {
      memcpy(imageData, CFDataGetBytePtr(cfImageData), imageDataLength);
      displayInfo.imageData = imageData;
      displayInfo.imageDataLength = imageDataLength;
    }
  }
  CFRelease(cfImageData);
}

std::string convertCFStringToStdString(CFStringRef cfString) {
  std::string stdString;

  CFRange rangeFirstNewLine;
  CFStringRef newString = NULL;
  if (CFStringFindCharacterFromSet(
          cfString, CFCharacterSetGetPredefined(kCFCharacterSetNewline),
          CFRangeMake(0, CFStringGetLength(cfString)), 0, &rangeFirstNewLine)) {
    newString = CFStringCreateWithSubstring(
        NULL, cfString, CFRangeMake(0, rangeFirstNewLine.location));
    cfString = newString;
  }

  const char *cName = CFStringGetCStringPtr(cfString, kCFStringEncodingUTF8);
  if (cName) {
    stdString = std::string(cName);
  } else {
    CFIndex length = CFStringGetLength(cfString);
    if (length > 0) {
      CFIndex maxSize =
          CFStringGetMaximumSizeForEncoding(length, kCFStringEncodingUTF8) + 1;
      char *buffer = (char *) malloc(maxSize);
      if (buffer) {
        if (CFStringGetCString(cfString, buffer, maxSize,
                               kCFStringEncodingUTF8)) {
          stdString = std::string(buffer);
        }
        free(buffer);
      } else {
        LOG_ERROR("Out of memory.");
      }
    }
  }

  if (newString) { CFRelease(newString); }

  return stdString;
}

bool setWindowInfoWithDictionary(ScreenWindowInfo &windowInfo,
                                 CFDictionaryRef windowDic) {
  CGWindowID windowId = 0;
  CFNumberRef windowIdNumber = static_cast<CFNumberRef>(
      CFDictionaryGetValue(windowDic, kCGWindowNumber));
  if (!CFNumberGetValue(windowIdNumber, kCGWindowIDCFNumberType, &windowId)) {
    LOG_ERROR("Get window id fail.");
    return false;
  }
  windowInfo.windowId = windowId;

  CGRect bounds = CGRectZero;
  CFDictionaryRef boundsDic = static_cast<CFDictionaryRef>(
      CFDictionaryGetValue(windowDic, kCGWindowBounds));
  if (!CGRectMakeWithDictionaryRepresentation(boundsDic, &bounds)) {
    LOG_ERROR("Get window bounds fail.");
    return false;
  }

  if (CGRectGetWidth(bounds) <= 96 || CGRectGetHeight(bounds) <= 96) {
    return false;
  }

  windowInfo.width = CGRectGetWidth(bounds);
  windowInfo.height = CGRectGetHeight(bounds);
  windowInfo.x = bounds.origin.x;
  windowInfo.y = bounds.origin.y;

  windowInfo.originWidth = CGRectGetWidth(bounds);
  windowInfo.originHeight = CGRectGetHeight(bounds);

  CFStringRef name =
      static_cast<CFStringRef>(CFDictionaryGetValue(windowDic, kCGWindowName));
  if (name) { windowInfo.name = convertCFStringToStdString(name); }

  CFStringRef ownerName = static_cast<CFStringRef>(
      CFDictionaryGetValue(windowDic, kCGWindowOwnerName));
  if (ownerName) {
    windowInfo.ownerName = convertCFStringToStdString(ownerName);
  }

  CFNumberRef pid = static_cast<CFNumberRef>(
      CFDictionaryGetValue(windowDic, kCGWindowOwnerPID));

  if (pid) {
    int processId = 0;
    CFNumberGetValue(pid, kCFNumberSInt32Type, &processId);
    windowInfo.processId = processId;
  }

  windowInfo.currentProcessId = getpid();
  return true;
}

std::vector<ScreenWindowInfo> getAllWindowInfo() {
  std::vector<ScreenWindowInfo> windows;
  // CFArrayRef windowDicCFArray =
  // CGWindowListCopyWindowInfo(kCGWindowListOptionOnScreenOnly |
  // kCGWindowListExcludeDesktopElements,
  //                                                          kCGNullWindowID);
  CFArrayRef windowDicCFArray = CGWindowListCopyWindowInfo(
      kCGWindowListOptionAll | kCGWindowListExcludeDesktopElements,
      kCGNullWindowID);
  CFIndex count = CFArrayGetCount(windowDicCFArray);
  for (CFIndex index = 0; index < count; index++) {
    CFDictionaryRef windowDic = static_cast<CFDictionaryRef>(
        CFArrayGetValueAtIndex(windowDicCFArray, index));

    // layer == 0
    int layer;
    CFNumberRef layerNumber = static_cast<CFNumberRef>(
        CFDictionaryGetValue(windowDic, kCGWindowLayer));
    if (!CFNumberGetValue(layerNumber, kCFNumberSInt32Type, &layer)
        || layer != 0)
      continue;

    ScreenWindowInfo screenWindow;
    if (!setWindowInfoWithDictionary(screenWindow, windowDic)) continue;

    CFStringRef name = static_cast<CFStringRef>(
        CFDictionaryGetValue(windowDic, kCGWindowName));
    if (name) {
      CFNumberRef sharingStateRef = static_cast<CFNumberRef>(
          CFDictionaryGetValue(windowDic, kCGWindowSharingState));
      if (sharingStateRef) {
        int state = 0;
        CFNumberGetValue(sharingStateRef, kCFNumberSInt32Type, &state);
        if (state == 0) continue;
      }
    }

    CGImageRef screenShot = CGWindowListCreateImage(
        CGRectNull, kCGWindowListOptionIncludingWindow, screenWindow.windowId,
        kCGWindowImageBoundsIgnoreFraming);

    if (!screenShot) continue;

    if (screenShot) {
      copyImageDataToWindowInfo(screenShot, screenWindow);
      CGImageRelease(screenShot);
      windows.push_back(screenWindow);
    }
  }
  CFRelease(windowDicCFArray);

  return windows;
}

std::vector<ScreenDisplayInfo> getAllDisplayInfo() {
  std::vector<ScreenDisplayInfo> displays;
  const int MAX_DISPLAY_NUM = 10;
  CGDirectDisplayID displayIDs[MAX_DISPLAY_NUM];
  u_int32_t displayCount;
  CGGetOnlineDisplayList(MAX_DISPLAY_NUM, displayIDs, &displayCount);

  for (uint32_t index = 0; index < displayCount; index++) {
    CGDirectDisplayID displayID = displayIDs[index];
    ScreenDisplayInfo screenDisplay;
    screenDisplay.displayInfo.idVal = screenDisplay.displayId.idVal = displayID;
    screenDisplay.width = CGDisplayPixelsWide(displayID);
    screenDisplay.height = CGDisplayPixelsHigh(displayID);
    screenDisplay.isActive = CGDisplayIsActive(displayID);
    screenDisplay.isMain = CGDisplayIsMain(displayID);
    screenDisplay.isBuiltin = CGDisplayIsBuiltin(displayID);
    CGRect rect = CGDisplayBounds(displayID);
    screenDisplay.x = rect.origin.x;
    screenDisplay.y = rect.origin.y;
    screenDisplay.width = rect.size.width;
    screenDisplay.height = rect.size.height;

    CGImageRef screenshot = CGDisplayCreateImage(displayID);
    if (screenshot) {
      copyImageDataToDisplayInfo(screenshot, screenDisplay);
      CGImageRelease(screenshot);
    }

    displays.push_back(screenDisplay);
  }
  return displays;
}
