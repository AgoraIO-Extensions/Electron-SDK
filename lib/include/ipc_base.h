#ifndef __IPC_BASE_H__
#define __IPC_BASE_H__

#include <string>
#include <memory>
#include <vector>
#include <functional>


#if defined(__GUNC__)
#   define COMPILER_IS_GCC
#elif defined(_MSC_VER)
#   define COMPILER_IS_MSVC
#else
#   define COMPILER_IS_UNKNOWN
#endif

#ifdef __cplusplus
#   define EXTERN_C         extern "C"
#   define EXTERN_C_ENTER   extern "C" {
#   define EXTERN_C_LEAVE   }
#else
#   define EXTERN_C
#   define EXTERN_C_ENTER
#   define EXTERN_C_LEAVE
#endif

#if defined(COMPILER_IS_MSVC)
#   define AGORA_CDECL         __cdecl
#elif defined(COMPILER_IS_GCC)
#   if defined(__x86_64) \
    || defined(__amd64__) \
    || defined(__amd64) \
    || defined(_M_IA64) \
    || defined(_M_X64) \
    || defined(_M_IX64)
#       define AGORA_CDECL
#   else
#       define AGORA_CDECL     __attribute__((__cdecl__))
#   endif
#else
#   define AGORA_CDECL
#endif

#if defined(COMPILER_IS_MSVC)
#   if defined(AGORA_EXPORT)
#       define AGORA_API EXTERN_C __declspec(dllexport)
#   else
#       define AGORA_API EXTERN_C __declspec(dllimport)
#   endif
#elif defined(COMPILER_IS_GCC) \
    && ((__GNUC__ >= 4) || (__GNUC__ == 3 && __GUNC_MINOR__ >= 3))
#   define AGORA_API EXTERN_C __attribute__((visibility("default")))
#else
#   define AGORA_API EXTERN_C
#endif

#define AGORA_CALL AGORA_CDECL

#define DATA_DELIVER_BLOCK_SIZE 6145000


class IAgoraIpcDataSender{
public:
    virtual ~IAgoraIpcDataSender() {};

    virtual bool initialize(const std::string& id) = 0;

    virtual void sendData(char* payload, unsigned int len) = 0;

    virtual void sendMultiData(const std::vector<std::pair<char*, int32_t>>& payloads) = 0;

    virtual void Disconnect() = 0;
};

class IAgoraIpcDataReceiver{
public:
    virtual ~IAgoraIpcDataReceiver() {};

    virtual bool initialize(const std::string& id,
                  const std::function<void(const char*, int)>& handler) = 0;

    virtual void run(bool async = false) = 0;

    virtual void stop() = 0;
};

AGORA_API IAgoraIpcDataSender* AGORA_CALL createIpcSender();
AGORA_API IAgoraIpcDataReceiver* AGORA_CALL createIpcReceiver();

AGORA_API void releaseIpcSender(IAgoraIpcDataSender* sender);
AGORA_API void releaseIpcReceiver(IAgoraIpcDataReceiver* receiver);

#endif
