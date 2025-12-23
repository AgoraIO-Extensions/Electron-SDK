cmake_minimum_required(VERSION 3.9)
set(CMAKE_CXX_STANDARD 14)

# Set cross-compilation toolchain for ARM64 before project()
# This must be done before project() is called
# Check if CMAKE_OSX_ARCHITECTURES is set to arm64 (passed via cmake-js --CDCMAKE_OSX_ARCHITECTURES)
if(CMAKE_OSX_ARCHITECTURES STREQUAL "arm64")
  set(CMAKE_SYSTEM_PROCESSOR "aarch64")
  # Try to find cross-compilation toolchain
  # Only set if not already defined (allows override from command line via --CDCMAKE_C_COMPILER)
  if(NOT DEFINED CMAKE_C_COMPILER)
    find_program(ARM64_C_COMPILER NAMES aarch64-linux-gnu-gcc aarch64-linux-gnu-gcc-9 aarch64-linux-gnu-gcc-10 aarch64-linux-gnu-gcc-11)
    if(ARM64_C_COMPILER)
      set(CMAKE_C_COMPILER ${ARM64_C_COMPILER} CACHE FILEPATH "C compiler" FORCE)
      message(STATUS "Found ARM64 cross-compiler: ${CMAKE_C_COMPILER}")
    else()
      message(WARNING "ARM64 cross-compiler not found. Please install aarch64-linux-gnu-gcc")
    endif()
  endif()
  if(NOT DEFINED CMAKE_CXX_COMPILER)
    find_program(ARM64_CXX_COMPILER NAMES aarch64-linux-gnu-g++ aarch64-linux-gnu-g++-9 aarch64-linux-gnu-g++-10 aarch64-linux-gnu-g++-11)
    if(ARM64_CXX_COMPILER)
      set(CMAKE_CXX_COMPILER ${ARM64_CXX_COMPILER} CACHE FILEPATH "CXX compiler" FORCE)
      message(STATUS "Found ARM64 cross-compiler: ${CMAKE_CXX_COMPILER}")
    else()
      message(WARNING "ARM64 cross-compiler not found. Please install aarch64-linux-gnu-g++")
    endif()
  endif()
  # Set linker to use ARM64 version
  if(NOT DEFINED CMAKE_LINKER)
    find_program(ARM64_LINKER NAMES aarch64-linux-gnu-ld)
    if(ARM64_LINKER)
      set(CMAKE_LINKER ${ARM64_LINKER} CACHE FILEPATH "Linker" FORCE)
      message(STATUS "Found ARM64 linker: ${CMAKE_LINKER}")
    endif()
  endif()
endif()

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
          ${CMAKE_CURRENT_SOURCE_DIR}/native/*_Native_SDK_for_Mac_FULL/libs
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
          ${AGORA_RTC_SDK_PATH}/*_Native_SDK_for_Windows_FULL/sdk/${AGORA_RTC_PROJECT_ARCH}/*.dll
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
  if(${CMAKE_OSX_ARCHITECTURES} STREQUAL "x86")
    set(AGORA_RTC_PROJECT_ARCH "x86")
    set(AGORA_IRIS_PROJECT_ARCH "x86")
    set(AGORA_RTC_SDK_ARCH_DIR "x86")
  elseif(${CMAKE_OSX_ARCHITECTURES} STREQUAL "x86_64")
    set(AGORA_RTC_PROJECT_ARCH "x86_64")
    set(AGORA_IRIS_PROJECT_ARCH "x86_64")
    set(AGORA_RTC_SDK_ARCH_DIR "x86_64")
  elseif(${CMAKE_OSX_ARCHITECTURES} STREQUAL "arm64")
    set(AGORA_RTC_PROJECT_ARCH "arm64")
    set(AGORA_IRIS_PROJECT_ARCH "arm64")
    set(AGORA_RTC_SDK_ARCH_DIR "arm64-v8a")
  endif()

  # native rtc sdk path
  set(AGORA_RTC_SDK_PATH
          ${CMAKE_CURRENT_SOURCE_DIR}/native
          )

  file(GLOB AGORA_RTC_SDK_LIBRARY
          ${AGORA_RTC_SDK_PATH}/*_Native_SDK_for_Linux_FULL/rtc/sdk/${AGORA_RTC_SDK_ARCH_DIR}/*.so
          )

  # iris sdk path
  set(AGORA_IRIS_SDK_PATH
          ${CMAKE_CURRENT_SOURCE_DIR}/iris
          )
  set(AGORA_IRIS_SDK_LIBRARY
          ${AGORA_IRIS_SDK_PATH}/${AGORA_IRIS_PROJECT_ARCH}/Release/*.so
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

    # Get absolute path to libAgoraRtcWrapper.so for linking
    get_filename_component(AGORA_IRIS_SDK_SO_ABS_PATH
            ${AGORA_IRIS_SDK_PATH}/${AGORA_IRIS_PROJECT_ARCH}/Release/libAgoraRtcWrapper.so
            ABSOLUTE
    )
    if(NOT EXISTS ${AGORA_IRIS_SDK_SO_ABS_PATH})
      message(FATAL_ERROR "libAgoraRtcWrapper.so not found at ${AGORA_IRIS_SDK_SO_ABS_PATH}")
    endif()
    message(STATUS "Using libAgoraRtcWrapper.so at: ${AGORA_IRIS_SDK_SO_ABS_PATH}")

    # Create IMPORTED library with IMPORTED_NO_SONAME to make linker use library name only
    # This ensures DT_NEEDED contains "libAgoraRtcWrapper.so" instead of full/relative path
    add_library(libagora_iris_sdk SHARED IMPORTED)
    set_target_properties(
            libagora_iris_sdk
            PROPERTIES
            IMPORTED_LOCATION ${AGORA_IRIS_SDK_SO_ABS_PATH}
            IMPORTED_NO_SONAME TRUE
    )

    add_library(${AGORA_NODE_EXT_NAME} SHARED
            ${COMMON_FILE2}
            ${COMMON_FILE}
            ${COMMON_RAW_DATA_FILE}
            ${TARGET_AGORA_NODE_EXT_FILE}
            ${CMAKE_JS_SRC}
            )
    # Set RPATH to $ORIGIN so runtime can find the library in the same directory as .node file
    set_target_properties(${AGORA_NODE_EXT_NAME} PROPERTIES
            INSTALL_RPATH "\$ORIGIN"
            BUILD_WITH_INSTALL_RPATH TRUE
            LINK_FLAGS "-Wl,-rpath,\$ORIGIN -Wl,--disable-new-dtags"
    )
    target_link_libraries(${AGORA_NODE_EXT_NAME}
            PRIVATE
            libagora_iris_sdk
            ${CMAKE_JS_LIB}
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
  if (${CMAKE_SYSTEM_NAME} STREQUAL "Linux")
    set_target_properties(${AGORA_NODE_EXT_NAME} PROPERTIES
            ARCHIVE_OUTPUT_DIRECTORY "${OUTPUT_DIRECTORY}/${CMAKE_BUILD_TYPE}"
            LIBRARY_OUTPUT_DIRECTORY "${OUTPUT_DIRECTORY}/${CMAKE_BUILD_TYPE}"
            RUNTIME_OUTPUT_DIRECTORY "${OUTPUT_DIRECTORY}/${CMAKE_BUILD_TYPE}"
            PDB_OUTPUT_DIRECTORY "${OUTPUT_DIRECTORY}/${CMAKE_BUILD_TYPE}"
            PREFIX ""
            SUFFIX ".node"
            )
  else()
    set_target_properties(${AGORA_NODE_EXT_NAME} PROPERTIES
            ARCHIVE_OUTPUT_DIRECTORY "${OUTPUT_DIRECTORY}"
            LIBRARY_OUTPUT_DIRECTORY "${OUTPUT_DIRECTORY}"
            RUNTIME_OUTPUT_DIRECTORY "${OUTPUT_DIRECTORY}"
            PDB_OUTPUT_DIRECTORY "${OUTPUT_DIRECTORY}"
            PREFIX ""
            SUFFIX ".node"
            )
  endif()
endfunction(build_target_agora_node_ext)

function(copy_library)
  if (WIN32 OR (UNIX AND NOT APPLE))
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
