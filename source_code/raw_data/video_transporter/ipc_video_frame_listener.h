#pragma once
#include "iris_rtc_raw_data.h"
#include "loguru.hpp"
#include <vector>

namespace agora {
namespace rtc {
namespace electron {
class IpcVideoFrameListener {
public:
  struct VideoFrameHeader {
    int _width;
    int _height;
    int _yStride;
  };

  typedef struct VideoFrame {
    VideoFrame()
        : _yBuffer(nullptr), _uBuffer(nullptr), _vBuffer(nullptr),
          _isFresh(false) {}

    ~VideoFrame() { Clear(); }

    void Clear() {
      if (_yBuffer)
        free(_yBuffer);

      if (_uBuffer)
        free(_uBuffer);

      if (_vBuffer)
        free(_vBuffer);
    }

    void ResizeBuffer(VideoFrameHeader *header) {
      Clear();
      _header._width = header->_width;
      _header._height = header->_height;
      _header._yStride = header->_yStride;
      _yBuffer = malloc(_header._yStride * _header._height);
      _uBuffer = malloc(_header._yStride * _header._height / 4);
      _vBuffer = malloc(_header._yStride * _header._height / 4);
    }

    void UpdateBuffer(const char *data) {
      VideoFrameHeader *header = (VideoFrameHeader *)data;
      if (header->_yStride != _header._yStride ||
          header->_height != _header._height ||
          header->_width != _header._width) {
        ResizeBuffer(header);
      }

      void *yBuffer = const_cast<char *>(data) + sizeof(VideoFrameHeader);
      void *uBuffer = const_cast<char *>(data) + sizeof(VideoFrameHeader) +
                      header->_height * header->_yStride;
      void *vBuffer = const_cast<char *>(data) + sizeof(VideoFrameHeader) +
                      header->_height * header->_yStride +
                      header->_height * header->_yStride / 4;

      memcpy(_yBuffer, yBuffer, header->_yStride * header->_height);
      memcpy(_uBuffer, uBuffer, header->_yStride * header->_height / 4);
      memcpy(_vBuffer, vBuffer, header->_yStride * header->_height / 4);
      _isFresh = true;
    }

    bool
    CopyFrame(bool &is_new_frame,
              iris::rtc::IrisRtcVideoFrameObserver::VideoFrame &videoFrame) {
      LOG_F(INFO,
            "VideoProcess::CopyFrame  yStride: %d, height: %d, dstWidth %d, "
            "dstHeight: %d",
            videoFrame.y_stride, videoFrame.height, _header._yStride,
            _header._height);
      if (_isFresh) {
        if (videoFrame.y_stride == _header._yStride &&
            videoFrame.height == _header._height) {
          is_new_frame = _isFresh;
          videoFrame.width = _header._width;
          memcpy(videoFrame.y_buffer, _yBuffer,
                 _header._yStride * _header._height);
          memcpy(videoFrame.u_buffer, _uBuffer,
                 _header._yStride * _header._height / 4);
          memcpy(videoFrame.v_buffer, _vBuffer,
                 _header._yStride * _header._height / 4);
          return _isFresh;
        }
        return false;
      }
      return _isFresh;
    }

    VideoFrameHeader _header;
    void *_yBuffer;
    void *_uBuffer;
    void *_vBuffer;
    bool _isFresh;
  } VideoFrame;

  virtual void OnVideoFrameReceived(const char *data, int len) = 0;
};
} // namespace electron
} // namespace rtc
} // namespace agora