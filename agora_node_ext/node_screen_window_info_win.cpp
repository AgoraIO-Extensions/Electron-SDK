//
//  node_screen_window_info.cpp
//
//  Created by suleyu on 2018/8/8.
//  Copyright © 2018 Agora. All rights reserved.
//

#include "node_screen_window_info.h"
#include "node_log.h"
#include <gdiplus.h>
#include <gdiplusheaders.h>
#include <unordered_set>
#include <tchar.h>

Gdiplus::GdiplusStartupInput g_gdiStartup;
ULONG_PTR g_gdiplusToken = NULL;

Gdiplus::Status InitializeGdiplus()
{
    return Gdiplus::GdiplusStartup(&g_gdiplusToken, &g_gdiStartup, NULL);
}

void DestroyGdiplus()
{
    if (g_gdiplusToken != NULL) {
        Gdiplus::GdiplusShutdown(g_gdiplusToken);
        g_gdiplusToken = NULL;
    }
}

/**
* https://chromium.googlesource.com/external/webrtc/+/lkgr/modules/desktop_capture/window_capturer_win.cc
*/
BOOL CALLBACK EnumWindowsProc(_In_ HWND hwnd, _In_ LPARAM lParam)
{
    // Skip windows that are invisible, minimized, have no title, or are owned,
    // unless they have the app window style set.
    HWND owner = GetWindow(hwnd, GW_OWNER);
    LONG exstyle = GetWindowLong(hwnd, GWL_EXSTYLE);
    if (IsIconic(hwnd) || !IsWindowVisible(hwnd) ||
        (owner && !(exstyle & WS_EX_APPWINDOW))) {
        return TRUE;
    }

    // Skip the Program Manager window and the Start button.
    const size_t kClassLength = 256;
    char class_name[kClassLength];
    const int class_name_length = GetClassNameA(hwnd, class_name, kClassLength);

    //    RTC_DCHECK(class_name_length)
    //        << "Error retrieving the application's class name";
    // Skip Program Manager window and the Start button. This is the same logic
    // that's used in Win32WindowPicker in libjingle. Consider filtering other
    // windows as well (e.g. toolbars).
    if (strcmp(class_name, "Progman") == 0 || strcmp(class_name, "Button") == 0)
        return TRUE;

    // Windows 8 introduced a "Modern App" identified by their class name being
    // either ApplicationFrameWindow or windows.UI.Core.coreWindow. The
    // associated windows cannot be captured, so we skip them.
    // http://crbug.com/526883.

    ULONGLONG dwConditionMask = 0;
    VER_SET_CONDITION(dwConditionMask, VER_MAJORVERSION, VER_GREATER_EQUAL);
    VER_SET_CONDITION(dwConditionMask, VER_MINORVERSION, VER_GREATER_EQUAL);
    OSVERSIONINFOEX osx;
    ZeroMemory(&osx, sizeof(OSVERSIONINFOEX));
    osx.dwOSVersionInfoSize = sizeof(OSVERSIONINFOEX);
    osx.dwMajorVersion = 6;
    osx.dwMinorVersion = 2;
    int ret = VerifyVersionInfo(&osx, VER_MAJORVERSION | VER_MINORVERSION, dwConditionMask);
    //win8
    if (ret &&
        (strcmp(class_name, "ApplicationFrameWindow") == 0 ||
            strcmp(class_name, "Windows.UI.Core.CoreWindow") == 0)) {
        return TRUE;
    }

    std::unordered_set<HWND> *pSet = reinterpret_cast<std::unordered_set<HWND> *>(lParam);
    LONG lStyle = ::GetWindowLong(hwnd, GWL_STYLE);
    if ((lStyle&WS_VISIBLE) != 0 && (lStyle&(WS_POPUP | WS_SYSMENU)) != 0) {
        pSet->insert(hwnd);
    }

    return TRUE;
}
/**
 * https://docs.microsoft.com/en-us/windows/desktop/gdiplus/-gdiplus-retrieving-the-class-identifier-for-an-encoder-use
*/

int GetEncoderClsid(WCHAR *format, CLSID *pClsid)
{
    unsigned int num = 0, size = 0;
    Gdiplus::GetImageEncodersSize(&num, &size);
    if (size == 0) return -1;
    Gdiplus::ImageCodecInfo *pImageCodecInfo = (Gdiplus::ImageCodecInfo *)(malloc(size));
    if (pImageCodecInfo == NULL) return -1;
    Gdiplus::GetImageEncoders(num, size, pImageCodecInfo);
    for (unsigned int j = 0; j < num; ++j)
    {
        if (wcscmp(pImageCodecInfo[j].MimeType, format) == 0) {
            *pClsid = pImageCodecInfo[j].Clsid;
            free(pImageCodecInfo);
            return j;
        }
    }
    free(pImageCodecInfo);
    return -1;
}

#if 0
bool captureBmpToJpeg(const HWND& hWnd, char* szName, int i, std::vector<ScreenWindowInfo>& wndsInfo)
#endif
bool captureBmpToJpeg(const HWND& hWnd, char* szName, std::vector<ScreenWindowInfo>& wndsInfo)
{
#if 0
    WCHAR szFilePath[MAX_PATH] = { 0 };
    wsprintfW(szFilePath, L"D:\\bmp\\%d.jpg", i++);
    
    if (!szFilePath || !wcslen(szFilePath))
        return false;
#endif
    //calculate the number of color indexes in the color table
    
    int nBitCount = 32;
    int nColorTableEntries = 0;//nBitCunt 16 24 32
    HDC hDC = GetDC(hWnd);
    HDC hMemDC = CreateCompatibleDC(hDC);

    int nWidth = 0;
    int nHeight = 0;

    if (hWnd != HWND_DESKTOP) {
        RECT rect;
        ::GetClientRect(hWnd, &rect);
        nWidth = rect.right - rect.left;
        nHeight = rect.bottom - rect.top;
    }
    else {
        nWidth = ::GetSystemMetrics(SM_CXSCREEN);
        nHeight = ::GetSystemMetrics(SM_CYSCREEN);
    }

    if (nWidth == 0 || nHeight == 0)
        return false;

    int bmpWidth = IMAGE_MAX_PIXEL_SIZE;
    int bmpHeight = IMAGE_MAX_PIXEL_SIZE;
    if (nWidth <= IMAGE_MAX_PIXEL_SIZE && nHeight < IMAGE_MAX_PIXEL_SIZE) {
        bmpWidth = nWidth;
        bmpHeight = nHeight;
    }
    else if (nWidth > nHeight && nWidth > 500) {
        float rate = nWidth / 500.0f;
        float h = (float)nHeight / rate;
        bmpWidth = 500;
        bmpHeight = (int)h;
    }
    else if (nHeight > nWidth && nHeight > 500) {
        float rate = nHeight / 500.0f;
        float w = (float)nWidth / rate;
        bmpHeight = 500;
        bmpWidth = (int)w;
    }

    HBITMAP hBMP = CreateCompatibleBitmap(hDC, nWidth, nHeight);
    SelectObject(hMemDC, hBMP);
    SetStretchBltMode(hMemDC, COLORONCOLOR);
    StretchBlt(hMemDC, 0, 0, bmpWidth, bmpHeight, hDC, 0, 0, nWidth, nHeight, SRCCOPY);
    int nStructLength = sizeof(BITMAPINFOHEADER) + sizeof(RGBQUAD) * nColorTableEntries;
    LPBITMAPINFOHEADER lpBitmapInfoHeader = (LPBITMAPINFOHEADER)new char[nStructLength];
    ::ZeroMemory(lpBitmapInfoHeader, nStructLength);

    lpBitmapInfoHeader->biSize = sizeof(BITMAPINFOHEADER);
    lpBitmapInfoHeader->biWidth = bmpWidth;
    lpBitmapInfoHeader->biHeight = bmpHeight;
    lpBitmapInfoHeader->biPlanes = 1;
    lpBitmapInfoHeader->biBitCount = nBitCount;
    lpBitmapInfoHeader->biCompression = BI_RGB;
    lpBitmapInfoHeader->biXPelsPerMeter = 0;
    lpBitmapInfoHeader->biYPelsPerMeter = 0;
    lpBitmapInfoHeader->biClrUsed = nColorTableEntries;
    lpBitmapInfoHeader->biClrImportant = nColorTableEntries;

    DWORD dwBytes = ((DWORD)bmpWidth * nBitCount) / 32;
    if (((DWORD)bmpWidth * nBitCount) % 32) {
        dwBytes++;
    }
    dwBytes *= 4;

    DWORD dwSizeImage = dwBytes * bmpHeight;
    lpBitmapInfoHeader->biSizeImage = dwSizeImage;

    LPBYTE lpDibBits = 0;
    HBITMAP hBitmap = ::CreateDIBSection(hMemDC, (LPBITMAPINFO)lpBitmapInfoHeader, DIB_RGB_COLORS, (void**)&lpDibBits, NULL, 0);
    SelectObject(hMemDC, hBitmap);
    SetStretchBltMode(hMemDC, COLORONCOLOR);
    StretchBlt(hMemDC, 0, 0, bmpWidth, bmpHeight, hDC, 0, 0, nWidth, nHeight, SRCCOPY);
    ReleaseDC(hWnd, hDC);

    LONG uQuality = 100L;
    CLSID imageCLSID;
    Gdiplus::EncoderParameters encoderParams;
    encoderParams.Count = 1;
    encoderParams.Parameter[0].NumberOfValues = 1;
    encoderParams.Parameter[0].Guid = Gdiplus::EncoderQuality;
    encoderParams.Parameter[0].Type = Gdiplus::EncoderParameterValueTypeLong;
    encoderParams.Parameter[0].Value = &uQuality;
    GetEncoderClsid(L"image/jpeg", &imageCLSID);

    Gdiplus::Bitmap bitmap(hBitmap, NULL); 

    IStream* pOutIStream = NULL;
    if (CreateStreamOnHGlobal(NULL, TRUE, (LPSTREAM*)&pOutIStream) != S_OK) {
        LOG_ERROR("Failed to create stream on global memory!\n");
        ::DeleteObject(hBMP);
        ::DeleteObject(hBitmap);
        delete[]lpBitmapInfoHeader;
        return false;
    }
#if 0   
    bitmap.Save(szFilePath, &imageCLSID, &encoderParams);
#endif
    bitmap.Save(pOutIStream, &imageCLSID, &encoderParams);
    LARGE_INTEGER lnOffset;
    ULARGE_INTEGER ulnSize;
    lnOffset.QuadPart = 0;
    if (pOutIStream->Seek(lnOffset, STREAM_SEEK_END, &ulnSize) != S_OK)
    {
        LOG_ERROR("Failed to get size!\n");
        pOutIStream->Release();
        ::DeleteObject(hBMP);
        ::DeleteObject(hBitmap);
        delete[]lpBitmapInfoHeader;
        return false;
    }

    //copy the stream JPG to memory
    DWORD dwJpgSize = (DWORD)ulnSize.QuadPart;
    BYTE* pJPG = new BYTE[dwJpgSize];
    if (pOutIStream->Read(pJPG, dwJpgSize, NULL) != S_OK)
    {
        LOG_ERROR("Failed to read pBMP!\n");
        pOutIStream->Release();
        ::DeleteObject(hBMP);
        ::DeleteObject(hBitmap);
        delete[]lpBitmapInfoHeader;
        return FALSE;
    }

    std::string name = szName;
    ScreenWindowInfo wndInfo;// = std::make_tuple(hWnd, name, bmpWidth, bmpHeight, bmpSize, std::move(szBmp));
    wndInfo.windowId = hWnd;
    wndInfo.name = name;
    wndInfo.ownerName = "";
    wndInfo.width = bmpWidth;
    wndInfo.height = bmpHeight;
    wndInfo.imageDataLength = dwJpgSize;
    wndInfo.imageData = std::move(pJPG);
    wndsInfo.push_back(wndInfo);
    pOutIStream->Release();
    ::DeleteObject(hBMP);
    ::DeleteObject(hBitmap);
    delete[]lpBitmapInfoHeader;
    return true;
}

std::vector<ScreenWindowInfo> getAllWindowInfo()
{
    std::vector<ScreenWindowInfo> windows;

    Gdiplus::Status status = Gdiplus::Ok;
    if (g_gdiplusToken == NULL)
        status = InitializeGdiplus();

    if (status == Gdiplus::Ok){
        std::unordered_set<HWND> setHwnds;
        setHwnds.clear();
        EnumWindows(EnumWindowsProc, (LPARAM)(&setHwnds));
        std::vector<ScreenWindowInfo> wndsInfo;
        wndsInfo.reserve(setHwnds.size());

        for (auto iter = setHwnds.begin(); iter != setHwnds.end(); ++iter) {
            char class_name[100] = { 0 };
            char szName[MAX_PATH] = { 0 };
            GetWindowTextA(*iter, szName, MAX_PATH);
            GetClassNameA(*iter, class_name, 99);
            HWND windowid = *iter;
            if (strcmp(class_name, "EdgeUiInputTopWndClass") == 0
                || strcmp(class_name, "Shell_TrayWnd") == 0
                || strcmp(class_name, "DummyDWMListenerWindow") == 0
                || strcmp(class_name, "WorkerW") == 0
                || strcmp(class_name, "PopupRbWebDialog") == 0)//kuwo advertisement
            {
                continue;
            }  
            captureBmpToJpeg(windowid, szName, windows);
        }
    }

    return windows;
}
