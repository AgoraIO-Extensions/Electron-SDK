/*
 * Copyright (c) 2017 Agora.io
 * All rights reserved.
 * Proprietary and Confidential -- Agora.io
 */

/*
 *  Created by Wang Yongli, 2017
 */

#ifndef NODE_VIDEO_STREAM_CHANNEL_H
#define NODE_VIDEO_STREAM_CHANNEL_H

#include "agora_rtc_engine.h"
#include <array>
#include <memory>
#include <mutex>
#pragma once

namespace agora {
namespace rtc {
struct NodeRenderContext;

/**
 * NodeVideoStreamChannel is used to transfer video data from SDK to JS layer.
 */
class NodeVideoStreamChannel {
 public:
  NodeVideoStreamChannel(NodeRenderContext *context);
  ~NodeVideoStreamChannel();

  int deliverFrame(const agora::media::IVideoFrame &videoFrame, int rotation,
                   bool mirrored);

 private:
  typedef std::vector<unsigned char> stream_buffer_type;
  std::unique_ptr<NodeRenderContext> m_context;
  stream_buffer_type m_buffer;
  buffer_list buffers;
};
}// namespace rtc
}// namespace agora

#endif
