#pragma once
#include "logger.h"
#include <node_api.h>
#if defined(__GUNC__)
#define COMPILER_IS_GCC
#if defined(__MINGW32__) || defined(__MINGW64__)
#define COMPILER_IS_MINGW
#endif
#if defined(__MSYS__)
#define COMPILER_ON_MSYS
#endif
#if defined(__CYGWIN__) || defined(__CYGWIN32__)
#define COMPILER_ON_CYGWIN
#endif
#if defined(__clang__)
#define COMPILER_IS_CLANG
#endif
#elif defined(_MSC_VER)
#define COMPILER_IS_MSVC
#else
#define COMPILER_IS_UNKNOWN
#endif

#if defined(COMPILER_IS_MSVC)
typedef __int64 int64;
typedef unsigned __int64 uint64;
#elif (defined(__LONG_WIDTH__) && __LONG_WIDTH__ == 8)                         \
    || (defined(__SIZEOF_LONG__) && __SIZEOF_LONG__ == 8)
typedef signed long int64;
typedef unsigned long uint64;
#else
typedef signed long long int64;
typedef unsigned long long uint64;
#endif

namespace agora {
namespace rtc {
namespace electron {
enum ERROR_CODE {
  /**
   * 0: No error occurs.
   */
  ERR_OK = 0,
  // 1~1000
  /**
   * 1: A general error occurs (no specified reason).
   */
  ERR_FAILED = -1,
  /**
   * 2: The argument is invalid. For example, the specific channel name
   * includes illegal characters.
   */
  ERR_INVALID_ARGUMENT = -2,
  /**
   * 3: The SDK module is not ready. Choose one of the following solutions:
   * - Check the audio device.
   * - Check the completeness of the app.
   * - Reinitialize the RTC engine.
   */
  ERR_NOT_READY = -3,
  /**
   * 4: The SDK does not support this function.
   */
  ERR_NOT_SUPPORTED = -4,
  /**
   * 5: The request is rejected.
   */
  ERR_REFUSED = -5,
  /**
   * 6: The buffer size is not big enough to store the returned data.
   */
  ERR_BUFFER_TOO_SMALL = -6,
  /**
   * 7: The SDK is not initialized before calling this method.
   */
  ERR_NOT_INITIALIZED = -7,
};

}// namespace electron
}// namespace rtc
}// namespace agora
