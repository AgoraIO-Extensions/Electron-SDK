cmake_minimum_required(VERSION 3.9)
set (CMAKE_CXX_STANDARD 11)

project(agora-electron-rtc-sdk)

include_directories(${CMAKE_JS_INC})
set(BUILD_TYPE ${CMAKE_BUILD_TYPE})
if ("${CMAKE_BUILD_TYPE}" STREQUAL "Debug")
    set(IRIS_DEBUG 1)
else ()
    set(IRIS_DEBUG 0)
endif ()
message(STATUS "IRIS_DEBUG ${IRIS_DEBUG}")

message(====agora_electron_sdk==== build config: build_type=${BUILD_TYPE}, arch: ${CMAKE_OSX_ARCHITECTURES}, platform: ${CMAKE_SYSTEM_NAME})
# library name
set(AGORA_NODE_EXT_NAME agora_node_ext)  
set(CMAKE_LIBRARY_OUTPUT_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/build/${BUILD_TYPE})


message(=====Node js include ===== ${CMAKE_JS_SRC} == lib === ${CMAKE_JS_LIB} )

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
        )

set(PLATFORM_WIN_FILE 
        ${SOURCE_CODE_PATH}/window_Info/node_screen_window_info_win.cpp
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
        set(AGORA_IRIS_PROJECT_ARCH "MAC")
        set(AGORA_RTC_SDK_PATH 
                ${CMAKE_CURRENT_SOURCE_DIR}/iris/RTC/Agora_Native_SDK_for_Mac_FULL/libs
                )
        # native rtc sdk library
        file(GLOB AGORA_RTC_SDK_LIBRARY 
                ${AGORA_RTC_SDK_PATH}/*.framework
                )

        # iris sdk path
        set(AGORA_IRIS_SDK_PATH 
                ${CMAKE_CURRENT_SOURCE_DIR}/iris/${AGORA_IRIS_PROJECT_ARCH}/${BUILD_TYPE}
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
        if(${CMAKE_OSX_ARCHITECTURES} STREQUAL "i386")
                set(AGORA_RTC_PROJECT_ARCH "x86")
                set(AGORA_IRIS_PROJECT_ARCH "Win32")
        elseif(${CMAKE_OSX_ARCHITECTURES} STREQUAL "x86_64")
                set(AGORA_RTC_PROJECT_ARCH "x86_64")
                set(AGORA_IRIS_PROJECT_ARCH "x64")
        endif()

        # native rtc sdk path
        set(AGORA_RTC_SDK_PATH 
                ${CMAKE_CURRENT_SOURCE_DIR}/iris/RTC/Agora_Native_SDK_for_Windows_FULL/libs
                )
        file(GLOB AGORA_RTC_SDK_LIB
                ${AGORA_RTC_SDK_PATH}/${AGORA_RTC_PROJECT_ARCH}/*.lib
                )
        file(GLOB AGORA_RTC_SDK_LIBRARY
                ${AGORA_RTC_SDK_PATH}/${AGORA_RTC_PROJECT_ARCH}/*.dll
                )
                # iris sdk path
        set(AGORA_IRIS_SDK_PATH 
                ${CMAKE_CURRENT_SOURCE_DIR}/iris
                )
        file(GLOB AGORA_IRIS_SDK_LIB 
                ${AGORA_IRIS_SDK_PATH}/${AGORA_IRIS_PROJECT_ARCH}/${BUILD_TYPE}/*.lib
                )
        file(GLOB AGORA_IRIS_SDK_LIBRARY
                ${AGORA_IRIS_SDK_PATH}/${AGORA_IRIS_PROJECT_ARCH}/${BUILD_TYPE}/*.dll
                ${AGORA_IRIS_SDK_PATH}/${AGORA_IRIS_PROJECT_ARCH}/${BUILD_TYPE}/*.exe
                )
        if (NOT IRIS_DEBUG)
                if (MSVC)
                message("test add_compile_options")
                        add_compile_options(
                                $<$<CONFIG:>:/MT> #---------|
                                $<$<CONFIG:Debug>:/MTd> #---|-- Statically link the runtime libraries
                                $<$<CONFIG:Release>:/MT> #--|
                        )
                endif ()
        endif ()            
        set(AGORA_RTC_SDK_HEADER_FILE_DIR 
                ${AGORA_RTC_SDK_PATH}/include
                )
        # iris sdk include file
        set(AGORA_IRIS_SDK_HEADER_FILE_DIR 
                ${AGORA_IRIS_SDK_PATH}/${AGORA_IRIS_PROJECT_ARCH}/include
                )
endif()

function(build_target_agora_node_ext)
        if(${CMAKE_SYSTEM_NAME} STREQUAL "Darwin") 
                add_library(${AGORA_NODE_EXT_NAME} SHARED 
                        ${COMMON_FILE} 
                        ${COMMON_IPC_FILE} 
                        ${COMMON_RAW_DATA_FILE} 
                        ${TARGET_AGORA_NODE_EXT_FILE} 
                        ${PLATFORM_MAC_FILE}
                        ${CMAKE_JS_SRC}
                        )
                set_target_properties(${AGORA_NODE_EXT_NAME} PROPERTIES
                        LINK_FLAGS "-Wl -F ${AGORA_RTC_SDK_PATH} -F ${AGORA_IRIS_SDK_PATH} -rpath @loader_path"
                        )
                target_link_libraries(${AGORA_NODE_EXT_NAME} 
                        ${AGORA_RTC_FRAMEWORKS} 
                        ${AGORA_IRIS_FRAMEWORKS} 
                        ${SYSTEM_FRAMEWORK}
                        ${CMAKE_JS_LIB}
                        )
        elseif(${CMAKE_SYSTEM_NAME} STREQUAL "Windows")
                add_library(${AGORA_NODE_EXT_NAME} SHARED 
                        ${COMMON_FILE} 
                        ${COMMON_IPC_FILE} 
                        ${COMMON_RAW_DATA_FILE} 
                        ${TARGET_AGORA_NODE_EXT_FILE} 
                        ${PLATFORM_WIN_FILE}
                        ${CMAKE_JS_SRC}
                        )
                target_link_libraries(${AGORA_NODE_EXT_NAME} 
                        ${AGORA_RTC_SDK_LIB}
                        ${AGORA_IRIS_SDK_LIB}
                        ${CMAKE_JS_LIB}
                        gdiplus.lib
                        Rpcrt4.lib
                        ws2_32.lib
                        )
        message(=======CMAKE_JS_LIB=${CMAKE_JS_LIB} === RTC === ${AGORA_RTC_SDK_LIB} == IRIs == ${AGORA_IRIS_SDK_LIB})
        endif()
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
endfunction(build_target_agora_node_ext)

function(copy_library)
        #copy native library
        file(COPY ${AGORA_RTC_SDK_LIBRARY} DESTINATION ${CMAKE_LIBRARY_OUTPUT_DIRECTORY}) 
        #copy iris library
        file(COPY ${AGORA_IRIS_SDK_LIBRARY} DESTINATION ${CMAKE_LIBRARY_OUTPUT_DIRECTORY})
endfunction(copy_library)

build_target_agora_node_ext()
copy_library()

add_definitions(-DNAPI_VERSION=3)
