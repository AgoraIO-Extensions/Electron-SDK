//
//  FaceUnityPlugin.h
//  FaceUnityPlugin
//
//  Created by 张乾泽 on 2019/8/6.
//  Copyright © 2019 Agora Corp. All rights reserved.
//

#ifndef FaceUnityPlugin_h
#define FaceUnityPlugin_h

#include "IVideoFramePlugin.h"
#include <string>
#include "FUConfig.h"

struct FaceUnityOptions
{
    std::string filter_name;
    double filter_level;
    double color_level;
    double red_level;
    double blur_level;
    double skin_detect;
    double nonshin_blur_scale;
    double heavy_blur;
    double face_shape;
    double face_shape_level;
    double eye_enlarging;
    double cheek_thinning;
    double cheek_v;
    double cheek_narrow;
    double cheek_small;
    double cheek_oval;
    double intensity_nose;
    double intensity_forehead;
    double intensity_mouth;
    double intensity_chin;
    double change_frames;
    double eye_bright;
    double tooth_whiten;
    double is_beauty_on;
    
    FaceUnityOptions()
    : filter_name(default_filter_name)
    , filter_level(default_filter_level)
    , color_level(default_color_level)
    , red_level(default_red_level)
    , blur_level(default_blur_level)
    , skin_detect(default_skin_detect)
    , nonshin_blur_scale(default_nonshin_blur_scale)
    , heavy_blur(default_heavy_blur)
    , face_shape(default_face_shape)
    , face_shape_level(default_face_shape_level)
    , eye_enlarging(default_eye_enlarging)
    , cheek_thinning(default_cheek_thinning)
    , cheek_v(default_cheek_v)
    , cheek_narrow(default_cheek_narrow)
    , cheek_small(default_cheek_small)
    , cheek_oval(default_cheek_oval)
    , intensity_nose(default_intensity_nose)
    , intensity_forehead(default_intensity_forehead)
    , intensity_mouth(default_intensity_mouth)
    , intensity_chin(default_intensity_chin)
    , change_frames(default_change_frames)
    , eye_bright(default_eye_bright)
    , tooth_whiten(default_tooth_whiten)
    , is_beauty_on(default_is_beauty_on)
    {}
};

class FaceUnityPlugin : public IVideoFramePlugin
{
public:
    FaceUnityPlugin();
    ~FaceUnityPlugin();
    virtual bool onPluginCaptureVideoFrame(VideoPluginFrame* videoFrame) override;
    virtual bool onPluginRenderVideoFrame(unsigned int uid, VideoPluginFrame* videoFrame) override;
    
    virtual bool load(const char* path) override;
    virtual bool unLoad() override;
    virtual bool enable() override;
    virtual bool disable() override;
    virtual bool setBoolParameter(const char* param, bool value) override;
    virtual bool setStringParameter(const char* param, const char* value) override;
    virtual void release() override;
protected:
    bool initOpenGL();
    void videoFrameData(VideoPluginFrame& videoFrame, unsigned char *yuvData);
    unsigned char *yuvData(VideoPluginFrame& videoFrame);
    int yuvSize(VideoPluginFrame& videoFrame);
    
    char* auth_package;
    int auth_package_size;
    int videoFrameThreadId;
    FaceUnityOptions mOptions;
    bool mNeedUpdateFUOptions = true;
};

#endif /* FaceUnityPlugin_h */
