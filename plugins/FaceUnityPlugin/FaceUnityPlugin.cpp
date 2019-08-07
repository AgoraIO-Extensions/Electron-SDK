//
//  FaceUnityPlugin.cpp
//  FaceUnityPlugin
//
//  Created by 张乾泽 on 2019/8/6.
//  Copyright © 2019 Agora Corp. All rights reserved.
//

#include "FaceUnityPlugin.h"
#include <string.h>
#include <dlfcn.h>
#include "funama.h"
#include <OpenGL/OpenGL.h>
#include "FUConfig.h"
#include "Utils.h"
#include <iostream>

#define MAX_PATH 512

static bool mNamaInited = false;
static int mFrameID = 0;
static int mBeautyHandles = 0;

FaceUnityPlugin::FaceUnityPlugin()
{
    
}

FaceUnityPlugin::~FaceUnityPlugin()
{
    
}

bool FaceUnityPlugin::initOpenGL()
{
    CGLPixelFormatAttribute attrib[13] = {kCGLPFAOpenGLProfile,
        (CGLPixelFormatAttribute) kCGLOGLPVersion_Legacy,
        kCGLPFAAccelerated,
        kCGLPFAColorSize, (CGLPixelFormatAttribute)24,
        kCGLPFAAlphaSize, (CGLPixelFormatAttribute)8,
        kCGLPFADoubleBuffer,
        kCGLPFASampleBuffers, (CGLPixelFormatAttribute)1,
        kCGLPFASamples, (CGLPixelFormatAttribute)4,
        (CGLPixelFormatAttribute) 0};
    CGLPixelFormatObj pixelFormat = NULL;
    GLint numPixelFormats = 0;
    CGLContextObj cglContext1 = NULL;
    CGLChoosePixelFormat (attrib, &pixelFormat, &numPixelFormats);
    CGLError err = CGLCreateContext(pixelFormat, NULL, &cglContext1);
    CGLSetCurrentContext(cglContext1);
    if(err) {
        return false;
    }
    return true;
}

unsigned char *FaceUnityPlugin::yuvData(VideoPluginFrame& videoFrame)
{
    int ysize = videoFrame.yStride * videoFrame.height;
    int usize = videoFrame.uStride * videoFrame.height / 2;
    int vsize = videoFrame.vStride * videoFrame.height / 2;
    unsigned char *temp = (unsigned char *)malloc(ysize + usize + vsize);
    
    memcpy(temp, videoFrame.yBuffer, ysize);
    memcpy(temp + ysize, videoFrame.uBuffer, usize);
    memcpy(temp + ysize + usize, videoFrame.vBuffer, vsize);
    return (unsigned char *)temp;
}

int FaceUnityPlugin::yuvSize(VideoPluginFrame& videoFrame)
{
    int ysize = videoFrame.yStride * videoFrame.height;
    int usize = videoFrame.uStride * videoFrame.height / 2;
    int vsize = videoFrame.vStride * videoFrame.height / 2;
    return ysize + usize + vsize;
}

void FaceUnityPlugin::videoFrameData(VideoPluginFrame& videoFrame, unsigned char *yuvData)
{
    int ysize = videoFrame.yStride * videoFrame.height;
    int usize = videoFrame.uStride * videoFrame.height / 2;
    int vsize = videoFrame.vStride * videoFrame.height / 2;
    
    memcpy(videoFrame.yBuffer, yuvData,  ysize);
    memcpy(videoFrame.uBuffer, yuvData + ysize, usize);
    memcpy(videoFrame.vBuffer, yuvData + ysize + usize, vsize);
}

bool FaceUnityPlugin::onPluginRenderVideoFrame(unsigned int uid, VideoPluginFrame *videoFrame)
{
    return true;
}

bool FaceUnityPlugin::onPluginCaptureVideoFrame(VideoPluginFrame *videoFrame)
{
    if(auth_package_size == 0){
        return false;
    }
    do {
        // 1. check if thread changed, if yes, reinit opengl
        // 2. initialize if not yet done
        if (!mNamaInited) {
            //load nama and initialize
            std::string currentPath;
            std::string sub = "agora_node_ext.node";
            int pos;
            pos = currentPath.find(sub);
            if (pos != -1){
                currentPath.replace(pos, sub.length(), "");
            }
            std::string assets_dir = currentPath + assets_dir_name + file_separator;
            std::string g_fuDataDir = assets_dir;
            std::vector<char> v3data;
            if (false == Utils::LoadBundle(g_fuDataDir + g_v3Data, v3data)) {
                break;
            }
            initOpenGL();
            //CheckGLContext();
            fuSetup(reinterpret_cast<float*>(&v3data[0]), v3data.size(), NULL, auth_package, auth_package_size);
            
            std::vector<char> propData;
            if (false == Utils::LoadBundle(g_fuDataDir + g_faceBeautification, propData)) {
                std::cout << "load face beautification data failed." << std::endl;
                break;
            }
            std::cout << "load face beautification data." << std::endl;
            
            mBeautyHandles = fuCreateItemFromPackage(&propData[0], propData.size());
            mNamaInited = true;
        }
        
        
        // 3. beauty params
        // check if options needs to be updated
        if (mNeedUpdateFUOptions) {
            fuItemSetParams(mBeautyHandles, "filter_name", const_cast<char*>(mOptions.filter_name.c_str()));
            fuItemSetParamd(mBeautyHandles, "filter_level", mOptions.filter_level);
            fuItemSetParamd(mBeautyHandles, "color_level", mOptions.color_level);
            fuItemSetParamd(mBeautyHandles, "red_level", mOptions.red_level);
            fuItemSetParamd(mBeautyHandles, "blur_level", mOptions.blur_level);
            fuItemSetParamd(mBeautyHandles, "skin_detect", mOptions.skin_detect);
            fuItemSetParamd(mBeautyHandles, "nonshin_blur_scale", mOptions.nonshin_blur_scale);
            fuItemSetParamd(mBeautyHandles, "heavy_blur", mOptions.heavy_blur);
            fuItemSetParamd(mBeautyHandles, "face_shape", mOptions.face_shape);
            fuItemSetParamd(mBeautyHandles, "face_shape_level", mOptions.face_shape_level);
            fuItemSetParamd(mBeautyHandles, "eye_enlarging", mOptions.eye_enlarging);
            fuItemSetParamd(mBeautyHandles, "cheek_thinning", mOptions.cheek_thinning);
            fuItemSetParamd(mBeautyHandles, "cheek_v", mOptions.cheek_v);
            fuItemSetParamd(mBeautyHandles, "cheek_narrow", mOptions.cheek_narrow);
            fuItemSetParamd(mBeautyHandles, "cheek_small", mOptions.cheek_small);
            fuItemSetParamd(mBeautyHandles, "cheek_oval", mOptions.cheek_oval);
            fuItemSetParamd(mBeautyHandles, "intensity_nose", mOptions.intensity_nose);
            fuItemSetParamd(mBeautyHandles, "intensity_forehead", mOptions.intensity_forehead);
            fuItemSetParamd(mBeautyHandles, "intensity_mouth", mOptions.intensity_mouth);
            fuItemSetParamd(mBeautyHandles, "intensity_chin", mOptions.intensity_chin);
            fuItemSetParamd(mBeautyHandles, "change_frames", mOptions.change_frames);
            fuItemSetParamd(mBeautyHandles, "eye_bright", mOptions.eye_bright);
            fuItemSetParamd(mBeautyHandles, "tooth_whiten", mOptions.tooth_whiten);
            fuItemSetParamd(mBeautyHandles, "is_beauty_on", mOptions.is_beauty_on);
            mNeedUpdateFUOptions = false;
        }
        
        // 4. make it beautiful
        unsigned char *in_ptr = yuvData(*videoFrame);
        int handle[] = { mBeautyHandles };
        int handleSize = sizeof(handle) / sizeof(handle[0]);
        fuRenderItemsEx2(
                         FU_FORMAT_I420_BUFFER, reinterpret_cast<int*>(in_ptr),
                         FU_FORMAT_I420_BUFFER, reinterpret_cast<int*>(in_ptr),
                         videoFrame->width, videoFrame->height,
                         mFrameID, handle, handleSize,
                         NAMA_RENDER_FEATURE_FULL, NULL);
        videoFrameData(*videoFrame, in_ptr);
        delete in_ptr;
    } while(false);
    
    return true;
}

bool FaceUnityPlugin::load(const char *path)
{
    if (strlen(path) == 0)
        return false;
    
    return true;
}

bool FaceUnityPlugin::unLoad()
{
    return true;
}


bool FaceUnityPlugin::enable()
{
    do {
        
    } while (false);
    return true;
}


bool FaceUnityPlugin::disable()
{
    return true;
}


bool FaceUnityPlugin::setBoolParameter(const char *param, bool value)
{
    return true;
}

bool FaceUnityPlugin::setStringParameter(const char *param, const char *value)
{
    std::string strParam = param;
    if (strParam.compare("plugin.fu.authdata") == 0) {
        strcpy(auth_package, value);
        auth_package_size = (int)strlen(value);
        return true;
    }
    return false;
}


void FaceUnityPlugin::release()
{
}
