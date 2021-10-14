cmake_minimum_required(VERSION 3.9)
cmake_policy(SET CMP0042 NEW)
set (CMAKE_CXX_STANDARD 11)

project(agora-electron-rtc-sdk)

include_directories(${CMAKE_JS_INC})

message(${CMAKE_JS_INC} === ${CMAKE_JS_SRC})
# library name
set(AGORA_NODE_EXT_NAME agora_node_ext)
set(VIDEO_SOURCE_NAME VideoSource)      

# source code path
set(SOURCE_CODE_PATH 
        ${CMAKE_CURRENT_SOURCE_DIR}/source_code
        )

# common file
set(COMMON_FILE_DIR 
        ${SOURCE_CODE_PATH}/common
        )

file(GLOB COMMON_FILE 
        ${COMMON_FILE_DIR}/*.cpp
        )

set(COMMON_IPC_FILE_DIR 
        ${SOURCE_CODE_PATH}/ipc
        )

file(GLOB COMMON_IPC_FILE 
        ${COMMON_IPC_FILE_DIR}/*.cpp
        )

set(COMMON_PROCESS_FILE_DIR 
        ${SOURCE_CODE_PATH}/process
        )

set(COMMON_WINDOW_INFO_FILE_DIR 
        ${SOURCE_CODE_PATH}/window_Info
        )

set(COMMON_RAW_DATA_FILE_DIR 
        ${SOURCE_CODE_PATH}/raw_data/video_transporter
        )

file(GLOB COMMON_RAW_DATA_FILE 
        ${COMMON_RAW_DATA_FILE_DIR}/*.cpp
        )

# platform file
set(PLATFORM_MAC_FILE 
        ${SOURCE_CODE_PATH}/window_Info/node_screen_window_info_mac.cpp 
        ${SOURCE_CODE_PATH}/process/node_process_unix.cpp
        )

set(PLATFORM_WIN_FILE 
        ${SOURCE_CODE_PATH}/window_Info/node_screen_window_info_win.cpp 
        ${SOURCE_CODE_PATH}/process/node_process_win.cpp
        )

# different target file
set(TARGET_VIDEO_SOURCE_FILE_DIR 
        ${SOURCE_CODE_PATH}/video_source
        )

file(GLOB TARGET_VIDEO_SOURCE_FILE 
        ${TARGET_VIDEO_SOURCE_FILE_DIR}/*.cpp
        )

set(TARGET_AGORA_NODE_EXT_FILE_DIR 
        ${SOURCE_CODE_PATH}/agora_node_ext
        )

file(GLOB TARGET_AGORA_NODE_EXT_FILE 
        ${TARGET_AGORA_NODE_EXT_FILE_DIR}/*.cpp
        )

if(${CMAKE_SYSTEM_NAME} STREQUAL "Darwin") 
        # native rtc sdk path
        set(AGORA_RTC_SDK_PATH 
                ${CMAKE_CURRENT_SOURCE_DIR}/iris/RTC/Agora_Native_SDK_for_Mac_FULL/libs
                )
        # native rtc sdk library
        file(GLOB AGORA_RTC_SDK_LIBRARY 
                ${AGORA_RTC_SDK_PATH}/*.framework
                )

        # iris sdk path
        set(AGORA_IRIS_SDK_PATH 
                ${CMAKE_CURRENT_SOURCE_DIR}/iris/MAC/Release
                )
        # iris sdk library
        file(GLOB AGORA_IRIS_SDK_LIBRARY
                ${AGORA_IRIS_SDK_PATH}/AgoraRtcScreenSharing
                ${AGORA_IRIS_SDK_PATH}/*.framework
                )

        set(AGORA_RTC_SDK_HEADER_FILE_DIR 
                ${AGORA_RTC_SDK_PATH}/AgoraRtcKit.framework/Headers
                )
        # iris sdk include file
        set(AGORA_IRIS_SDK_HEADER_FILE_DIR 
                ${AGORA_IRIS_SDK_PATH}/AgoraRtcWrapper.framework/Headers
                )
        set(AGORA_RTC_FRAMEWORKS
                "-framework AgoraCore"
                "-framework Agorafdkaac"
                "-framework Agoraffmpeg"
                "-framework AgoraRtcKit"
                "-framework AgoraSoundTouch"
                "-framework av1"
                )
        set(AGORA_IRIS_FRAMEWORKS 
                "-framework AgoraRtcWrapper"
                )
        set(SYSTEM_FRAMEWORK 
                "-framework CoreFoundation"
                "-framework CoreGraphics"
                "-framework CoreServices"
                "-framework ImageIO"
                )
elseif(${CMAKE_SYSTEM_NAME} STREQUAL "Windows")
        # # native rtc sdk path
        # set(AGORA_RTC_SDK_PATH ${CMAKE_CURRENT_SOURCE_DIR}/iris/RTC/Agora_Native_SDK_for_Windows_FULL/libs)
        # # iris sdk path
        # set(AGORA_IRIS_SDK_PATH ${CMAKE_CURRENT_SOURCE_DIR}/iris/MAC/Release)
        # # native rtc sdk include file
        # set(AGORA_RTC_SDK_HEADER_FILE_DIR ${AGORA_RTC_SDK_PATH}/AgoraRtcKit.framework/Headers)
        # # iris sdk include file
        # set(AGORA_IRIS_SDK_HEADER_FILE_DIR ${AGORA_IRIS_SDK_PATH}/AgoraRtcWrapper.framework/Headers)

        # if(${CMAKE_SYSTEM_PROCESSOR} STREQUAL "x86")
endif()

function(build_target_agora_node_ext)
        add_library(${AGORA_NODE_EXT_NAME} SHARED 
                ${COMMON_FILE} 
                ${COMMON_IPC_FILE} 
                ${COMMON_RAW_DATA_FILE} 
                ${TARGET_AGORA_NODE_EXT_FILE} 
                ${PLATFORM_MAC_FILE}
                )                                
        target_include_directories(${AGORA_NODE_EXT_NAME} PUBLIC 
                ${NODE_ADDON_API_DIR}
                ${COMMON_FILE_DIR} 
                ${COMMON_IPC_FILE_DIR} 
                ${COMMON_PROCESS_FILE_DIR} 
                ${COMMON_RAW_DATA_FILE_DIR} 
                ${TARGET_AGORA_NODE_EXT_FILE_DIR} 
                ${COMMON_WINDOW_INFO_FILE_DIR} 
                ${AGORA_RTC_SDK_HEADER_FILE_DIR} 
                ${AGORA_IRIS_SDK_HEADER_FILE_DIR}
                )
        set_target_properties(${AGORA_NODE_EXT_NAME} PROPERTIES 
                LIBRARY_OUTPUT_DIRECTORY ${CMAKE_LIBRARY_OUTPUT_DIRECTORY}
                PDB_OUTPUT_DIRECTORY ${CMAKE_LIBRARY_OUTPUT_DIRECTORY}
                PREFIX "" 
                SUFFIX ".node"
                )                
        target_link_libraries(${AGORA_NODE_EXT_NAME}
                )
        if(${CMAKE_SYSTEM_NAME} STREQUAL "Darwin") 
                set_target_properties(${AGORA_NODE_EXT_NAME} PROPERTIES
                        LINK_FLAGS "-Wl -F ${AGORA_RTC_SDK_PATH} -F ${AGORA_IRIS_SDK_PATH} -rpath @loader_path"
                        )
                target_link_libraries(${AGORA_NODE_EXT_NAME} 
                        ${AGORA_RTC_FRAMEWORKS} 
                        ${AGORA_IRIS_FRAMEWORKS} 
                        ${SYSTEM_FRAMEWORK}
                        )
        elseif(${CMAKE_SYSTEM_NAME} STREQUAL "Windows")
        #TODO
        endif()
endfunction(build_target_agora_node_ext)


function(build_target_video_source)
        add_executable(${VIDEO_SOURCE_NAME} 
                ${COMMON_FILE} 
                ${COMMON_IPC_FILE} 
                ${COMMON_RAW_DATA_FILE} 
                ${TARGET_VIDEO_SOURCE_FILE} 
                ${PLATFORM_MAC_FILE}
                )

        target_include_directories(${VIDEO_SOURCE_NAME} PUBLIC 
                ${COMMON_FILE_DIR} 
                ${COMMON_IPC_FILE_DIR} 
                ${COMMON_PROCESS_FILE_DIR} 
                ${COMMON_RAW_DATA_FILE_DIR} 
                ${TARGET_VIDEO_SOURCE_FILE_DIR} 
                ${AGORA_RTC_SDK_HEADER_FILE_DIR} 
                ${AGORA_IRIS_SDK_HEADER_FILE_DIR}
                )

        set_target_properties(${VIDEO_SOURCE_NAME} PROPERTIES 
                RUNTIME_OUTPUT_DIRECTORY ${CMAKE_LIBRARY_OUTPUT_DIRECTORY}
                PDB_OUTPUT_DIRECTORY ${CMAKE_LIBRARY_OUTPUT_DIRECTORY}
                )

        target_link_libraries(${VIDEO_SOURCE_NAME}
                )

        if(${CMAKE_SYSTEM_NAME} STREQUAL "Darwin") 
                set_target_properties(${VIDEO_SOURCE_NAME} PROPERTIES 
                        LINK_FLAGS "-Wl -F ${AGORA_RTC_SDK_PATH} -F ${AGORA_IRIS_SDK_PATH} -rpath @loader_path")

                target_link_libraries(${VIDEO_SOURCE_NAME} 
                        ${AGORA_RTC_FRAMEWORKS} 
                        ${AGORA_IRIS_FRAMEWORKS} 
                        ${SYSTEM_FRAMEWORK}
                        )
        elseif(${CMAKE_SYSTEM_NAME} STREQUAL "Windows")
        #TODO
        endif()        
endfunction(build_target_video_source)

function(copy_library)
        if(${CMAKE_SYSTEM_NAME} STREQUAL "Darwin") 
                #copy native library
                file(COPY ${AGORA_RTC_SDK_LIBRARY} DESTINATION ${CMAKE_LIBRARY_OUTPUT_DIRECTORY}) 
                #copy iris library
                file(COPY ${AGORA_IRIS_SDK_LIBRARY} DESTINATION ${CMAKE_LIBRARY_OUTPUT_DIRECTORY}) 
        elseif(${CMAKE_SYSTEM_NAME} STREQUAL "Windows") 
        #TODO
        endif()
        message("copy native sdk done") 
endfunction(copy_library)

build_target_agora_node_ext()
copy_library()