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
#include <windows.h>
#endif
namespace agora
{
    namespace rtc
    {
#if defined(_WIN32)
        bool GetRegKeyValue(HKEY root, const std::string &regPath, const std::string &regKey,
                            std::string &regValue)
        {
            HKEY hKey;
            LSTATUS lret;
            char szValue[MAX_PATH]{};

            lret = RegOpenKeyExA(root, regPath.c_str(), 0, KEY_READ | KEY_WOW64_64KEY, &hKey);
            if (ERROR_SUCCESS == lret)
            {
                DWORD dwType = REG_SZ;
                DWORD dwSize = MAX_PATH;
                lret = RegQueryValueExA(hKey, regKey.c_str(), 0, &dwType, (LPBYTE)szValue, &dwSize);
                RegCloseKey(hKey);
            }

            regValue = szValue;
            return ERROR_SUCCESS == lret;
        }
#endif

        bool MicrophoneAuthorizationDenied()
        {
#if defined(_WIN32)
            //   if (!_bIsWin8OrWin10) {
            //     return false;
            //   }
            //   CriticalSectionScoped lock(&_critSect);
            std::string globalAccess;
            std::string appAccess;
            std::string nativeAccess;
            bool ret = false;
            std::string regPath =
                R"(SOFTWARE\Microsoft\Windows\CurrentVersion\CapabilityAccessManager\ConsentStore\microphone)";
            std::string regKey = "Value";
            ret = GetRegKeyValue(HKEY_LOCAL_MACHINE, regPath, regKey, globalAccess);
            // if (!ret)
            // {
            //     WEBRTC_TRACE_CORE_ADM(kTraceWarning, kTraceAudioDevice, _id,
            //                           "get HKEY_LOCAL_MACHINE camera globalAccess failed");
            // }
            regPath =
                R"(Software\Microsoft\Windows\CurrentVersion\CapabilityAccessManager\ConsentStore\microphone)";
            ret = GetRegKeyValue(HKEY_CURRENT_USER, regPath, regKey, appAccess);

            regPath =
                R"(Software\Microsoft\Windows\CurrentVersion\CapabilityAccessManager\ConsentStore\microphone\NonPackaged)";
            ret = GetRegKeyValue(HKEY_CURRENT_USER, regPath, regKey, nativeAccess);
            return (globalAccess == "Deny" || appAccess == "Deny" || nativeAccess == "Deny");
#else
            return false;
#endif
        }
    }
}
