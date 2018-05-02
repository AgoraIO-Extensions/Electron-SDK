/*
* Copyright (c) 2017 Agora.io
* All rights reserved.
* Proprietry and Confidential -- Agora.io
*/

/*
*  Created by Wang Yongli, 2017
*/
#include "node_video_stream_channel.h"
#include "node_video_render.h"
#include <util.h>
#include "node_async_queue.h"
#include "node.h"
#include "node_buffer.h"
#include "v8.h"
#ifndef _WIN32
#include <sys/time.h>
#endif
namespace agora {
    namespace rtc {
        using namespace agora::media;

        NodeVideoStreamChannel::NodeVideoStreamChannel(NodeRenderContext *context)
        {
            m_context.reset(context);
            m_render.store(false);
            LOG_INFO("Create video stream channel for type : %d, uid :%d\n", context->m_type, context->m_uid);
        }

        NodeVideoStreamChannel::~NodeVideoStreamChannel()
        {
            LOG_INFO("%s\n", __FUNCTION__);
            while(this->m_render.load());
        }

        int NodeVideoStreamChannel::deliverFrame(const agora::media::IVideoFrame& videoFrame, int rotation, bool mirrored)
        {
            LOG_ENTER;
            /*if(m_render.load())
                return 0;*/
            auto *pTransporter = getNodeVideoFrameTransporter();
            if (pTransporter) {
                pTransporter->deliverFrame_I420(m_context->m_type, m_context->m_uid, videoFrame, rotation, mirrored);
            }
           /* m_render.store(true);
            int r = deliverFrame_I420(videoFrame, rotation, mirrored, buffers);
            if (!r) {
                node_async_call::async_call([&]() {
                    auto *pTransporter = getNodeVideoFrameTransporter();
                    if(pTransporter) {
                        pTransporter->deliveryFrame(m_context->m_type, m_context->m_uid,buffers);
                    }
                    this->m_render.store(false);
                });
            }
            else {
                LOG_ERROR("deliverFrame i420 failed.");
                m_render.store(false);
            }*/
            LOG_LEAVE;
            return 0;
        }

        int NodeVideoStreamChannel::deliverFrame_I420(const agora::media::IVideoFrame& videoFrame, int rotation, bool mirrored, buffer_list& buffers)
        {
            int stride, stride0 = videoFrame.stride(IVideoFrame::Y_PLANE);
            stride = stride0;
            if (stride & 0xf) {
                stride = (((stride + 15) >> 4) << 4);
            }
            int width = videoFrame.width();
            int height = videoFrame.height();

            rotation = rotation < 0 ? rotation + 360 : rotation;
            size_t imageSize = sizeof(image_header_type) + stride * height * 3 / 2;

            auto s = m_buffer.size();
            if (s < imageSize || s >= imageSize * 2)
                m_buffer.resize(imageSize);
            image_header_type* hdr = reinterpret_cast<image_header_type*>(&m_buffer[0]);
            hdr->mirrored = mirrored ? 1 : 0;
            hdr->rotation = htons(rotation);
            setupFrameHeader(hdr, stride, width, height);
            copyFrame(videoFrame, (unsigned char*)&hdr[1], stride, stride0, width, height, buffers);
            return 0;
        }

        void NodeVideoStreamChannel::setupFrameHeader(image_header_type*header, int stride, int width, int height)
        {
            int left = 0;
            int top = 0;
            header->format = 0;
            header->width = htons(width);
            header->height = htons(height);
            header->left = htons((uint16_t)left);
            header->top = htons((uint16_t)top);
            header->right = htons((uint16_t)(stride - width - left));
            header->bottom = htons((uint16_t)0);
            header->timestamp = 0;
        }

        void NodeVideoStreamChannel::copyFrame(const agora::media::IVideoFrame& videoFrame, unsigned char *buffer, int dest_stride, int src_stride, int width, int height, buffer_list& buffers)
        {
            int width2 = width / 2, heigh2 = height / 2;
            int strideY = videoFrame.stride(IVideoFrame::Y_PLANE);
            int strideU = videoFrame.stride(IVideoFrame::U_PLANE);
            int strideV = videoFrame.stride(IVideoFrame::V_PLANE);

            unsigned char* y = buffer;
            unsigned char* u = y + dest_stride*height;
            unsigned char* v = u + dest_stride / 2 * heigh2;
            const unsigned char* planeY = videoFrame.buffer(IVideoFrame::Y_PLANE);
            const unsigned char* planeU = videoFrame.buffer(IVideoFrame::U_PLANE);
            const unsigned char* planeV = videoFrame.buffer(IVideoFrame::V_PLANE);

            {
                int i;
                for (i = 0; i < heigh2; i++) {
                    memcpy(y + i * dest_stride, planeY + i * strideY, width);
                    memcpy(u + i *dest_stride / 2, planeU + i * strideU, width2);
                    memcpy(v + i * dest_stride / 2, planeV + i * strideV, width2);
                }
                for (; i < height; i++)
                    memcpy(y + i * dest_stride, planeY + i * strideY, width);
            }

            buffers[0].buffer = &m_buffer[0];
            buffers[0].length = sizeof(image_header_type);

            buffers[1].buffer = y;
            buffers[1].length = dest_stride * height;

            buffers[2].buffer = u;
            buffers[2].length = dest_stride / 2 * heigh2;

            buffers[3].buffer = v;
            buffers[3].length = dest_stride / 2 * heigh2;
        }
    }
}
