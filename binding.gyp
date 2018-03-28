{
    'targets': [
      {
        'target_name': 'VideoSource',
		'type': 'executable',
		'defines': [
		'UNICODE'
		],
		'include_dirs': [
		'./sdk/include',
        './sdk/include/internal',
		'./common'
		],
		'sources': [
		'./common/ipc_shm.h',
        './common/video_source_ipc.h',
        './common/video_source_ipc.cpp',
        './common/node_log.h',
        './common/node_log.cpp',
        './common/node_process.h',
		'./common/node_error.h',
		'./video_source/video_source.cpp',
		'./video_source/video_source.h',
		'./video_source/video_source_event_handler.cpp',
		'./video_source/video_source_event_handler.h',
		'./video_source/video_source_param_parser.cpp',
		'./video_source/video_source_param_parser.h',
		'./video_source/video_source_render.cpp',
		'./video_source/video_source_render.h',
		'./video_source/video_source_transporter.cpp',
		'./video_source/video_source_transporter.h',
        './sdk/include/IAgoraRtcEngine.h'
		],
		'conditions': [
			[
			'OS=="win"',
			{
                'library_dirs': [
                './sdk/lib/win',
                ],
				'link_settings': {
                    'libraries': [
                        '-lagora_rtc_sdk.lib',
						'-lws2_32.lib'
                    ]
                },
				'link_settings!': [
                        '-liojs.lib',
                ],
                'sources': [
				    './common/node_process_win.cpp'
				],
				'defines!': [
                '_USING_V110_SDK71_',
				'_HAS_EXCEPTIONS=0'
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
                'link_settings': {
                    'libraries': [
                    'libresolv.9.dylib',
                    'AgoraRtcEngineKit.framework',
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
                    'AVFoundation.framework',
                    ]
                },
                'sources': [
				    './common/node_process_unix.cpp'
				],
                'defines!': [
                '_HAS_EXCEPTIONS=0',
                '-std=gnu++14'
                ],
                'xcode_settings': {
                    'MACOSX_DEPLOYMENT_TARGET': '10.13',
                    'FRAMEWORK_SEARCH_PATHS': [
                    './sdk/lib/mac'
                    ]
                },

            }
            ]		]
      },
      {
        'target_name': 'agora_node_ext',
		'include_dirs': [
        './sdk/include',
        './sdk/include/internal',
		'./common'
		],
		'sources': [
		'./common/ipc_shm.h',
		'./common/node_log.cpp',
		'./common/node_log.h',
		'./common/video_source_ipc.cpp',
		'./common/video_source_ipc.h',
		'./common/node_event.h',
		'./common/node_event.cpp',
		'./common/node_process.h',
		'./common/node_error.h',
		'./agora_node_ext/agora_node_ext.cpp',
		'./agora_node_ext/agora_node_ext.h',
		'./agora_node_ext/agora_rtc_engine.cpp',
		'./agora_node_ext/agora_rtc_engine.h',
		'./agora_node_ext/agora_video_source.cpp',
		'./agora_node_ext/agora_video_source.h',
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
		'./agora_node_ext/node_video_stream_channel.h'
		],
		'conditions': [
			[
			'OS=="win"',
			{
                'library_dirs': [
                './sdk/lib/win',
                ],
				'link_settings': {
                    'libraries': [
                        '-lagora_rtc_sdk.lib',
						'-lws2_32.lib',
						'-lRpcrt4.lib'
                    ]
                },
				'defines!': [
                '_USING_V110_SDK71_',
				'_HAS_EXCEPTIONS=0'
				],
                'sources': [
				    './common/node_process_win.cpp',
                    './sdk/include/IAgoraRtcEngine.h',
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
                'link_settings': {
                    'libraries': [
                    'libresolv.9.dylib',
                    'AgoraRtcEngineKit.framework',
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
					'./common/node_process_unix.cpp'
				],
                'defines!': [
                    '_NOEXCEPT',
                    '-std=c++11'
                ],	
                'xcode_settings': {
                    'MACOSX_DEPLOYMENT_TARGET': '10.11',
                    'EXECUTABLE_EXTENSION': 'node',
                    'FRAMEWORK_SEARCH_PATHS': [
                    './sdk/lib/mac'
                    ]
                },
            }
            ]
		]
      },
    ]
  }
