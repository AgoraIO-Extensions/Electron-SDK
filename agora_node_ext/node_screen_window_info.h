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

#define    MAX_BMP_WIDTH   500

struct ScreenWindowInfo
{
#if defined(__APPLE__)
    unsigned int windowId;
#elif defined(_WIN32)
    HWND windowId;
#endif
    
    std::string name;
    std::string ownerName;
    
    unsigned char* bmpData;
    unsigned int bmpDataLength;
    unsigned int bmpWidth;
    unsigned int bmpHeight;
    
    ScreenWindowInfo()
    : windowId(0)
    , bmpData(nullptr)
    , bmpDataLength(0)
    , bmpWidth(0)
    , bmpHeight(0)
    {}
};

std::vector<ScreenWindowInfo> getAllWindowInfo();

#endif /* AGORA_SCREEN_WINDOW_INFO_H */
