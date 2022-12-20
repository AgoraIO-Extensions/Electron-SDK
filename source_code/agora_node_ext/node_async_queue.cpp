/*
 * @Author: zhangtao@agora.io
 * @Date: 2021-04-22 20:53:10
 * @Last Modified by: zhangtao@agora.io
 * @Last Modified time: 2021-10-10 22:07:54
 */

#include "node_async_queue.h"

namespace agora {
namespace rtc {
namespace electron {

node_async_call node_async_call::s_instance_;

node_async_call::node_async_call() {
  node_queue_.reset(new async_queue<task_type>(
      uv_default_loop(),
      std::bind(&node_async_call::run_task, this, std::placeholders::_1)));
}

node_async_call::~node_async_call() = default;

}// namespace electron
}// namespace rtc
}// namespace agora
