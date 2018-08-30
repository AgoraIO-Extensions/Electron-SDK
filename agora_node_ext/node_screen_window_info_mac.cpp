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
        copyImageDataToWindowInfo(fullScreenShot, fullScreenWindow);
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
