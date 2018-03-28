/*
* Copyright (c) 2018 Agora.io
* All rights reserved.
* Proprietry and Confidential -- Agora.io
*/

/*
*  Created by Wang Yongli, 2018
*/

#include "video_source_param_parser.h"

VideoSourceParamParser::VideoSourceParamParser()
{}

VideoSourceParamParser::~VideoSourceParamParser()
{}

bool VideoSourceParamParser::initialize(const std::string& cmdline)
{
    size_t pos = 0;
    do{
        if (cmdline.empty())
            break;
        size_t tmp = cmdline.find_first_of(" ", pos);
        std::string param = cmdline.substr(pos, tmp - pos);
        size_t tmp2 = param.find_first_of(":");
        if (tmp2 != param.npos){
            m_params[param.substr(0, tmp2)] = param.substr(tmp2 + 1);
        }
        else{
            m_switchs.push_back(param);
        }
        if (tmp == cmdline.npos)
            break;
        pos = tmp + 1;
    } while (true);
    return true;
}

std::string VideoSourceParamParser::getParameter(const std::string& param)
{
    auto it = m_params.find(param);
    if (it != m_params.end()){
        return it->second;
    }
    return nullptr;
}

bool VideoSourceParamParser::hasSwitch(const std::string& param)
{
    for (auto& it : m_switchs){
        if (it == param){
            return true;
        }
    }
    return false;
}