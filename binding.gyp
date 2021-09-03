{
    'target_defaults': {
        'default_configuration': 'Release'
    },
    'targets': [
    {
        'target_name': 'agora_node_ext',
        'include_dirs': [
        './common',
        './common/libyuv/include',
        "<!(node -e \"require('nan')\")"
        ],
        'sources': [
        './common/node_log.cpp',
        './common/node_log.h',
        './common/node_process.h',
        './common/node_error.h',
        './common/loguru.hpp',
        './common/loguru.cpp',
        './agora_node_ext/agora_node_ext.cpp',
        './agora_node_ext/agora_node_ext.h',
        './agora_node_ext/agora_rtc_engine.cpp',
        './agora_node_ext/agora_rtc_engine.h',
        './agora_node_ext/node_async_queue.cpp',
        './agora_node_ext/node_async_queue.h',
        './agora_node_ext/node_event_handler.cpp',
        './agora_node_ext/node_event_handler.h',
        './agora_node_ext/node_napi_api.cpp',
        './agora_node_ext/node_napi_api.h',
        './agora_node_ext/node_uid.h',
        './agora_node_ext/node_video_render.cpp',
        './agora_node_ext/node_video_render.h',
        './agora_node_ext/node_video_stream_channel.cpp',
        './agora_node_ext/node_video_stream_channel.h',
        './agora_node_ext/AVPlugin/IAVFramePlugin.h',
        './agora_node_ext/AVPlugin/IAVFramePluginManager.h',
        './agora_node_ext/AVPlugin/IAVFramePluginManager.cpp',
        './agora_node_ext/node_metadata_observer.h',
        './agora_node_ext/node_metadata_observer.cpp',
        './agora_node_ext/agora_media_player.h',
        './agora_node_ext/agora_media_player.cpp',
        './agora_node_ext/node_media_player_observer.h',
        './agora_node_ext/node_media_player_observer.cpp',
        './common/libyuv/source/compare_common.cc',
        './common/libyuv/source/compare.cc',
        './common/libyuv/source/convert_argb.cc',
        './common/libyuv/source/convert_from_argb.cc',
        './common/libyuv/source/convert_from.cc',
        './common/libyuv/source/convert_jpeg.cc',
        './common/libyuv/source/convert_to_argb.cc',
        './common/libyuv/source/convert_to_i420.cc',
        './common/libyuv/source/convert.cc',
        './common/libyuv/source/cpu_id.cc',
        './common/libyuv/source/mjpeg_decoder.cc',
        './common/libyuv/source/mjpeg_validate.cc',
        './common/libyuv/source/planar_functions.cc',
        './common/libyuv/source/rotate_any.cc',
        './common/libyuv/source/rotate_argb.cc',
        './common/libyuv/source/rotate_common.cc',
        './common/libyuv/source/rotate.cc',
        './common/libyuv/source/row_any.cc',
        './common/libyuv/source/row_common.cc',
        './common/libyuv/source/scale_any.cc',
        './common/libyuv/source/scale_argb.cc',
        './common/libyuv/source/scale_common.cc',
        './common/libyuv/source/scale.cc',
        './common/libyuv/source/video_common.cc'
        ],
        'conditions': [
            [
            'OS=="win"',
            {
                'copies': [{
                    'destination': '<(PRODUCT_DIR)',
                    'files': [
                        './sdk/agora_rtc_sdk.dll',
                        './sdk/libagora-ffmpeg.dll',
                        './sdk/libagora-wgc.dll'
                    ]
                }],
                'library_dirs': [
                    './sdk',
                ],
                'link_settings': {
                    'libraries': [
                        '-lagora_rtc_sdk.dll.lib',
                        '-lws2_32.lib',
                        '-lRpcrt4.lib',
						'-lgdiplus.lib'
                    ]
                },
                'defines!': [
                '_USING_V110_SDK71_',
                '_HAS_EXCEPTIONS=0'
                ],
                'sources': [
                    './common/node_process_win.cpp',
                    './sdk/high_level_api/include/IAgoraRtcEngine.h',
                    './sdk/high_level_api/include/IAgoraMediaEngine.h',
                    './common/libyuv/source/compare_win.cc',
                    './common/libyuv/source/rotate_win.cc',
                    './common/libyuv/source/row_win.cc',
                    './common/libyuv/source/scale_win.cc',
					'./agora_node_ext/node_screen_window_info_win.cpp',
                    './agora_node_ext/node_screen_window_info.h'
                ],
                'include_dirs': [
                './sdk/high_level_api/include',
                './extra/internal'
                ],
                'configurations': {
                    'Release': {
                        'msvs_settings': {
                            'VCCLCompilerTool': {
                                'ExceptionHandling': '0',
                                'AdditionalOptions': [
                                    '/EHsc'
                                ]
                            }
                        }
                    },
                    'Debug': {
                        'msvs_settings': {
                            'VCCLCompilerTool': {
                                'ExceptionHandling': '0',
                                'AdditionalOptions': [
                                    '/EHsc'
                                ]
                            }
                        }
                    }
                }
            }
            ],
            [
            'OS=="mac"',
            {
                'mac_framework_dirs': [
                '../sdk/lib/mac'
                ],
                'copies': [{
                    'destination': '<(PRODUCT_DIR)',
                    'files': [
                        './sdk/lib/mac/AgoraRtcKit.framework',
                        './sdk/lib/mac/Agoraffmpeg.framework'
                    ]
                }],
                'link_settings': {
                    'libraries': [
                    'libresolv.9.dylib',
                    'Accelerate.framework',
                    'AgoraRtcKit.framework',
                    'CoreWLAN.framework',
                    'Cocoa.framework',
                    'VideoToolbox.framework',
                    'SystemConfiguration.framework',
                    'IOKit.framework',
                    'CoreVideo.framework',
                    'CoreMedia.framework',
                    'OpenGL.framework',
                    'CoreGraphics.framework',
                    'CFNetwork.framework',
                    'AudioToolbox.framework',
                    'CoreAudio.framework',
                    'Foundation.framework',
                    'AVFoundation.framework'
                    ]
                },
                'sources': [
                    './common/node_process_unix.cpp',
                    './common/libyuv/source/compare_gcc.cc',
                    './common/libyuv/source/rotate_gcc.cc',
                    './common/libyuv/source/row_gcc.cc',
                    './common/libyuv/source/scale_gcc.cc',
                    './agora_node_ext/node_screen_window_info_mac.cpp',
                    './agora_node_ext/node_screen_window_info.h'
                ],
                'include_dirs': [
                './sdk/lib/mac/AgoraRtcKit.framework/Headers',
                './extra/internal'
                ],
                'defines!': [
                    '_NOEXCEPT',
                    '-std=c++11'
                ],
                'OTHER_CFLAGS' : [
                    '-std=c++11',
                    '-stdlib=libc++',
                    '-fexceptions'
                ],
                'xcode_settings': {
                    'MACOSX_DEPLOYMENT_TARGET': '10.11',
                    'EXECUTABLE_EXTENSION': 'node',
                    'FRAMEWORK_SEARCH_PATHS': [
                    './sdk/lib/mac'
                    ],
                    "DEBUG_INFORMATION_FORMAT": "dwarf-with-dsym"
                },
            }
            ]
        ]
    },
    ]
}
