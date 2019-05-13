/*
* Copyright (c) 2019 Agora.io
* All rights reserved.
* Proprietary and Confidential -- Agora.io
*/

#include "node_video_frame.h"
#include <stdlib.h>
#include <iostream>
#include "funama.h"
#include "FUConfig.h"
#include "Utils.h"
#include <vector>
#include <authpack.h>

#if defined(_WIN32)
#pragma comment(lib, "nama.lib")
#pragma comment(lib, "opengl32.lib")
#pragma comment(lib, "glu32.lib")
#endif

/*
//找到当前目录
FILE *fp = NULL;
 
fp = fopen("./test.txt", "w+");
fprintf(fp, "This is testing for fprintf...\n");
fputs("This is testing for fputs...\n", fp);
fclose(fp);
*/
namespace agora {
    namespace rtc {
        static char* buf = NULL;
        static bool	m_namaInited = false;
        static int mFrameID = 0;
        static int mBeautyHandles = 0;
        #if defined(_WIN32)
        PIXELFORMATDESCRIPTOR pfd = {
            sizeof(PIXELFORMATDESCRIPTOR),
            1u,
            PFD_SUPPORT_OPENGL | PFD_DOUBLEBUFFER | PFD_DRAW_TO_WINDOW,
            PFD_TYPE_RGBA,
            32u,
            0u, 0u, 0u, 0u, 0u, 0u,
            8u,
            0u,
            0u,
            0u, 0u, 0u, 0u,
            24u,
            8u,
            0u,
            PFD_MAIN_PLANE,
            0u,
            0u, 0u };
        void InitOpenGL() {
            HWND hw = CreateWindowExA(
                0, "EDIT", "", ES_READONLY,
                0, 0, 1, 1,
                NULL, NULL,
                GetModuleHandleA(NULL), NULL);
            HDC hgldc = GetDC(hw);
            int spf = ChoosePixelFormat(hgldc, &pfd);
            int ret = SetPixelFormat(hgldc, spf, &pfd);
            HGLRC hglrc = wglCreateContext(hgldc);
            wglMakeCurrent(hgldc, hglrc);

            //hglrc就是创建出的OpenGL context
            printf("hw=%08x hgldc=%08x spf=%d ret=%d hglrc=%08x\n",
                hw, hgldc, spf, ret, hglrc);
        }
        #endif
        NodeVideoFrameObserver::NodeVideoFrameObserver() {
            #if defined(_WIN32)
            InitOpenGL();
            //1.初始化fu
            //读取nama数据库，初始化nama
            std::vector<char> v3data;
            if (false == Utils::LoadBundle(g_fuDataDir + g_v3Data, v3data)) {
                exit(0);
            }
            // CheckGLContext();
            fuSetup(reinterpret_cast<float*>(&v3data[0]), v3data.size(), NULL, g_auth_package, sizeof(g_auth_package));
            //2.配置美颜参数
            //读取美颜道具，设置美颜参数
            std::vector<char> propData;
            if (false == Utils::LoadBundle(g_fuDataDir + g_faceBeautification, propData))
            {
                std::cout << "load face beautification data failed." << std::endl;
                exit(0);
            }
            std::cout << "load face beautification data." << std::endl;

            mBeautyHandles = fuCreateItemFromPackage(&propData[0], propData.size());
            mFrameID = 1;
            fuItemSetParamd(mBeautyHandles, "color_level", 0.5);
            #endif
        }

        NodeVideoFrameObserver::~NodeVideoFrameObserver() {
            fuDestroyAllItems();
        }

        unsigned char *NodeVideoFrameObserver::yuvData(VideoFrame& videoFrame)
        {
            int ysize = videoFrame.yStride * videoFrame.height;
            int usize = videoFrame.uStride * videoFrame.height / 2;
            int vsize = videoFrame.vStride * videoFrame.height / 2;
            unsigned char *temp = (unsigned char *)malloc(ysize + usize + vsize);
            
            memcpy(temp, videoFrame.yBuffer, ysize);
            memcpy(temp + ysize, videoFrame.uBuffer, usize);
            memcpy(temp + ysize + usize, videoFrame.vBuffer, vsize);
            std::cout << "load face beautification data." << std::endl;
            return (unsigned char *)temp;
        }

        int NodeVideoFrameObserver::yuvSize(VideoFrame& videoFrame)
        {
          std::cout << "load face beautification data." << std::endl;
          int ysize = videoFrame.yStride * videoFrame.height;
          int usize = videoFrame.uStride * videoFrame.height / 2;
          int vsize = videoFrame.vStride * videoFrame.height / 2;
          return ysize + usize + vsize;
        }

        void NodeVideoFrameObserver::videoFrameData(VideoFrame& videoFrame, unsigned char *yuvData)
        {
            int ysize = videoFrame.yStride * videoFrame.height;
            int usize = videoFrame.uStride * videoFrame.height / 2;
            int vsize = videoFrame.vStride * videoFrame.height / 2;
            
            memcpy(videoFrame.yBuffer, yuvData,  ysize);
            memcpy(videoFrame.uBuffer, yuvData + ysize, usize);
            memcpy(videoFrame.vBuffer, yuvData + ysize + usize, vsize);
            std::cout << "load face beautification data." << std::endl;
        }
        bool NodeVideoFrameObserver::onCaptureVideoFrame(VideoFrame& videoFrame) {
            if (!m_namaInited)
            {
                #if defined(_WIN32)
                InitOpenGL();
                #endif
                //读取nama数据库，初始化nama
                std::vector<char> v3data;
                if (false == Utils::LoadBundle(g_fuDataDir + g_v3Data, v3data))
                {
                    return false;
                }
                //CheckGLContext();
                fuSetup(reinterpret_cast<float*>(&v3data[0]), v3data.size(), NULL, g_auth_package, sizeof(g_auth_package));

                std::vector<char> propData;
                if (false == Utils::LoadBundle(g_fuDataDir + g_faceBeautification, propData))
                {
                    std::cout << "load face beautification data failed." << std::endl;
                    return false;
                }
                std::cout << "load face beautification data." << std::endl;

                mBeautyHandles = fuCreateItemFromPackage(&propData[0], propData.size());
                fuItemSetParamd(mBeautyHandles, const_cast<char*>(faceBeautyParamName[1].c_str()), 0.7);
                fuItemSetParamd(mBeautyHandles, const_cast<char*>(faceBeautyParamName[0].c_str()), 4.0);
                m_namaInited = true;
            }
            //3.调用美颜接口
            unsigned char *in_ptr = yuvData(videoFrame);
            int size = yuvSize(videoFrame);
            int handle[] = { mBeautyHandles };
            int handleSize = sizeof(handle) / sizeof(handle[0]);
            fuRenderItemsEx2(
                FU_FORMAT_I420_BUFFER, reinterpret_cast<int*>(in_ptr),
                FU_FORMAT_I420_BUFFER, reinterpret_cast<int*>(in_ptr),
                videoFrame.width, videoFrame.height,
                mFrameID, handle, handleSize,
                NAMA_RENDER_FEATURE_FULL, NULL);
            videoFrameData(videoFrame, in_ptr);
            delete in_ptr;
            return true;
        }
        
        bool NodeVideoFrameObserver::onRenderVideoFrame(unsigned int uid, VideoFrame& videoFrame) {
            return true;
        }
    }
}
