cmake_minimum_required(VERSION 3.19.5)

if (POLICY CMP0064)
    cmake_policy(SET CMP0064 NEW)
endif (POLICY CMP0064)

if (POLICY CMP0042)
    cmake_policy(SET CMP0042 NEW)
endif (POLICY CMP0042)

project(iris)
set(CMAKE_CXX_STANDARD 11)

add_definitions(-DIRIS_EXPORT)

if (CMAKE_BUILD_TYPE MATCHES "Debug" OR CMAKE_BUILD_TYPE MATCHES "None")
    message(STATUS "CMAKE_BUILD_TYPE is Debug")
    set(IRIS_DEBUG true)
elseif (CMAKE_BUILD_TYPE MATCHES "Release")
    message(STATUS "CMAKE_BUILD_TYPE is Release")
    set(IRIS_DEBUG false)
elseif (CMAKE_BUILD_TYPE MATCHES "RelWitchDebInfo")
    message(STATUS "CMAKE_BUILD_TYPE is RelWitchDebInfo")
    set(IRIS_DEBUG false)
elseif (CMAKE_BUILD_TYPE MATCHES "MinSizeRel")
    message(STATUS "CMAKE_BUILD_TYPE is MinSizeRel")
    set(IRIS_DEBUG false)
else ()
    message(STATUS "unknown CMAKE_BUILD_TYPE = " ${CMAKE_BUILD_TYPE})
    set(IRIS_DEBUG false)
endif ()

if (IRIS_DEBUG)
    add_definitions(-DIRIS_DEBUG)
endif ()

remove_definitions(-DGetObject)

include_directories(./third_party/agora/iris/include)

add_subdirectory(./rtc/cxx)
