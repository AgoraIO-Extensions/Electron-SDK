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

void copyBmpDataToWindowInfo(CGImageRef image, ScreenWindowInfo& windowInfo)
{
    unsigned int orgWidth = (unsigned int)CGImageGetWidth(image);
    unsigned int orgHeight = (unsigned int)CGImageGetHeight(image);
    unsigned int width;
    unsigned int height;
    if (orgWidth <= MAX_BMP_WIDTH && orgHeight <= MAX_BMP_WIDTH) {
        width = orgWidth;
        height = orgHeight;
    }
    else if (orgWidth >= orgHeight) {
        height = MAX_BMP_WIDTH * orgHeight / orgWidth;
        width = MAX_BMP_WIDTH;
    }
    else {
        width = MAX_BMP_WIDTH * orgWidth / orgHeight;
        height = MAX_BMP_WIDTH;
    }
    
    unsigned int bytesPerPixel = 3;
    unsigned int bytesPerRow = bytesPerPixel * width;
    unsigned int bmpDataLength = bytesPerRow * height;
    
    void *bmpData = calloc(bmpDataLength, sizeof(unsigned char));
    if (bmpData == NULL) {
        LOG_ERROR("Out of memory.");
        return;
    }
    
    CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();
    CGContextRef context = CGBitmapContextCreate(bmpData,
                                                 width,
                                                 height,
                                                 8,     // bits per component
                                                 bytesPerRow,
                                                 colorSpace,
                                                 kCGImageAlphaNone | kCGBitmapByteOrder32Big);
    CGContextDrawImage(context, CGRectMake(0, 0, width, height), image);
    CGContextRelease(context);
    CGColorSpaceRelease(colorSpace);
    
    windowInfo.bmpData = (unsigned char *)bmpData;
    windowInfo.bmpDataLength = bmpDataLength;
    windowInfo.bmpWidth = width;
    windowInfo.bmpHeight = height;
}

std::string convertCFStringToStdString(CFStringRef cfString)
{
    std::string stdString;
    
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
    
//    CGRect bounds = CGRectZero;
//    CFDictionaryRef boundsDic = static_cast<CFDictionaryRef>(CFDictionaryGetValue(windowDic, kCGWindowBounds));
//    if (!CGRectMakeWithDictionaryRepresentation(boundsDic, &bounds)) {
//        LOG_ERROR("Get window bounds fail.");
//        return false;
//    }
//    windowInfo.width = CGRectGetWidth(bounds);
//    windowInfo.height = CGRectGetHeight(bounds);
    
    CFStringRef name = static_cast<CFStringRef>(CFDictionaryGetValue(windowDic, kCGWindowName));
    if (name) {
        windowInfo.name = convertCFStringToStdString(name);
    }
    
    CFStringRef ownerName = static_cast<CFStringRef>(CFDictionaryGetValue(windowDic, kCGWindowOwnerName));
    if (ownerName) {
        windowInfo.ownerName = convertCFStringToStdString(ownerName);
    }
    
    return true;
}

std::vector<ScreenWindowInfo> getAllWindowInfo()
{
    std::vector<ScreenWindowInfo> windows;
    
    CGImageRef fullScreenShot = CGWindowListCreateImage(CGRectInfinite,
                                               kCGWindowListOptionOnScreenOnly,
                                               0,
                                               kCGWindowImageDefault);
    if (fullScreenShot) {
        ScreenWindowInfo fullScreenWindow;
        copyBmpDataToWindowInfo(fullScreenShot, fullScreenWindow);
        windows.push_back(fullScreenWindow);
        
        CGImageRelease(fullScreenShot);
    }
    
    CFArrayRef windowDicCFArray = CGWindowListCopyWindowInfo(kCGWindowListOptionOnScreenOnly | kCGWindowListExcludeDesktopElements,
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
            break;
        }
        
        CGImageRef screenShot = CGWindowListCreateImage(CGRectNull,
                                                        kCGWindowListOptionIncludingWindow,
                                                        screenWindow.windowId,
                                                        kCGWindowImageDefault);
        if (screenShot) {
            copyBmpDataToWindowInfo(screenShot, screenWindow);
            CGImageRelease(screenShot);
        }
        windows.push_back(screenWindow);
    }
    CFRelease(windowDicCFArray);
    
    return windows;
}
