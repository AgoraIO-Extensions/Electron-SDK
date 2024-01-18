function(DOWNLOAD_SDK)
    message(STATUS "[XMagicBeauty] downloading sdk...")

    if(WIN32)
        set(SDK_URL "https://mediacloud-76607.gzc.vod.tencent-cloud.com/TencentEffect/Windows/1.0.0/sdk.zip")
    elseif(MACOS)
        set(SDK_URL "https://mediacloud-76607.gzc.vod.tencent-cloud.com/TencentEffect/Mac/2.0.0/BeautySDK.zip")
    endif()

    set(SDK_URL "${SDK_URL}")
    message(STATUS "[XMagicBeauty] set SDK_URL ${SDK_URL}")

    set(SDK_DOWNLOAD_DIR "${CMAKE_HOME_DIRECTORY}/sdk")
    message(STATUS "[XMagicBeauty] set SDK_DOWNLOAD_DIR ${SDK_DOWNLOAD_DIR}")

    # Specify the binary distribution type and download directory.
    STRING(REGEX REPLACE ".+/(.+)\\..*" "\\1" SDK_DISTRIBUTION ${SDK_URL})
    message(STATUS "[XMagicBeauty] set SDK_DISTRIBUTION ${SDK_DISTRIBUTION}")

    # Set the location where we expect the extracted binary distribution.
    set(SDK_ROOT "${SDK_DOWNLOAD_DIR}/libs")
    message(STATUS "[XMagicBeauty] set SDK_ROOT " ${SDK_ROOT})

    # Download and/or extract the binary distribution if necessary.
    set(SDK_DOWNLOAD_FILENAME "${SDK_DISTRIBUTION}.zip")
    set(SDK_DOWNLOAD_PATH "${SDK_DOWNLOAD_DIR}/${SDK_DOWNLOAD_FILENAME}")

    if(NOT EXISTS "${SDK_DOWNLOAD_PATH}")
        string(REPLACE "+" "%2B" SDK_DOWNLOAD_URL_ESCAPED ${SDK_URL})

        # Download the binary distribution and verify the hash.
        message(STATUS "[XMagicBeauty] downloading...")
        file(
            DOWNLOAD "${SDK_DOWNLOAD_URL_ESCAPED}" "${SDK_DOWNLOAD_PATH}"
            SHOW_PROGRESS
        )
    endif()

    # Always remove extracted sdk files
    if(IS_DIRECTORY ${SDK_ROOT})
        file(REMOVE_RECURSE ${SDK_ROOT})
    endif()

    # Create root folder to extract sdk files into.
    if(NOT IS_DIRECTORY ${SDK_ROOT})
        make_directory(${SDK_ROOT})
    endif()

    # Extract the binary distribution.
    message(STATUS "[XMagicBeauty] extracting ${SDK_DOWNLOAD_PATH}...")
    execute_process(
        COMMAND ${CMAKE_COMMAND} -E tar xzf "${SDK_DOWNLOAD_DIR}/${SDK_DOWNLOAD_FILENAME}"
        WORKING_DIRECTORY ${SDK_ROOT}
    )

    # Do not use ARCHIVE_EXTRACT, this command requires higher version of cmake.
    # file(ARCHIVE_EXTRACT INPUT "${SDK_DOWNLOAD_DIR}/${SDK_DOWNLOAD_FILENAME}" DESTINATION "${SDK_ROOT}")

    # Recurse into the SDK root directory
    file(GLOB_RECURSE SDK_SUB_DIRECTORIES LIST_DIRECTORIES true "${SDK_ROOT}/*")

    # Find the final sdk folder, which contains the libs and include folder
    # Mac: */LIBS
    # Windows: */libs
    if(APPLE)
        set(SDK_FOLDER_NAME "LIBS")
        set(SDK_RESOURCE_FOLDER_NAME "resources")
    else()
        set(SDK_FOLDER_NAME "libs")
        set(SDK_RESOURCE_FOLDER_NAME "res")
    endif()

    set(SDK_LIB_DIR_ROOT "")
    set(SDK_RES_DIR_ROOT "")

    foreach(SUB_DIRECTORY ${SDK_SUB_DIRECTORIES})
        if(IS_DIRECTORY ${SUB_DIRECTORY})
            # Try to find root sdk folder
            STRING(REGEX MATCH ".*${SDK_FOLDER_NAME}$" FIND_SDK_LIB_FOLDER ${SUB_DIRECTORY})

            if(FIND_SDK_LIB_FOLDER)
                set(SDK_LIB_DIR_ROOT ${SUB_DIRECTORY})
            endif()

            # Try to find root resources folder
            STRING(REGEX MATCH ".*${SDK_RESOURCE_FOLDER_NAME}$" FIND_SDK_RES_FOLDER ${SUB_DIRECTORY})

            if(FIND_SDK_RES_FOLDER)
                set(SDK_RES_DIR_ROOT ${SUB_DIRECTORY})
            endif()

            if(NOT ${SDK_LIB_DIR_ROOT} STREQUAL "" AND NOT ${SDK_RES_DIR_ROOT} STREQUAL "")
                break()
            endif()
        endif()
    endforeach()

    if(SDK_LIB_DIR_ROOT STREQUAL "" OR NOT IS_DIRECTORY "${SDK_LIB_DIR_ROOT}")
        message(FATAL_ERROR "[XMagicBeauty] SDK download and extract failed, can not find sdk root folder with name ${SDK_FOLDER_NAME}")
    endif()

    if(SDK_RES_DIR_ROOT STREQUAL "" OR NOT IS_DIRECTORY "${SDK_RES_DIR_ROOT}")
        message(FATAL_ERROR "[XMagicBeauty] SDK download and extract failed, can not find sdk res folder with name ${SDK_RESOURCE_FOLDER_NAME}")
    endif()

    # Prepare sdk
    if(MACOS)
        set(SDK_FRAMEWORK_NAME "Xmagic_Mac.framework")
        set(SDK_LIB_DIR ${SDK_LIB_DIR_ROOT})
        set(SDK_INCLUDE_DIR "${SDK_LIB_DIR}/${SDK_FRAMEWORK_NAME}/Versions/A/Headers")
    elseif(WIN32)
        # Target arch is x86_64
        if(CMAKE_SIZEOF_VOID_P MATCHES 8)
            set(SDK_LIB_DIR "${SDK_LIB_DIR_ROOT}/x64")
        else()
            set(SDK_LIB_DIR "${SDK_LIB_DIR_ROOT}/x86")
        endif()

        set(SDK_INCLUDE_DIR "${SDK_LIB_DIR_ROOT}/include")
    endif()

    set(SDK_LIB_DIR_ROOT ${SDK_LIB_DIR_ROOT} CACHE INTERNAL "")
    set(SDK_RES_DIR_ROOT ${SDK_RES_DIR_ROOT} CACHE INTERNAL "")
    set(SDK_LIB_DIR ${SDK_LIB_DIR} CACHE INTERNAL "")
    set(SDK_INCLUDE_DIR ${SDK_INCLUDE_DIR} CACHE INTERNAL "")

    message(STATUS "[XMagicBeauty] set SDK_LIB_DIR_ROOT " ${SDK_LIB_DIR_ROOT})
    message(STATUS "[XMagicBeauty] set SDK_RES_DIR_ROOT " ${SDK_RES_DIR_ROOT})
    message(STATUS "[XMagicBeauty] set SDK_LIB_DIR " ${SDK_LIB_DIR})
    message(STATUS "[XMagicBeauty] set SDK_INCLUDE_DIR " ${SDK_INCLUDE_DIR})

    message(STATUS "[XMagicBeauty] SDK download and extract finished")
endfunction()
