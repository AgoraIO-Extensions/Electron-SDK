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

include_directories(${CMAKE_JS_INC})
set(BUILD_TYPE ${CMAKE_BUILD_TYPE})

message(====agora_electron_sdk==== build config: build_type=${BUILD_TYPE}, CMAKE_JS_INC==${CMAKE_JS_INC} arch: ${CMAKE_OSX_ARCHITECTURES}, platform: ${CMAKE_SYSTEM_NAME})
# library name
set(AGORA_NODE_EXT_NAME agora_node_ext)
set(OUTPUT_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/build)

message(=====Node js include ===== ${CMAKE_JS_SRC} == lib === ${CMAKE_JS_LIB})

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

# different target file
set(TARGET_AGORA_NODE_EXT_FILE_DIR
        ${SOURCE_CODE_PATH}/agora_node_ext
        )

file(GLOB TARGET_AGORA_NODE_EXT_FILE
        ${TARGET_AGORA_NODE_EXT_FILE_DIR}/*
        )

if (${CMAKE_SYSTEM_NAME} STREQUAL "Darwin")
  set(AGORA_IRIS_PROJECT_ARCH "MAC")
  set(AGORA_RTC_SDK_PATH
          ${CMAKE_CURRENT_SOURCE_DIR}/native/Agora_Native_SDK_for_Mac_FULL/libs
          )
  # native rtc sdk library
  set(AGORA_RTC_SDK_LIBRARY
          ${AGORA_RTC_SDK_PATH}/*.xcframework/macos-arm64_x86_64/*.framework
          )

  # iris sdk path
  set(AGORA_IRIS_SDK_PATH
          ${CMAKE_CURRENT_SOURCE_DIR}/iris/MAC/Release
          )
  # iris sdk library
  set(AGORA_IRIS_SDK_LIBRARY
          ${AGORA_IRIS_SDK_PATH}/*.framework
          )

  # iris sdk include file
  set(AGORA_IRIS_SDK_HEADER_FILE_DIR
          ${AGORA_IRIS_SDK_PATH}/AgoraRtcWrapper.framework/Headers
          )

  set(AGORA_IRIS_FRAMEWORKS
          "-framework AgoraRtcWrapper"
          )
elseif (${CMAKE_SYSTEM_NAME} STREQUAL "Windows")
  if (${CMAKE_OSX_ARCHITECTURES} STREQUAL "i386")
    set(AGORA_RTC_PROJECT_ARCH "x86")
    set(AGORA_IRIS_PROJECT_ARCH "Win32")
    set(AGORA_DCG_SDK_ARCH_FILE_NAME "Win32/Release")
  elseif (${CMAKE_OSX_ARCHITECTURES} STREQUAL "x86_64")
    set(AGORA_RTC_PROJECT_ARCH "x86_64")
    set(AGORA_IRIS_PROJECT_ARCH "x64")
    set(AGORA_DCG_SDK_ARCH_FILE_NAME "x64/Release")
  endif ()

  # native rtc sdk path
  set(AGORA_RTC_SDK_PATH
          ${CMAKE_CURRENT_SOURCE_DIR}/native)

  file(GLOB AGORA_RTC_SDK_LIBRARY
          ${AGORA_RTC_SDK_PATH}/Agora_Native_SDK_for_Windows_FULL/sdk/${AGORA_RTC_PROJECT_ARCH}/*.dll
          )

  # iris sdk path
  set(AGORA_IRIS_SDK_PATH
          ${CMAKE_CURRENT_SOURCE_DIR}/iris
          )
  file(GLOB AGORA_IRIS_SDK_LIB
          ${AGORA_IRIS_SDK_PATH}/${AGORA_DCG_SDK_ARCH_FILE_NAME}/*.lib
          )
  file(GLOB AGORA_IRIS_SDK_LIBRARY
          ${AGORA_IRIS_SDK_PATH}/${AGORA_IRIS_PROJECT_ARCH}/Release/*.dll
          )

  # iris sdk include file
  set(AGORA_IRIS_SDK_HEADER_FILE_DIR
          ${AGORA_IRIS_SDK_PATH}/${AGORA_IRIS_PROJECT_ARCH}/include
          )

  set(AGORA_IRIS_SDK_LIB
          ${AGORA_IRIS_SDK_PATH}/${AGORA_DCG_SDK_ARCH_FILE_NAME}/AgoraRtcWrapper.lib
          )
elseif (${CMAKE_SYSTEM_NAME} STREQUAL "Linux")
  # if(${CMAKE_OSX_ARCHITECTURES} STREQUAL "i386")
  #         set(AGORA_RTC_PROJECT_ARCH "x86")
  #         set(AGORA_IRIS_PROJECT_ARCH "Win32")
  #         elseif(${CMAKE_OSX_ARCHITECTURES} STREQUAL "x86_64")
  #         set(AGORA_RTC_PROJECT_ARCH "x86_64")
  #         set(AGORA_IRIS_PROJECT_ARCH "x64")
  # endif()

  # native rtc sdk path
  set(AGORA_RTC_SDK_PATH
          ${CMAKE_CURRENT_SOURCE_DIR}/iris/RTC/sdk
          )

  set(AGORA_RTC_SDK_LIBRARY
          ${AGORA_RTC_SDK_PATH}/x86_64/*.so
          )

  # iris sdk path
  set(AGORA_IRIS_SDK_PATH
          ${CMAKE_CURRENT_SOURCE_DIR}/iris
          )
  set(AGORA_IRIS_SDK_LIBRARY
          ${AGORA_IRIS_SDK_PATH}/x86_64/*
          )
  # iris sdk include file
  set(AGORA_IRIS_SDK_HEADER_FILE_DIR
          ${AGORA_IRIS_SDK_PATH}/${AGORA_IRIS_PROJECT_ARCH}/include
          )
endif ()
message(=====iris include ===== ${AGORA_IRIS_SDK_HEADER_FILE_DIR})
message(=======iris windows lib= IRIs == ${AGORA_IRIS_SDK_LIB})

file(GLOB COMMON_FILE2
        ${AGORA_IRIS_SDK_HEADER_FILE_DIR}/*.h
        )

function(build_target_agora_node_ext)
  if (${CMAKE_SYSTEM_NAME} STREQUAL "Darwin")
    add_library(${AGORA_NODE_EXT_NAME} SHARED
            ${COMMON_FILE2}
            ${COMMON_FILE}
            ${COMMON_RAW_DATA_FILE}
            ${TARGET_AGORA_NODE_EXT_FILE}
            ${CMAKE_JS_SRC}
            )
    set_target_properties(${AGORA_NODE_EXT_NAME} PROPERTIES
            CXX_VISIBILITY_PRESET hidden
            LINK_FLAGS "-Wl -F ${AGORA_RTC_SDK_PATH} -F ${AGORA_IRIS_SDK_PATH} -rpath @loader_path"
            )
    target_link_libraries(${AGORA_NODE_EXT_NAME}
            ${AGORA_IRIS_FRAMEWORKS}
            ${CMAKE_JS_LIB}
            )
  elseif (${CMAKE_SYSTEM_NAME} STREQUAL "Windows")
    add_library(${AGORA_NODE_EXT_NAME} SHARED
            ${COMMON_FILE}
            ${COMMON_RAW_DATA_FILE}
            ${TARGET_AGORA_NODE_EXT_FILE}
            ${CMAKE_JS_SRC}
            )
    target_link_libraries(${AGORA_NODE_EXT_NAME}
            ${AGORA_IRIS_SDK_LIB}
            ${CMAKE_JS_LIB}
            )
  elseif (${CMAKE_SYSTEM_NAME} STREQUAL "Linux")
    set(CMAKE_BUILD_WITH_INSTALL_RPATH true)
    set(CMAKE_INSTALL_RPATH "\${ORIGIN}")
    message(=======CMAKE_JS_LIB=${CMAKE_JS_LIB} =====origin_path==== ${ORIGIN} === RTC === ${AGORA_RTC_SDK_LIB} == IRIs == ${AGORA_IRIS_SDK_LIB})

    add_library(libagora_iris_sdk SHARED IMPORTED)
    set_target_properties(
            libagora_iris_sdk
            PROPERTIES IMPORTED_LOCATION
            ${AGORA_IRIS_SDK_PATH}/x86_64/libAgoraRtcWrapper.so
    )

    add_library(${AGORA_NODE_EXT_NAME} SHARED
            ${COMMON_FILE2}
            ${COMMON_FILE}
            ${COMMON_RAW_DATA_FILE}
            ${TARGET_AGORA_NODE_EXT_FILE}
            ${CMAKE_JS_SRC}
            )
    target_link_libraries(${AGORA_NODE_EXT_NAME}
            PRIVATE
            libagora_iris_sdk
            )
  endif ()
  target_include_directories(${AGORA_NODE_EXT_NAME} PUBLIC
          ${NODE_ADDON_API_DIR}
          ${COMMON_FILE_DIR}
          ${COMMON_PROCESS_FILE_DIR}
          ${TARGET_AGORA_NODE_EXT_FILE_DIR}
          ${AGORA_RTC_SDK_HEADER_FILE_DIR}
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
endfunction(build_target_agora_node_ext)

function(copy_library)
  if (WIN32)
    add_custom_command(
            TARGET ${AGORA_NODE_EXT_NAME}
            POST_BUILD
            COMMAND ${CMAKE_COMMAND} -E copy
            ${AGORA_RTC_SDK_LIBRARY}
            "$<TARGET_FILE_DIR:${AGORA_NODE_EXT_NAME}>/"
            COMMAND ${CMAKE_COMMAND} -E copy
            ${AGORA_IRIS_SDK_LIBRARY}
            "$<TARGET_FILE_DIR:${AGORA_NODE_EXT_NAME}>/"
    )
  else ()
    add_custom_command(
            TARGET ${AGORA_NODE_EXT_NAME}
            POST_BUILD
            COMMAND cp -RP
            "${AGORA_RTC_SDK_LIBRARY}"
            "$<TARGET_FILE_DIR:${AGORA_NODE_EXT_NAME}>/"
            COMMAND cp -RP
            "${AGORA_IRIS_SDK_LIBRARY}"
            "$<TARGET_FILE_DIR:${AGORA_NODE_EXT_NAME}>/"
    )
  endif ()
endfunction(copy_library)

build_target_agora_node_ext()
copy_library()
