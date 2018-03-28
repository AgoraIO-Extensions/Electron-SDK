/*
* Copyright (c) 2018 Agora.io
* All rights reserved.
* Proprietry and Confidential -- Agora.io
*/

/*
*  Created by Wang Yongli, 2018
*/

#ifndef AGORA_VIDEO_SOURCE_PARAM_PARSER_H
#define AGORA_VIDEO_SOURCE_PARAM_PARSER_H

#include <string>
#include <unordered_map>
#include <vector>

/**
 * VideoSourceParamParser provide functionality of parse string parameters.
 */
class VideoSourceParamParser
{
public:
    VideoSourceParamParser();
    ~VideoSourceParamParser();

    bool initialize(const std::string& cmdline);
    std::string getParameter(const std::string& param);
    bool hasSwitch(const std::string& param);
private:
    /**
     * m_params contains key-value pairs parameter
     */
    std::unordered_map<std::string, std::string> m_params;
    /**
     * m_switchs contains key-only parameters
     */
    std::vector<std::string> m_switchs;
};

#endif
