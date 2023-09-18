#pragma once

#ifdef DUMP_EXPORT
#define DUMP_API __declspec(dllexport)
#else
#define DUMP_API __declspec(dllimport)
#endif

typedef void(__cdecl *videoSourceDumpCallback)(UINT nCode, LPVOID lVal1,
                                               LPVOID lVal2);

extern "C" DUMP_API void __cdecl initializeDump(
    const wchar_t *version, videoSourceDumpCallback callback = nullptr);