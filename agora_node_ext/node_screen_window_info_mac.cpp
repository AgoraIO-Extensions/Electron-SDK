//
//  node_screen_window_info.cpp
//
//  Created by suleyu on 2018/8/8.
//  Copyright © 2018 Agora. All rights reserved.
//

#include "node_screen_window_info.h"
#include "node_log.h"
#include <CoreFoundation/CoreFoundation.h>
#include <CoreGraphics/CoreGraphics.h>
#include <CoreServices/CoreServices.h>
#include <ImageIO/ImageIO.h>

void copyImageDataToWindowInfo(CGImageRef image, ScreenWindowInfo& windowInfo)
{
    int maxSize = IMAGE_MAX_PIXEL_SIZE;
    
    CFMutableDataRef cfImageData = CFDataCreateMutable(NULL, 0);
    CGImageDestinationRef destination = CGImageDestinationCreateWithData(cfImageData, kUTTypeJPEG, 1, NULL);
    CFMutableDictionaryRef properties = CFDictionaryCreateMutable(nil, 0, &kCFTypeDictionaryKeyCallBacks,  &kCFTypeDictionaryValueCallBacks);
    CFNumberRef imageMaxSize = CFNumberCreate(NULL, kCFNumberIntType, &maxSize);
    CFDictionarySetValue(properties, kCGImageDestinationImageMaxPixelSize, (CFTypeRef)imageMaxSize);
    CFRelease(imageMaxSize);
    CGImageDestinationAddImage(destination, image, properties);
    CFRelease(properties);
    CGImageDestinationFinalize(destination);
    CFRelease(destination);
    
    unsigned int imageDataLength = (unsigned int)CFDataGetLength(cfImageData);
    if (imageDataLength > 0) {
        unsigned char *imageData = (unsigned char *)calloc(imageDataLength, sizeof(unsigned char));
        if (imageData == NULL) {
            LOG_ERROR("Out of memory.");
        }
        else {
            memcpy(imageData, CFDataGetBytePtr(cfImageData), imageDataLength);
            windowInfo.imageData = imageData;
            windowInfo.imageDataLength = imageDataLength;
        }
    }
    CFRelease(cfImageData);
}

void copyImageDataToDisplayInfo(CGImageRef image, ScreenDisplayInfo& displayInfo)
{
    int maxSize = IMAGE_MAX_PIXEL_SIZE;
    
    CFMutableDataRef cfImageData = CFDataCreateMutable(NULL, 0);
    CGImageDestinationRef destination = CGImageDestinationCreateWithData(cfImageData, kUTTypeJPEG, 1, NULL);
    CFMutableDictionaryRef properties = CFDictionaryCreateMutable(nil, 0, &kCFTypeDictionaryKeyCallBacks,  &kCFTypeDictionaryValueCallBacks);
    CFNumberRef imageMaxSize = CFNumberCreate(NULL, kCFNumberIntType, &maxSize);
    CFDictionarySetValue(properties, kCGImageDestinationImageMaxPixelSize, (CFTypeRef)imageMaxSize);
    CFRelease(imageMaxSize);
    CGImageDestinationAddImage(destination, image, properties);
    CFRelease(properties);
    CGImageDestinationFinalize(destination);
    CFRelease(destination);
    
    unsigned int imageDataLength = (unsigned int)CFDataGetLength(cfImageData);
    if (imageDataLength > 0) {
        unsigned char *imageData = (unsigned char *)calloc(imageDataLength, sizeof(unsigned char));
        if (imageData == NULL) {
            LOG_ERROR("Out of memory.");
        }
        else {
            memcpy(imageData, CFDataGetBytePtr(cfImageData), imageDataLength);
            displayInfo.imageData = imageData;
            displayInfo.imageDataLength = imageDataLength;
        }
    }
    CFRelease(cfImageData);
}

std::string convertCFStringToStdString(CFStringRef cfString)
{
    std::string stdString;
    
    CFRange rangeFirstNewLine;
    CFStringRef newString = NULL;
    if (CFStringFindCharacterFromSet(cfString,
                                     CFCharacterSetGetPredefined(kCFCharacterSetNewline),
                                     CFRangeMake(0, CFStringGetLength(cfString)),
                                     0,
                                     &rangeFirstNewLine)) {
        newString = CFStringCreateWithSubstring(NULL, cfString, CFRangeMake(0, rangeFirstNewLine.location));
        cfString = newString;
    }
    
    const char * cName = CFStringGetCStringPtr(cfString, kCFStringEncodingUTF8);
    if (cName) {
        stdString = std::string(cName);
    }
    else {
        CFIndex length = CFStringGetLength(cfString);
        if (length > 0) {
            CFIndex maxSize = CFStringGetMaximumSizeForEncoding(length, kCFStringEncodingUTF8) + 1;
            char *buffer = (char *)malloc(maxSize);
            if (buffer) {
                if (CFStringGetCString(cfString, buffer, maxSize, kCFStringEncodingUTF8)) {
                    stdString = std::string(buffer);
                }
                free(buffer);
            }
            else {
                LOG_ERROR("Out of memory.");
            }
        }
    }
    
    if (newString) {
        CFRelease(newString);
    }
    
    return stdString;
}

bool setWindowInfoWithDictionary(ScreenWindowInfo& windowInfo, CFDictionaryRef windowDic)
{
    CGWindowID windowId = 0;
    CFNumberRef windowIdNumber = static_cast<CFNumberRef>(CFDictionaryGetValue(windowDic, kCGWindowNumber));
    if (!CFNumberGetValue(windowIdNumber, kCGWindowIDCFNumberType, &windowId)) {
        LOG_ERROR("Get window id fail.");
        return false;
    }
    windowInfo.windowId = windowId;
    
    CGRect bounds = CGRectZero;
    CFDictionaryRef boundsDic = static_cast<CFDictionaryRef>(CFDictionaryGetValue(windowDic, kCGWindowBounds));
    if (!CGRectMakeWithDictionaryRepresentation(boundsDic, &bounds)) {
        LOG_ERROR("Get window bounds fail.");
        return false;
    }
    windowInfo.width = CGRectGetWidth(bounds);
    windowInfo.height = CGRectGetHeight(bounds);
    
    CFStringRef name = static_cast<CFStringRef>(CFDictionaryGetValue(windowDic, kCGWindowName));
    if (name) {
        windowInfo.name = convertCFStringToStdString(name);
    }
    
    CFBooleanRef isOnScreen = static_cast<CFBooleanRef>(CFDictionaryGetValue(windowDic, kCGWindowIsOnscreen));
    if (isOnScreen) {
        windowInfo.isOnScreen = CFBooleanGetValue(isOnScreen);
    }

    CFStringRef ownerName = static_cast<CFStringRef>(CFDictionaryGetValue(windowDic, kCGWindowOwnerName));
    if (ownerName) {
        windowInfo.ownerName = convertCFStringToStdString(ownerName);
    }
    
    return true;
}

std::vector<ScreenWindowInfo> getAllWindowInfo(uint32_t options)
{
    std::vector<ScreenWindowInfo> windows;
    CFArrayRef windowDicCFArray = CGWindowListCopyWindowInfo(
        kCGWindowListOptionAll | kCGWindowListExcludeDesktopElements,
        kCGNullWindowID);
    CFIndex count = CFArrayGetCount(windowDicCFArray);
    for (CFIndex index = 0; index < count; index++) {
        CFDictionaryRef windowDic = static_cast<CFDictionaryRef>(CFArrayGetValueAtIndex(windowDicCFArray, index));
        
        int layer;
        CFNumberRef layerNumber = static_cast<CFNumberRef>(CFDictionaryGetValue(windowDic, kCGWindowLayer));
        if (!CFNumberGetValue(layerNumber, kCFNumberSInt32Type, &layer) || layer != 0) {
            continue;
        }
        
        ScreenWindowInfo screenWindow;
        if (!setWindowInfoWithDictionary(screenWindow, windowDic)) {
          continue;
        }

        CFStringRef name = static_cast<CFStringRef>(
            CFDictionaryGetValue(windowDic, kCGWindowName));
        if (name) {
          CFNumberRef sharingStateRef = static_cast<CFNumberRef>(
              CFDictionaryGetValue(windowDic, kCGWindowSharingState));
          if (sharingStateRef) {
            int state = 0;
            CFNumberGetValue(sharingStateRef, kCFNumberSInt32Type, &state);
            if (state == 0)
              continue;
          }
        }

        CFBooleanRef isOnScreenRef = static_cast<CFBooleanRef>(
            CFDictionaryGetValue(windowDic, kCGWindowIsOnscreen));
        if (isOnScreenRef) {
          bool isOnScreen = CFBooleanGetValue(isOnScreenRef);
          if (isOnScreen == false)
            continue;
        } else {
            continue;
        }

        CFNumberRef alphaRef = static_cast<CFNumberRef>(
            CFDictionaryGetValue(windowDic, kCGWindowAlpha));
        if (alphaRef) {
          CGFloat alpha = 0;
          CFNumberGetValue(alphaRef, kCFNumberFloat64Type, &alpha);
          if (!(alpha > 0))
            continue;
        } else {
          continue;
        }

        CGImageRef screenShot = CGWindowListCreateImage(CGRectNull,
                                                        kCGWindowListOptionIncludingWindow,
                                                        screenWindow.windowId,
                                                        kCGWindowImageBoundsIgnoreFraming);
        if (screenShot) {
            copyImageDataToWindowInfo(screenShot, screenWindow);
            CGImageRelease(screenShot);
        }
        windows.push_back(screenWindow);
    }
    CFRelease(windowDicCFArray);
    
    return windows;
}

std::vector<ScreenDisplayInfo> getAllDisplayInfo()
{
    std::vector<ScreenDisplayInfo> displays;
    const int MAX_DISPLAY_NUM = 10;
    CGDirectDisplayID displayIDs[MAX_DISPLAY_NUM];
    u_int32_t displayCount;
    CGGetOnlineDisplayList(MAX_DISPLAY_NUM, displayIDs, &displayCount);
    
    for (uint32_t index = 0; index < displayCount; index++) {
        CGDirectDisplayID displayID = displayIDs[index];
        ScreenDisplayInfo screenDisplay;
        screenDisplay.displayId.idVal = displayID;
        screenDisplay.width = CGDisplayPixelsWide(displayID);
        screenDisplay.height = CGDisplayPixelsHigh(displayID);
        screenDisplay.isActive = CGDisplayIsActive(displayID);
        screenDisplay.isMain = CGDisplayIsMain(displayID);
        screenDisplay.isBuiltin = CGDisplayIsBuiltin(displayID);
        
        CGImageRef screenshot = CGDisplayCreateImage(displayID);
        if (screenshot) {
            copyImageDataToDisplayInfo(screenshot, screenDisplay);
            CGImageRelease(screenshot);
        }
        
        displays.push_back(screenDisplay);
    }
    return displays;
}
