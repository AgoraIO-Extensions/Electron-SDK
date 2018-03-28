/*
* Copyright (c) 2018 Agora.io
* All rights reserved.
* Proprietary and Confidential -- Agora.io
*/

/*
*  Created by Wang Yongli, 2018
*/


#include "node_event.h"
#include <chrono>

namespace agora {
    namespace rtc {
        NodeEvent::NodeEvent(bool initialState)
            : m_mutex()
            , m_cv()
        {
            m_setState.store(initialState);
        }

        NodeEvent::~NodeEvent()
        {
            m_setState.store(true);
        }

        void NodeEvent::Wait()
        {
            std::unique_lock<std::mutex> lk(m_mutex);
            m_cv.wait(lk, [this] {
                return (bool)this->m_setState;
            });
        }

        NodeEvent::WaitResult NodeEvent::WaitFor(unsigned int ms)
        {
            std::unique_lock<std::mutex> lk(m_mutex);
            bool result = m_cv.wait_for(lk, std::chrono::milliseconds(ms), [this] {
                return (bool)this->m_setState;
            });
            return result ? WAIT_RESULT_SET : WAIT_RESULT_TIMEOUT;
        }

        void NodeEvent::notifyOne()
        {
            std::lock_guard<std::mutex> lock(m_mutex);
            if (!m_setState) {
                m_setState.store(true);
                m_cv.notify_one();
            }
        }

        void NodeEvent::notifyAll()
        {
            std::lock_guard<std::mutex> lock(m_mutex);
            if (!m_setState) {
                m_setState.store(true);
                m_cv.notify_all();
            }
        }

        void NodeEvent::reset()
        {
            std::lock_guard<std::mutex> lock(m_mutex);
            if (!m_setState) {
                m_setState.store(false);
            }
        }
    }
}