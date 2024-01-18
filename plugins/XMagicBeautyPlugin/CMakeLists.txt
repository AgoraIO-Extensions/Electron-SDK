# Set minimum verison of cmake to 3.10.
cmake_minimum_required(VERSION 3.10)

# Recognize ``TEST`` as a operator for the ``if()`` command.
if(POLICY CMP0064)
    cmake_policy(SET CMP0064 NEW)
endif(POLICY CMP0064)

# ``MACOSX_RPATH`` is enabled by default.
if(POLICY CMP0042)
    cmake_policy(SET CMP0042 NEW)
endif(POLICY CMP0042)

# Compiler id for Apple Clang is now ``AppleClang``
if(POLICY CMP0025)
    cmake_policy(SET CMP0025 NEW)
endif(POLICY CMP0025)

# Import toolchain files.
list(APPEND CMAKE_MODULE_PATH "${CMAKE_HOME_DIRECTORY}/cmake")
include(download)

# Enable folders.
set_property(GLOBAL PROPERTY USE_FOLDERS ON)

project(XMagicBeauty)

message(STATUS "[XMagicBeauty] configuring...")

# CMAKE_SYSTEM_NAME only be set after project defined.
message(STATUS "[XMagicBeauty] current system name ${CMAKE_SYSTEM_NAME}")
message(STATUS "[XMagicBeauty] current host system name ${CMAKE_HOST_SYSTEM_NAME}")
message(STATUS "[XMagicBeauty] current host variables APPLE:${APPLE} IOS:${IOS} ANDROID:${ANDROID} WIN32:${WIN32} MACOS:${MACOS}")

# Determine whether current system or target system is supported or not.
if(NOT MACOS AND NOT WIN32)
    message(FATAL_ERROR "[XMagicBeauty] current target system ${CMAKE_SYSTEM_NAME} is not supported for now")
endif()

# Note This variable is only available after compiler detection has been performed,
# so it is not available to toolchain files or before the first project() or enable_language()
# call which uses an MSVC-like compiler.
if(WIN32 AND NOT MSVC)
    message(FATAL_ERROR "[XMagicBeauty] build for Windows is only supported with MSVC for now")
endif()

# Reuqire C++14.
set(CMAKE_CXX_STANDARD 14)

# Preset flags for compiler.
# default set optimize level to O3
# macos O3
# windows O2
# android Oz
# ios Oz
if(WIN32)
    set(CMAKE_EXE_LINKER_FLAGS_RELEASE "${CMAKE_EXE_LINKER_FLAGS_RELEASE} /DEBUG")
    set(CMAKE_SHARED_LINKER_FLAGS_RELEASE "${CMAKE_SHARED_LINKER_FLAGS_RELEASE} /DEBUG")

    # /wd is used to disable specific warning messages.
    # /wo is used to treat specific warning messages as errors.
    # /we is used to treat all warnings as errors.
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} 
        /wo4018 
        /wo4244
        /wo4251 
        /wo4275 
        /we4033 
        /we4700 
        /wd26812 
        /wd4996 
        /wd4819 
        /wd26495 
        /wd4275 
        /wd26439 
        /wd26498 
        /wd6285 
        /wd26451
        /wd28020
        /wd26437
    ")
    set(CMAKE_C_FLAGS_DEBUG "${CMAKE_C_FLAGS_DEBUG} /MT /Zi /arch:SSE2")
    set(CMAKE_C_FLAGS_RELEASE "${CMAKE_C_FLAGS_RELEASE} /MT /Zi /arch:SSE2")
    set(CMAKE_CXX_FLAGS_DEBUG "${CMAKE_CXX_FLAGS_DEBUG} /MT /Zi /arch:SSE2")
    set(CMAKE_CXX_FLAGS_RELEASE "${CMAKE_CXX_FLAGS_RELEASE} /MT /Zi /arch:SSE2")
elseif(UNIX)
    set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -g -ggdb -Wall -O3 -fPIC -Wno-error=deprecated-declarations -Wno-deprecated-declarations -Werror=uninitialized -Werror=return-type -Wno-reorder")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -g -std=c++14 -ggdb -Wall -O3 -fPIC -Wno-error=deprecated-declarations -Wno-deprecated-declarations -Werror=uninitialized -Werror=return-type -Wno-reorder -Wno-unused-function")
    set(CMAKE_CXX_FLAGS_DEBUG "${CMAKE_CXX_FLAGS_DEBUG} -O0")
endif()

if(MACOS)
    set(CMAKE_CXX_FLAGS_RELEASE "${CMAKE_CXX_FLAGS_RELEASE} -O3")
    set(CMAKE_XCODE_ATTRIBUTE_MACOSX_DEPLOYMENT_TARGET "10.10")
    set(CMAKE_XCODE_ATTRIBUTE_DEBUG_INFORMATION_FORMAT "dwarf-with-dsym")
elseif(IOS)
    set(CMAKE_CXX_FLAGS_RELEASE "${CMAKE_CXX_FLAGS_RELEASE} -Oz")
elseif(ANDROID)
    set(CMAKE_CXX_FLAGS_RELEASE "${CMAKE_CXX_FLAGS_RELEASE} -Oz")
endif()

# Download sdk
DOWNLOAD_SDK()

# Define project
set(PLUGIN plugin)
set(PLUGIN_VERSION "1.0.0")
set(PLUGIN_OUTPUT_DIR "")
set(PLUGIN_OUTPUT_DIR "${CMAKE_BINARY_DIR}/output")
set(PLUGIN_OUTPUT_DIR_WITH_TYPE "${PLUGIN_OUTPUT_DIR}/${CMAKE_BUILD_TYPE}")
set(PLUGIN_OUTPUT_NAME agora-xmagic-plugin)

message(STATUS "[XMagicBeauty] PLUGIN_OUTPUT_DIR: ${PLUGIN_OUTPUT_DIR}")
message(STATUS "[XMagicBeauty] PLUGIN_OUTPUT_DIR_WITH_TYPE: ${PLUGIN_OUTPUT_DIR_WITH_TYPE}")
message(STATUS "[XMagicBeauty] PLUGIN_OUTPUT_NAME: ${PLUGIN_OUTPUT_NAME}")

# Define plugin source files
set(PLUGIN_SOURCE)

if(WIN32)
    file(GLOB_RECURSE PLUGIN_SRCS "${CMAKE_CURRENT_LIST_DIR}/src/win/**")
elseif(MACOS)
    file(GLOB_RECURSE PLUGIN_SRCS "${CMAKE_CURRENT_LIST_DIR}/src/macos/**")
endif()

file(GLOB_RECURSE PLUGIN_INCLUDES "${CMAKE_CURRENT_LIST_DIR}/src/include/**")
list(APPEND PLUGIN_SOURCE ${PLUGIN_SRCS} ${PLUGIN_INCLUDES})

message(STATUS "[XMagicBeauty] PLUGIN_SOURCE: ${PLUGIN_SOURCE}")

# Make source files group
source_group(TREE ${CMAKE_HOME_DIRECTORY} FILES ${PLUGIN_SOURCE})

# Define plugin include directories
set(PLUGIN_INCLUDE_DIRECTORIES)
list(APPEND PLUGIN_INCLUDE_DIRECTORIES
    "${CMAKE_CURRENT_LIST_DIR}/src/include"
    "${CMAKE_CURRENT_LIST_DIR}/../../agora_node_ext/AVPlugin"
    ${SDK_INCLUDE_DIR})

# Add sdk lib folder
link_directories(${SDK_LIB_DIR})

# Define target
add_library(${PLUGIN} SHARED ${PLUGIN_SOURCE})

# Compile options
target_include_directories(${PLUGIN} PUBLIC
    "$<BUILD_INTERFACE:${PLUGIN_INCLUDE_DIRECTORIES}>"
    "$<INSTALL_INTERFACE:$<INSTALL_PREFIX>/${CMAKE_INSTALL_INCLUDEDIR}>"
)
set_target_properties(${PLUGIN} PROPERTIES
    VERSION "${PLUGIN_VERSION}"
    SOVERSION "${PLUGIN_VERSION}"
    ARCHIVE_OUTPUT_DIRECTORY "${PLUGIN_OUTPUT_DIR}"
    LIBRARY_OUTPUT_DIRECTORY "${PLUGIN_OUTPUT_DIR}"
    RUNTIME_OUTPUT_DIRECTORY "${PLUGIN_OUTPUT_DIR}"
    PDB_OUTPUT_DIRECTORY "${PLUGIN_OUTPUT_DIR}"
    OUTPUT_NAME "${PLUGIN_OUTPUT_NAME}"
)

if(APPLE)
    set(PLUGIN_IDENTIFIER_PREFIX "io.agora.plugin")
    set(PLUGIN_WRAPPER_IDENTIFIER "${PLUGIN_IDENTIFIER_PREFIX}.xmagic")
    list(APPEND PLUGIN_FRAMEWORKS "-framework Foundation" "-framework AppKit" "-weak_framework Xmagic_Mac")

    set_target_properties(${PLUGIN} PROPERTIES
        FRAMEWORK TRUE
        FRAMEWORK_VERSION A
        MACOSX_FRAMEWORK_IDENTIFIER "${PLUGIN_WRAPPER_IDENTIFIER}"
        MACOSX_FRAMEWORK_SHORT_VERSION_STRING "${PLUGIN_VERSION}"
        MACOSX_FRAMEWORK_BUNDLE_VERSION "${PLUGIN_VERSION}"
        CXX_VISIBILITY_PRESET hidden
        LINK_FLAGS "-Wl -F ${SDK_LIB_DIR} -rpath @loader_path/../../../../Frameworks -rpath @loader_path/../../.."
    )
    set_target_properties(${PLUGIN} PROPERTIES XCODE_ATTRIBUTE_ENABLE_BITCODE "NO")
    target_link_libraries(${PLUGIN} PRIVATE "${PLUGIN_FRAMEWORKS}")
elseif(WIN32)
    target_link_libraries(${PLUGIN} PRIVATE ${SDK_LIB_DIR}/XmagicDll.lib)
endif()
