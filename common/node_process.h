/*
* Copyright (c) 2018 Agora.io
* All rights reserved.
* Proprietary and Confidential -- Agora.io
*/

/*
*  Created by Wang Yongli, 2018
*/

#ifndef NODE_PROCESS_H
#define NODE_PROCESS_H

#include <functional>
class INodeProcess
{
public:
    virtual ~INodeProcess() {}
    /*
    * To mointor the process event, like if the process exit.
    */
    virtual void Monitor(std::function<void(INodeProcess*)> callback) = 0;

    virtual int GetProcessId() = 0;

    /*
    * To create process according to the path and flag.
    */
    static INodeProcess* CreateNodeProcess(const char* path, const char** params, unsigned int flag = 0);

    static INodeProcess* OpenNodeProcess(int pid);

    static int GetCurrentNodeProcessId();

    /**
    * To destory the process. 
    * @param terminate : If process is live, whether to terminate the process.
    */
    static void DestroyNodeProcess(INodeProcess*, bool terminate = false);

    static bool getCurrentModuleFileName(std::string& path);
};

#endif
