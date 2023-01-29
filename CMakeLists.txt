cmake_minimum_required(VERSION 3.9)
set(CMAKE_CXX_STANDARD 14)

project(agora-electron-sdk)

if (WIN32)
  set(CMAKE_EXE_LINKER_FLAGS_RELEASE "${CMAKE_EXE_LINKER_FLAGS_RELEASE} /DEBUG")
  set(CMAKE_SHARED_LINKER_FLAGS_RELEASE "${CMAKE_SHARED_LINKER_FLAGS_RELEASE} /DEBUG")
  if (MSVC)
    set(CMAKE_C_FLAGS_DEBUG "${CMAKE_C_FLAGS_DEBUG} /MTd /Zi /arch:SSE2")
    set(CMAKE_C_FLAGS_RELEASE "${CMAKE_C_FLAGS_RELEASE} /MT /Zi /arch:SSE2")
    set(CMAKE_CXX_FLAGS_DEBUG "${CMAKE_CXX_FLAGS_DEBUG} /MT /Zi /arch:SSE2")
    set(CMAKE_CXX_FLAGS_RELEASE "${CMAKE_CXX_FLAGS_RELEASE} /MT /Zi /arch:SSE2")
  endif ()
else ()
  set(CMAKE_CXX_FLAGS_RELEASE "${CMAKE_CXX_FLAGS_RELEASE} -g")
endif ()

if (APPLE AND NOT IOS)
  set(CMAKE_XCODE_ATTRIBUTE_MACOSX_DEPLOYMENT_TARGET "10.10")
  set(CMAKE_OSX_DEPLOYMENT_TARGET 10.10)
  set(CMAKE_XCODE_ATTRIBUTE_DEBUG_INFORMATION_FORMAT "dwarf-with-dsym")
elseif (UNIX)
  set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall -fPIC")
  set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -Wall -fPIC")
endif ()

message(STATUS "CMAKE_JS ${CMAKE_JS_INC} ${CMAKE_JS_SRC} ${CMAKE_JS_LIB}")
include_directories(${CMAKE_JS_INC})

set(AGORA_NODE_EXT_NAME agora_node_ext)
set(OUTPUT_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/build)

file(GLOB IRIS_ROOT_PATH ${CMAKE_CURRENT_SOURCE_DIR}/.iris/iris_*)

if (APPLE)
  set(AGORA_RTC_PROJECT_ARCH)
  set(AGORA_IRIS_PROJECT_ARCH MAC)

  set(AGORA_RTC_SDK_PATH ${IRIS_ROOT_PATH}/DCG/Agora_Native_SDK_for_Mac_FULL/libs)
elseif (WIN32)
  if (CMAKE_SIZEOF_VOID_P MATCHES 8)
    set(AGORA_RTC_PROJECT_ARCH "x86_64")
    set(AGORA_IRIS_PROJECT_ARCH "x64")
  else ()
    set(AGORA_RTC_PROJECT_ARCH "x86")
    set(AGORA_IRIS_PROJECT_ARCH "Win32")
  endif ()

  set(AGORA_RTC_SDK_PATH ${IRIS_ROOT_PATH}/DCG/Agora_Native_SDK_for_Windows_FULL/sdk/${AGORA_RTC_PROJECT_ARCH})
endif ()

set(AGORA_IRIS_SDK_PATH ${IRIS_ROOT_PATH}/${AGORA_IRIS_PROJECT_ARCH}/Release)

if (APPLE)
  set(AGORA_RTC_SDK_BIN ${AGORA_RTC_SDK_PATH}/*.framework)
  set(AGORA_IRIS_SDK_BIN ${AGORA_IRIS_SDK_PATH}/*.framework)
  set(AGORA_IRIS_SDK_HEADER_FILE_DIR ${AGORA_IRIS_SDK_PATH}/AgoraRtcWrapper.framework/Headers)
  set(AGORA_IRIS_SDK_LINK "-framework AgoraRtcWrapper")
elseif (WIN32)
  file(GLOB AGORA_RTC_SDK_BIN ${AGORA_RTC_SDK_PATH}/*.dll)
  file(GLOB AGORA_IRIS_SDK_BIN ${AGORA_IRIS_SDK_PATH}/*.dll)
  set(AGORA_IRIS_SDK_HEADER_FILE_DIR ${AGORA_IRIS_SDK_PATH}/../include)
  set(AGORA_IRIS_SDK_LINK ${AGORA_IRIS_SDK_PATH}/AgoraRtcWrapper.lib)
endif ()

message(STATUS "AGORA_RTC_SDK_PATH ${AGORA_RTC_SDK_PATH}")
message(STATUS "AGORA_IRIS_SDK_PATH ${AGORA_IRIS_SDK_PATH}")
message(STATUS "AGORA_IRIS_SDK_HEADER_FILE_DIR ${AGORA_IRIS_SDK_HEADER_FILE_DIR}")
message(STATUS "AGORA_IRIS_SDK_LINK ${AGORA_IRIS_SDK_LINK}")

file(GLOB SOURCE_FILE
        ${CMAKE_CURRENT_SOURCE_DIR}/source_code/**/*.cpp
        )

add_library(${AGORA_NODE_EXT_NAME} SHARED
        ${SOURCE_FILE}
        ${CMAKE_JS_SRC}
        )
target_link_libraries(${AGORA_NODE_EXT_NAME}
        ${AGORA_IRIS_SDK_LINK}
        ${CMAKE_JS_LIB}
        )

target_include_directories(${AGORA_NODE_EXT_NAME} PUBLIC
        ${CMAKE_CURRENT_SOURCE_DIR}/source_code/common
        ${AGORA_IRIS_SDK_HEADER_FILE_DIR}
        )
set_target_properties(${AGORA_NODE_EXT_NAME} PROPERTIES
        ARCHIVE_OUTPUT_DIRECTORY "${OUTPUT_DIRECTORY}"
        LIBRARY_OUTPUT_DIRECTORY "${OUTPUT_DIRECTORY}"
        RUNTIME_OUTPUT_DIRECTORY "${OUTPUT_DIRECTORY}"
        PDB_OUTPUT_DIRECTORY "${OUTPUT_DIRECTORY}"
        PREFIX ""
        SUFFIX ".node"
        )
if (APPLE)
  set_target_properties(${AGORA_NODE_EXT_NAME} PROPERTIES
          CXX_VISIBILITY_PRESET hidden
          LINK_FLAGS "-Wl -F ${AGORA_RTC_SDK_PATH} -F ${AGORA_IRIS_SDK_PATH} -rpath @loader_path"
          )
endif ()

function(copy_library)
  if (APPLE)
    add_custom_command(
            TARGET ${AGORA_NODE_EXT_NAME}
            POST_BUILD
            COMMAND cp -RP
            ${AGORA_RTC_SDK_BIN}
            "$<TARGET_FILE_DIR:${AGORA_NODE_EXT_NAME}>/"
            COMMAND cp -RP
            ${AGORA_IRIS_SDK_BIN}
            "$<TARGET_FILE_DIR:${AGORA_NODE_EXT_NAME}>/"
            COMMAND sh ${CMAKE_CURRENT_SOURCE_DIR}/scripts/remove-arch.sh
            "$<TARGET_FILE_DIR:${AGORA_NODE_EXT_NAME}>/"
            ${CMAKE_OSX_ARCHITECTURES}
    )
  elseif (WIN32)
    add_custom_command(
            TARGET ${AGORA_NODE_EXT_NAME}
            POST_BUILD
            COMMAND ${CMAKE_COMMAND} -E copy
            ${AGORA_RTC_SDK_BIN}
            "$<TARGET_FILE_DIR:${AGORA_NODE_EXT_NAME}>/"
            COMMAND ${CMAKE_COMMAND} -E copy
            ${AGORA_IRIS_SDK_BIN}
            "$<TARGET_FILE_DIR:${AGORA_NODE_EXT_NAME}>/"
    )
  endif ()
endfunction(copy_library)

copy_library()
