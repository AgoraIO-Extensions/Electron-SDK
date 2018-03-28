/*
* Copyright (c) 2018 Agora.io
* All rights reserved.
* Proprietary and Confidential -- Agora.io
*/

/*
*  Created by Wang Yongli, 2018
*/

#ifndef NODE_EVENT_H
#define NODE_EVENT_H

#include <mutex>
#include <condition_variable>
#include <atomic>
namespace agora {
    namespace rtc {
class NodeEvent
{
public:
    enum WaitResult
    {
        WAIT_RESULT_SET,
        WAIT_RESULT_TIMEOUT
    };
    NodeEvent(bool initialStatus);
    ~NodeEvent();

    void Wait();
    NodeEvent::WaitResult WaitFor(unsigned int ms);

    void notifyOne();
    void notifyAll();

    void reset();

private:
    std::mutex m_mutex;
    std::condition_variable m_cv;
    std::atomic_bool m_setState;
};
    }
}

#endif