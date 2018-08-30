//
//  node_screen_window_info.hpp
//
//  Created by suleyu on 2018/8/8.
//  Copyright © 2018 Agora. All rights reserved.
//

#ifndef AGORA_SCREEN_WINDOW_INFO_H
#define AGORA_SCREEN_WINDOW_INFO_H

#include <string>
#include <vector>

#define    IMAGE_MAX_PIXEL_SIZE   500

struct ScreenWindowInfo
{
#if defined(__APPLE__)
    unsigned int windowId;
#elif defined(_WIN32)
    HWND windowId;
#endif
    
    std::string name;
    std::string ownerName;
    
    unsigned int width;
    unsigned int height;
    
    unsigned char* imageData;
    unsigned int imageDataLength;
    
    ScreenWindowInfo()
    : windowId(0)
    , width(0)
    , height(0)
    , imageData(nullptr)
    , imageDataLength(0)
    {}
};

std::vector<ScreenWindowInfo> getAllWindowInfo();

#endif /* AGORA_SCREEN_WINDOW_INFO_H */
