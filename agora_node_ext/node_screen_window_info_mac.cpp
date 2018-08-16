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

# pragma pack(push, 1)
typedef struct s_bitmap_header
{
    // Bitmap file header
    UInt16 fileType;
    UInt32 fileSize;
    UInt16 reserved1;
    UInt16 reserved2;
    UInt32 bitmapOffset;
    
    // DIB Header
    UInt32 headerSize;
    UInt32 width;
    UInt32 height;
    UInt16 colorPlanes;
    UInt16 bitsPerPixel;
    UInt32 compression;
    UInt32 bitmapSize;
    UInt32 horizontalResolution;
    UInt32 verticalResolution;
    UInt32 colorsUsed;
    UInt32 colorsImportant;
} t_bitmap_header;
#pragma pack(pop)

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
    
    unsigned int bytesPerPixel = 4;
    unsigned int bytesPerRow = bytesPerPixel * width;
//    if (bytesPerRow % 4 > 0) {
//        bytesPerRow = (bytesPerRow / 4 + 1) * 4;
//    }
    
    unsigned int bitmapSize = bytesPerRow * height;
    unsigned int bmpDataLength = sizeof(t_bitmap_header) + bitmapSize;
    unsigned char *bmpData = (unsigned char *)calloc(bmpDataLength, sizeof(unsigned char));
    if (bmpData == NULL) {
        LOG_ERROR("Out of memory.");
        return;
    }
    
    t_bitmap_header *header = (t_bitmap_header *)bmpData;
    header->fileType = 0x4D42;
    header->fileSize = bmpDataLength;
    header->bitmapOffset = sizeof(t_bitmap_header);
    header->headerSize = 40;
    header->width = width;
    header->height = height;
    header->colorPlanes = 1;
    header->bitsPerPixel = bytesPerPixel * 8;
    header->compression = 0;
    header->bitmapSize = bitmapSize;
    
    CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();
    CGContextRef context = CGBitmapContextCreate(bmpData + sizeof(t_bitmap_header),
                                                 width,
                                                 height,
                                                 8,     // bits per component
                                                 bytesPerRow,
                                                 colorSpace,
                                                 kCGImageAlphaPremultipliedFirst | kCGBitmapByteOrder32Little);
    CGContextTranslateCTM(context, 0, height);
    CGContextScaleCTM(context, 1.0, -1.0);
    CGContextDrawImage(context, CGRectMake(0, 0, width, height), image);
    CGContextRelease(context);
    CGColorSpaceRelease(colorSpace);
    
    windowInfo.bmpData = bmpData;
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
                                                        kCGWindowImageBoundsIgnoreFraming);
        if (screenShot) {
            copyBmpDataToWindowInfo(screenShot, screenWindow);
            CGImageRelease(screenShot);
        }
        windows.push_back(screenWindow);
    }
    CFRelease(windowDicCFArray);
    
    return windows;
}
