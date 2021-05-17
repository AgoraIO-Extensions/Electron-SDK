/*
 * Copyright (c) 2017 Agora.io
 * All rights reserved.
 * Proprietry and Confidential -- Agora.io
 */

/*
 *  Created by Wang Yongli, 2017
 */

#include "check_permission.h"

#include <string>
#include "loguru.hpp"

#if defined(_WIN32)
#include <iostream>
#include <string>
#include <windows.h>
#include <fstream>
#include <comdef.h>
#endif
#include "loguru.hpp"
namespace agora
{
namespace rtc
{
#if defined(_WIN32)


#pragma warning(disable : 4996)

enum OSVersion {
    INVALID = -1,
    WIN8 = 0,
    WIN10 = 1,
    WINOther = 2,
};

enum WindowsMajorVersions {
    kWindows2000 = 5,
    kWindowsVista = 6,
    kWindows10 = 10,
};

std::string WideToMultiByte(WCHAR wszDefaultDeviceID[MAX_PATH]) {
    char defaultDeviceGuid[256];
    memset(defaultDeviceGuid, '\0', 256);
    std::string output = "";
    int ret = WideCharToMultiByte(CP_UTF8, 0, wszDefaultDeviceID, wcslen(wszDefaultDeviceID),
                                  defaultDeviceGuid, 256, NULL, NULL);
    if (ret >= 0) {
        output = defaultDeviceGuid;
    }
    return output;
}

bool GetOsVersion(int *major, int *minor, int *build) {
    OSVERSIONINFO info = { 0 };
    info.dwOSVersionInfoSize = sizeof(info);
    if (GetVersionEx(&info)) {
        if (major)
            *major = info.dwMajorVersion;
        if (minor)
            *minor = info.dwMinorVersion;
        if (build)
            *build = info.dwBuildNumber;
        return true;
    }
    return false;
}

bool GetRegKeyValue(HKEY root, const std::string &regPath,
                    const std::string &regKey, std::string &regValue) {
    HKEY hKey;
    LSTATUS lret;
    char szValue[MAX_PATH]{};

    lret = RegOpenKeyExA(root, regPath.c_str(), 0, KEY_READ | KEY_WOW64_64KEY,
                         &hKey);
    if (ERROR_SUCCESS == lret) {
        DWORD dwType = REG_SZ;
        DWORD dwSize = MAX_PATH;
        lret = RegQueryValueExA(hKey, regKey.c_str(), 0, &dwType, (LPBYTE)szValue,
                                &dwSize);
        RegCloseKey(hKey);
    }

    regValue = szValue;
    return ERROR_SUCCESS == lret;
}

bool IsWindows10OrLater(unsigned int buildNumber = 0) {
    int major = 0;
    typedef void(__stdcall * NTPROC)(DWORD *, DWORD *, DWORD *);
    HINSTANCE hinst = LoadLibrary((LPCSTR)L"ntdll.dll");
    if (hinst) {
        NTPROC proc = (NTPROC)GetProcAddress(hinst, "RtlGetNtVersionNumbers");
        if (proc) {
            DWORD dwMajor, dwMinor, dwBuildNumber;
            proc(&dwMajor, &dwMinor, &dwBuildNumber);
            dwBuildNumber &= 0xffff;
            if (dwMajor >= kWindows10 && dwBuildNumber >= buildNumber) {
                FreeLibrary(hinst);
                return true;
            }
            else {
                FreeLibrary(hinst);
                return false;
            }
        }
        else {
            FreeLibrary(hinst);
            return (GetOsVersion(&major, nullptr, nullptr) && (major >= kWindows10));
        }
    }
    else {
        return (GetOsVersion(&major, nullptr, nullptr) && (major >= kWindows10));
    }
}

bool IsWindows8OrLater() {
    int major = 0, minor = 0;
    typedef void(__stdcall * NTPROC)(DWORD *, DWORD *, DWORD *);
    HINSTANCE hinst = LoadLibrary((LPCSTR)"ntdll.dll");
    if (hinst) {
        NTPROC proc = (NTPROC)GetProcAddress(hinst, "RtlGetNtVersionNumbers");
        if (proc) {
            DWORD dwMajor, dwMinor, dwBuildNumber;
            proc(&dwMajor, &dwMinor, &dwBuildNumber);
            dwBuildNumber &= 0xffff;
            if ((dwMajor > kWindowsVista) ||
                (dwMajor == kWindowsVista && dwMinor > 1)) {
                FreeLibrary(hinst);
                return true;
            }
            else {
                FreeLibrary(hinst);
                return false;
            }
        }
        else {
            FreeLibrary(hinst);
            return (
                    GetOsVersion(&major, &minor, nullptr) &&
                    ((major > kWindowsVista) || (major == kWindowsVista && minor > 1)));
        }
    }
    else {
        return (GetOsVersion(&major, &minor, nullptr) &&
                ((major > kWindowsVista) || (major == kWindowsVista && minor > 1)));
    }
}

bool checkWin10MicrophoneAuthorization() {
    std::string globalAccess;
    std::string appAccess;
    std::string nativeAccess;
    bool ret = false;

    std::string regPath =
    R"(SOFTWARE\Microsoft\Windows\CurrentVersion\CapabilityAccessManager\ConsentStore\microphone)";
    std::string regKey = "Value";
    ret = GetRegKeyValue(HKEY_LOCAL_MACHINE, regPath, regKey, globalAccess);

    regPath =
    R"(Software\Microsoft\Windows\CurrentVersion\CapabilityAccessManager\ConsentStore\microphone)";
    ret = GetRegKeyValue(HKEY_CURRENT_USER, regPath, regKey, appAccess);

    regPath =
    R"(Software\Microsoft\Windows\CurrentVersion\CapabilityAccessManager\ConsentStore\microphone\NonPackaged)";
    ret = GetRegKeyValue(HKEY_CURRENT_USER, regPath, regKey, nativeAccess);
    return !(globalAccess == "Deny" || appAccess == "Deny" ||
             nativeAccess == "Deny");
}

bool checkWin8MicrophoneAuthorization() {
    LSTATUS lret;
    std::string devicePath =
    R"(SOFTWARE\Microsoft\Windows\CurrentVersion\DeviceAccess\CapabilityMappings\Microphone)";
    std::string priPath =
    R"(Software\Microsoft\Windows\CurrentVersion\DeviceAccess\Global)";
    int i = 0, retCode = 0;
    HKEY hKey;
    char tcKeyName[128];
    DWORD dwKeyNameSize = 128;
    FILETIME ftLastWriteTime;
    std::string subKeyName;
    lret = RegOpenKeyExA(HKEY_LOCAL_MACHINE, devicePath.c_str(), 0,
                         KEY_READ | KEY_WOW64_64KEY, &hKey);
    while (1) {
        retCode = RegEnumKeyEx(hKey, i, tcKeyName, &dwKeyNameSize, NULL, NULL, NULL,
                               &ftLastWriteTime);
        if (retCode == ERROR_NO_MORE_ITEMS) {
            break;
        }
        subKeyName = tcKeyName;
        if (subKeyName == "") {
            continue;
        }
        break;
        i++;
    }
    RegCloseKey(hKey);

    std::string fullPath = priPath + "\\" + subKeyName;
    std::string globalAccess;
    bool ret = false;
    ret = GetRegKeyValue(HKEY_CURRENT_USER, fullPath, "", globalAccess);
    if (ret) {
        return !(globalAccess == "Deny");
    }
    return true;
}


int checkOsVersion() {
    bool ret = false;
    ret = IsWindows10OrLater();
    if (ret)
        return WIN10;
    ret = IsWindows8OrLater();
    if (ret)
        return WIN8;
    return WINOther;
}

#endif


bool checkWinMicrophoneAuthorization()
{
#if defined(_WIN32)
    int version = checkOsVersion();
    bool bAuthorizationAllowed = false;

    switch (version)
    {
        case WIN10:
            bAuthorizationAllowed = checkWin10MicrophoneAuthorization();
            break;
        case WIN8:
            bAuthorizationAllowed = checkWin8MicrophoneAuthorization();
            break;
        default:
            bAuthorizationAllowed = true;
            break;
    }
    return bAuthorizationAllowed;
#else
    return false;
#endif
}
}
}
