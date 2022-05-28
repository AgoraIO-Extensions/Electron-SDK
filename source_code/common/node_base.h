#pragma once
#include <node_api.h>
#include "logger.h"
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
#elif (defined(__LONG_WIDTH__) && __LONG_WIDTH__ == 8) ||                      \
    (defined(__SIZEOF_LONG__) && __SIZEOF_LONG__ == 8)
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
  ERROR_OK = 0,
  ERROR_PARAMETER_1 = -1,
  ERROR_PARAMETER_2 = -2,
  ERROR_PARAMETER_3 = -3,
  ERROR_PARAMETER_4 = -4,
  ERROR_PARAMETER_5 = -5,
  ERROR_NOT_INIT = -6
};

} // namespace electron
} // namespace rtc
} // namespace agora
