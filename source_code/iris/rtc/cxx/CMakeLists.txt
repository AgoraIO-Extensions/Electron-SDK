set(LIBRARY_NAME iris-rtc)

if (APPLE)
    if (PLATFORM MATCHES "^OS.*$" OR PLATFORM MATCHES "^SIMULATOR.*$")
        set(IRIS_PLATFORM IOS)
        set(LIBS_DIR ${PROJECT_SOURCE_DIR}/third_party/agora/rtc/libs/Agora_Native_SDK_for_iOS_FULL/libs/ALL_ARCHITECTURE)
    else ()
        set(IRIS_PLATFORM MAC)
        set(LIBS_DIR ${PROJECT_SOURCE_DIR}/third_party/agora/rtc/libs/Agora_Native_SDK_for_Mac_FULL/libs)
    endif ()
elseif (WIN32)
    set(IRIS_PLATFORM WINDOWS)
    if (CMAKE_CL_64)
        set(LIBS_DIR ${PROJECT_SOURCE_DIR}/third_party/agora/rtc/libs/Agora_Native_SDK_for_Windows_FULL/libs/x86_64)
    else ()
        set(LIBS_DIR ${PROJECT_SOURCE_DIR}/third_party/agora/rtc/libs/Agora_Native_SDK_for_Windows_FULL/libs/x86)
    endif ()
elseif (UNIX)
    set(IRIS_PLATFORM ANDROID)
    set(LIBS_DIR ${PROJECT_SOURCE_DIR}/third_party/agora/rtc/libs/Agora_Native_SDK_for_Android_FULL/libs/${ANDROID_ABI})
endif ()
message(STATUS "LIBS_DIR " ${LIBS_DIR})

set(IRIS_PUBLIC_HEADER
        ../../third_party/agora/iris/include/iris_base.h
        ../../third_party/agora/iris/include/iris_event_handler.h
        ../../third_party/agora/iris/include/iris_proxy.h
        include/iris_rtc_base.h
        include/iris_rtc_c_api.h
        include/iris_rtc_channel.h
        include/iris_rtc_device_manager.h
        include/iris_rtc_engine.h
        include/iris_rtc_raw_data.h
        include/iris_rtc_raw_data_plugin.h
        include/iris_rtc_raw_data_plugin_manager.h
        include/iris_rtc_renderer.h
        )

set(IRIS_PUBLIC_SOURCE
        src/iris_rtc_c_api.cc
        src/iris_rtc_channel.cc
        src/iris_rtc_device_manager.cc
        src/iris_rtc_engine.cc
        src/iris_rtc_raw_data.cc
        src/iris_rtc_raw_data_plugin_manager.cc
        src/iris_rtc_renderer.cc
        )

set(IRIS_INTERNAL_HEADER
        ../../third_party/agora/iris/include/internal/iris_json_utils.h
        include/internal/iris_rtc_json_decoder.h
        include/internal/iris_rtc_json_encoder.h
        include/internal/iris_rtc_struct_extensions.h
        include/internal/rtc_channel_event_handler.h
        include/internal/rtc_engine_event_handler.h
        include/internal/rtc_metadata_observer.h
        )

set(IRIS_INTERNAL_SOURCE
        src/internal/iris_rtc_json_decoder.cc
        src/internal/iris_rtc_json_encoder.cc
        src/internal/iris_rtc_struct_extensions.cc
        src/internal/rtc_channel_event_handler.cc
        src/internal/rtc_engine_event_handler.cc
        src/internal/rtc_metadata_observer.cc
        )

if (IRIS_DEBUG)
    list(APPEND IRIS_INTERNAL_HEADER
            ../../third_party/agora/iris/include/internal/iris_test_utils.h
            include/internal/iris_rtc_tester.h
            )
    list(APPEND IRIS_INTERNAL_SOURCE src/internal/iris_rtc_tester.cc)
endif ()

add_subdirectory(../../third_party/libyuv libyuv)

add_library(${LIBRARY_NAME} SHARED
        ${IRIS_PUBLIC_HEADER}
        ${IRIS_PUBLIC_SOURCE}
        ${IRIS_INTERNAL_HEADER}
        ${IRIS_INTERNAL_SOURCE}
        )

set_target_properties(${LIBRARY_NAME} PROPERTIES
        RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/output/rtc"
        LIBRARY_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/output/rtc"
        ARCHIVE_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/output/rtc"
        PDB_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/output/rtc"
        )

set(IRIS_INCLUDE_DIRS
        "${PROJECT_SOURCE_DIR}/rtc/cxx/include"
        "${PROJECT_SOURCE_DIR}/third_party/agora/rtc/include"
        "${PROJECT_SOURCE_DIR}/third_party/libyuv/include"
        "${PROJECT_SOURCE_DIR}/third_party/rapidjson/include"
        )

target_include_directories(${LIBRARY_NAME} PUBLIC
        "$<BUILD_INTERFACE:${IRIS_INCLUDE_DIRS}>"
        "$<INSTALL_INTERFACE:$<INSTALL_PREFIX>/${CMAKE_INSTALL_INCLUDEDIR}>"
        )

if (APPLE)
    set(FRAMEWORKS
            "-framework AgoraCore"
            "-framework Agorafdkaac"
            "-framework Agoraffmpeg"
            "-framework AgoraRtcKit"
            "-framework AgoraSoundTouch"
            )
    if (PLATFORM MATCHES "^MAC.*$")
        list(APPEND FRAMEWORKS "-framework av1")
    endif ()

    target_link_libraries(${LIBRARY_NAME}
            PRIVATE
            "${FRAMEWORKS}"
            PRIVATE
            yuv
            )
    set_target_properties(${LIBRARY_NAME} PROPERTIES
            FRAMEWORK TRUE
            FRAMEWORK_VERSION A
            MACOSX_FRAMEWORK_IDENTIFIER io.agora.iris.rtc
            VERSION 1.0.0
            SOVERSION 1.0.0
            PUBLIC_HEADER "${IRIS_PUBLIC_HEADER}"
            CXX_VISIBILITY_PRESET hidden
            LINK_FLAGS "-Wl -F ${LIBS_DIR} -rpath ${LIBS_DIR}"
            )
elseif (WIN32)
    target_link_libraries(${LIBRARY_NAME}
            PRIVATE
            ${LIBS_DIR}/agora_rtc_sdk.lib
            yuv
            )
elseif (UNIX)
    add_library(libagora-core SHARED IMPORTED)
    set_target_properties(
            libagora-core
            PROPERTIES IMPORTED_LOCATION
            ${LIBS_DIR}/libagora-core.so
    )
    add_library(libagora-fdkaac SHARED IMPORTED)
    set_target_properties(
            libagora-fdkaac
            PROPERTIES IMPORTED_LOCATION
            ${LIBS_DIR}/libagora-fdkaac.so
    )
    add_library(libagora-ffmpeg SHARED IMPORTED)
    set_target_properties(
            libagora-ffmpeg
            PROPERTIES IMPORTED_LOCATION
            ${LIBS_DIR}/libagora-ffmpeg.so
    )
    add_library(libagora-mpg123 SHARED IMPORTED)
    set_target_properties(
            libagora-mpg123
            PROPERTIES IMPORTED_LOCATION
            ${LIBS_DIR}/libagora-mpg123.so
    )
    add_library(libagora-rtc-sdk SHARED IMPORTED)
    set_target_properties(
            libagora-rtc-sdk
            PROPERTIES IMPORTED_LOCATION
            ${LIBS_DIR}/libagora-rtc-sdk.so
    )
    add_library(libagora-soundtouch SHARED IMPORTED)
    set_target_properties(
            libagora-soundtouch
            PROPERTIES IMPORTED_LOCATION
            ${LIBS_DIR}/libagora-soundtouch.so
    )
    target_link_libraries(${LIBRARY_NAME}
            PRIVATE
            libagora-core
            libagora-fdkaac
            libagora-ffmpeg
            libagora-mpg123
            libagora-rtc-sdk
            libagora-soundtouch
            yuv
            )
endif ()

if (IRIS_PLATFORM MATCHES "WINDOWS" OR IRIS_PLATFORM MATCHES "MAC")
    if (IRIS_DEBUG)
        # Setup testing
        enable_testing()
        add_subdirectory(../../third_party/googletest googletest)

        # Add test cpp file
        add_executable(IrisUnitTests
                test/iris_rtc_channel_test.cc
                test/iris_rtc_device_manager_test.cc
                test/iris_rtc_engine_test.cc
                test/iris_rtc_json_test.cc
                test/main.cpp
                src/internal/iris_rtc_json_decoder.cc
                src/internal/iris_rtc_struct_extensions.cc
                src/internal/iris_rtc_json_encoder.cc
                )

        # Link test executable against gtest & gtest_main
        target_link_libraries(IrisUnitTests
                gtest
                gtest_main
                ${LIBRARY_NAME}
                )
        add_test(
                NAME IrisUnitTests
                COMMAND IrisUnitTests
        )

        if (APPLE)
            set_target_properties(IrisUnitTests PROPERTIES
                    LINK_FLAGS "-Wl -F ${LIBS_DIR} -rpath ${LIBS_DIR}"
                    )
        elseif (WIN32)
            add_custom_command(
                    TARGET IrisUnitTests
                    POST_BUILD
                    COMMAND ${CMAKE_COMMAND} -E copy_directory
                    "${LIBS_DIR}"
                    $<TARGET_FILE_DIR:IrisUnitTests>
            )
        endif ()

        add_custom_command(
                TARGET IrisUnitTests
                POST_BUILD
                COMMAND ${CMAKE_COMMAND} -E copy_directory
                "${PROJECT_SOURCE_DIR}/rtc/cxx/test/case"
                $<TARGET_FILE_DIR:IrisUnitTests>
        )
    endif ()
endif ()
