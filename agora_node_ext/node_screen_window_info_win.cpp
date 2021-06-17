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
#include <Psapi.h>
#include <algorithm>

Gdiplus::GdiplusStartupInput g_gdiStartup;
ULONG_PTR g_gdiplusToken = NULL;

bool IsDisplayLogo(char class_name[100])
{
	if (strcmp(class_name, "ApplicationFrameWindow") == 0 ||
		strcmp(class_name, "Windows.UI.Core.CoreWindow") == 0 ||
		strcmp(class_name, "OpusApp") == 0 ||
		strcmp(class_name, "Chrome_WidgetWin_1") == 0 ||
		strcmp(class_name, "XLMAIN") == 0 ||
		strcmp(class_name, "PPTFrameClass") == 0 ||
		strcmp(class_name, "screenClass") == 0 ||
		strcmp(class_name, "QWidget") == 0 ||
		strcmp(class_name, "MozillaWindowClass") == 0) {
		return true;
	} else {
		return false;
	}
}

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

BOOL CALLBACK EnumTopWindowsProc(_In_ HWND hwnd, _In_ LPARAM lParam)
{
	std::unordered_set<HWND> *pSet = reinterpret_cast<std::unordered_set<HWND> *>(lParam);
    pSet->insert(hwnd);
	return TRUE;
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

bool WindowInBlackList(std::string module_name) {
	std::transform(module_name.begin(), module_name.end(), module_name.begin(), ::towlower);

	if (module_name.rfind("chrome.exe") != std::wstring::npos) {
		return true;
	}
	else if (module_name.rfind("firefox.exe") != std::wstring::npos) {
		return true;
	}
	else if (module_name.rfind("powerpnt.exe") != std::wstring::npos) {
		return true;
	}
	else if (module_name.rfind("keynote.exe") != std::wstring::npos) {
		return true;
	}
	else if (module_name.rfind("word.exe") != std::wstring::npos) {
		return true;
	}
	else if (module_name.rfind("pages.exe") != std::wstring::npos) {
		return true;
	}
	else if (module_name.rfind("wps.exe") != std::wstring::npos) {
		return true;
	}
	else {
		return true;
	}
}

#if 0
bool captureBmpToJpeg(const HWND& hWnd, char* szName, int i, std::vector<ScreenWindowInfo>& wndsInfo)
#endif
bool captureBmpToJpeg(const HWND& hWnd, char* szName, std::vector<ScreenWindowInfo>& wndsInfo, bool displayLogo)
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
	Gdiplus::Graphics graphic(&bitmap);

	do {
		DWORD dwProcId = 0;
		GetWindowThreadProcessId(hWnd, &dwProcId);
		if (dwProcId == 0) break;

		HANDLE hProc = OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_VM_READ, FALSE, dwProcId);
		if (!hProc) break;

		TCHAR temp[MAX_PATH] = { 0 };
		DWORD dwRet = GetModuleFileNameEx(hProc, NULL, temp, MAX_PATH - 1);

		CloseHandle(hProc);

		if (dwRet == 0) break;

		std::string module_name = temp;
		if (!displayLogo) break;

		Gdiplus::Color c(0, 0, 0);
		graphic.Clear(c);

		HICON hIcon = nullptr;
		ICONINFO icInfo = { 0 };

		ExtractIconEx(module_name.c_str(), 0, &hIcon, NULL, 1);
		if (!hIcon) break;

		if (!::GetIconInfo(hIcon, &icInfo)) break;

		BITMAP bitmap;
		GetObject(icInfo.hbmColor, sizeof(BITMAP), &bitmap);

		int width = bitmap.bmWidth;
		int height = bitmap.bmHeight;

		Gdiplus::Bitmap* pBitmap = NULL;
		Gdiplus::Bitmap* pWrapBitmap = NULL;

		do {
			if (bitmap.bmBitsPixel != 32)
			{
				pBitmap = Gdiplus::Bitmap::FromHICON(hIcon);
			}
			else {
				pWrapBitmap = Gdiplus::Bitmap::FromHBITMAP(icInfo.hbmColor, NULL);
				if (!pWrapBitmap)
					break;
				Gdiplus::BitmapData bitmapData;
				Gdiplus::Rect rcImage(0, 0, pWrapBitmap->GetWidth(), pWrapBitmap->GetHeight());
				pWrapBitmap->LockBits(&rcImage, Gdiplus::ImageLockModeRead, pWrapBitmap->GetPixelFormat(), &bitmapData);
				pBitmap = new (Gdiplus::Bitmap)(bitmapData.Width, bitmapData.Height, bitmapData.Stride, PixelFormat32bppARGB, (BYTE*)bitmapData.Scan0);
				pWrapBitmap->UnlockBits(&bitmapData);
			}
			float maxWidth = bmpWidth / 2.0f;
			float maxHeight = bmpHeight / 2.0f;
			float maxLength = maxWidth < maxHeight ? maxWidth : maxHeight;
			maxLength = 150;
			float wScale = maxLength / (float)width;
			float hScale = maxLength / (float)height;
			float scale = wScale < hScale ? wScale : hScale;
			float scaleWidth = scale * width;
			float scaleHeight = scale * height;
			float x = (bmpWidth - scaleWidth) / 2.0f;
			float y = (bmpHeight - scaleHeight) / 2.0f;
			Gdiplus::Rect r((int)x, (int)y, (int)scaleWidth, (int)scaleHeight);

			graphic.DrawImage(pBitmap, r);

		} while (0);

		delete pBitmap;

		if (pWrapBitmap)
			delete pWrapBitmap;

		DeleteObject(icInfo.hbmColor);
		DeleteObject(icInfo.hbmMask);

		if (hIcon) DestroyIcon(hIcon);

	} while(false);

	

	IStream* pOutIStream = NULL;
	if (CreateStreamOnHGlobal(NULL, TRUE, (LPSTREAM*)&pOutIStream) != S_OK) {
		// LOG_ERROR("Failed to create stream on global memory!\n");
		::DeleteObject(hBMP);
		::DeleteObject(hBitmap);
		delete[]lpBitmapInfoHeader;
		return false;
	}
#if 0   
	bitmap.Save(szFilePath, &imageCLSID, &encoderParams);
#endif
	if (bitmap.Save(pOutIStream, &imageCLSID, &encoderParams) != Gdiplus::Ok) {
		return false;
	}
	LARGE_INTEGER lnOffset;
	ULARGE_INTEGER ulnSize;
	lnOffset.QuadPart = 0;
	if (pOutIStream->Seek(lnOffset, STREAM_SEEK_END, &ulnSize) != S_OK)
	{
		//LOG_ERROR("Failed to get size!\n");
		pOutIStream->Release();
		::DeleteObject(hBMP);
		::DeleteObject(hBitmap);
		delete[]lpBitmapInfoHeader;
		return false;
	}

	ULARGE_INTEGER ul;
	LARGE_INTEGER l;
	l.QuadPart = 0;
	pOutIStream->Seek(l, STREAM_SEEK_SET, &ul);


	//copy the stream JPG to memory
	DWORD dwJpgSize = (DWORD)ulnSize.QuadPart;
	BYTE* pJPG = new BYTE[dwJpgSize];
	memset(pJPG, 0, dwJpgSize);
	DWORD dwRead = 0;
	if (pOutIStream->Read(pJPG, dwJpgSize, &dwRead) != S_OK)
	{
		//  LOG_ERROR("Failed to read pBMP!\n");
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
	wndInfo.originWidth = nWidth;
	wndInfo.originHeight = nHeight;
	wndsInfo.push_back(wndInfo);
	pOutIStream->Release();
	::DeleteObject(hBMP);
	::DeleteObject(hBitmap);
	delete[]lpBitmapInfoHeader;
	return true;
}

#if 0
bool dumpDisplayInfo(HDC hDC, RECT rcMonitor, int i, std::vector<ScreenInfo>& screenInfo)
#else
bool dumpDisplayInfo(HDC hDC, ScreenDisplayInfo* info, int i, std::vector<ScreenDisplayInfo>& screenInfos)
#endif
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
							   //HWND hWnd = GetDesktopWindow();
							   //HDC hDC = GetDC(hWnd);
	HDC hMemDC = CreateCompatibleDC(hDC);

	int nWidth = info->displayId.width;
	int nHeight = info->displayId.height;

	if (nWidth == 0 || nHeight == 0)
		return false;

	int bmpWidth = nWidth;
	int bmpHeight = nHeight;
	int x = info->displayId.x;
	int y = info->displayId.y;

	HBITMAP hBMP = CreateCompatibleBitmap(hDC, nWidth, nHeight);
	SelectObject(hMemDC, hBMP);
	SetStretchBltMode(hMemDC, COLORONCOLOR);
	StretchBlt(hMemDC, 0, 0, bmpWidth, bmpHeight, hDC, x, y, nWidth, nHeight, SRCCOPY);
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
	StretchBlt(hMemDC, 0, 0, bmpWidth, bmpHeight, hDC, x, y, nWidth, nHeight, SRCCOPY);
	//ReleaseDC(hWnd, hDC);

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
		// LOG_ERROR("Failed to create stream on global memory!\n");
		::DeleteObject(hBMP);
		::DeleteObject(hBitmap);
		delete[]lpBitmapInfoHeader;
		return false;
	}
#if 0
	bitmap.Save(szFilePath, &imageCLSID, &encoderParams);
#endif
	if (bitmap.Save(pOutIStream, &imageCLSID, &encoderParams) != Gdiplus::Ok) {
		return false;
	}
	LARGE_INTEGER lnOffset;
	ULARGE_INTEGER ulnSize;
	lnOffset.QuadPart = 0;
	if (pOutIStream->Seek(lnOffset, STREAM_SEEK_END, &ulnSize) != S_OK)
	{
		//LOG_ERROR("Failed to get size!\n");
		pOutIStream->Release();
		::DeleteObject(hBMP);
		::DeleteObject(hBitmap);
		delete[]lpBitmapInfoHeader;
		return false;
	}

	ULARGE_INTEGER ul;
	LARGE_INTEGER l;
	l.QuadPart = 0;
	pOutIStream->Seek(l, STREAM_SEEK_SET, &ul);


	//copy the stream JPG to memory
	DWORD dwJpgSize = (DWORD)ulnSize.QuadPart;
	BYTE* pJPG = new BYTE[dwJpgSize];
	memset(pJPG, 0, dwJpgSize);
	DWORD dwRead = 0;
	if (pOutIStream->Read(pJPG, dwJpgSize, &dwRead) != S_OK)
	{
		//  LOG_ERROR("Failed to read pBMP!\n");
		pOutIStream->Release();
		::DeleteObject(hBMP);
		::DeleteObject(hBitmap);
		delete[]lpBitmapInfoHeader;
		return FALSE;
	}

	char szName[20] = { 0 };
	sprintf_s(szName, 20, "屏幕%d", i);

	info->name = szName;
	info->ownerName = "";
	info->width = bmpWidth;
	info->height = bmpHeight;
	info->imageDataLength = dwJpgSize;
	info->imageData = std::move(pJPG);

	pOutIStream->Release();
	::DeleteObject(hBMP);
	::DeleteObject(hBitmap);
	delete[]lpBitmapInfoHeader;
	return true;
}

BOOL CALLBACK Monitorenumproc(
	HMONITOR Arg1,
	HDC Arg2,
	LPRECT Arg3,
	LPARAM Arg4
)
{
	ScreenDisplayInfo screen;
	RECT rc = *Arg3;
	screen.displayId.x = rc.left;
	screen.displayId.width = rc.right - rc.left;
	screen.displayId.y = rc.top;
	screen.displayId.height = rc.bottom - rc.top;

	screen.width = rc.right - rc.left;
	screen.height = rc.bottom - rc.top;
	std::vector<ScreenDisplayInfo> * screenInfos = (std::vector<ScreenDisplayInfo> *)Arg4;
	screenInfos->push_back(screen);
	return TRUE;
}

bool IsInvisibleWin10BackgroundAppWindow(HWND hWnd) {

	HRESULT(__stdcall * pDwmGetWindowAttribute) (HWND hwnd, DWORD dwAttribute, PVOID pvAttribute, DWORD cbAttribute) = NULL;
	HINSTANCE hDll = LoadLibrary("Dwmapi.dll");
	if (hDll != NULL) {
		pDwmGetWindowAttribute = (HRESULT(__stdcall*)(
			HWND hwnd, DWORD dwAttribute, PVOID pvAttribute,
			DWORD cbAttribute))GetProcAddress(hDll, "DwmGetWindowAttribute");
		int CloakedVal = 0;
		HRESULT hRes = pDwmGetWindowAttribute(hWnd, 14 /*DWMWA_CLOAKED*/,
			&CloakedVal, sizeof(CloakedVal));
		if (hRes != S_OK) {
			CloakedVal = 0;
		}
		return CloakedVal ? true : false;
	}
	return false;
}

bool IsWindowValid(HWND hwnd)
{
	if (!IsWindowVisible(hwnd) || IsIconic(hwnd) ||
		IsInvisibleWin10BackgroundAppWindow(hwnd))
		return false;

	DWORD styles, ex_styles;

	styles = (DWORD)GetWindowLongPtr(hwnd, GWL_STYLE);
	ex_styles = (DWORD)GetWindowLongPtr(hwnd, GWL_EXSTYLE);

	if (ex_styles & WS_EX_TOOLWINDOW)
		return false;
	if (styles & WS_CHILD)
		return false;

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
        EnumWindows(EnumTopWindowsProc, (LPARAM)(&setHwnds));
        std::vector<ScreenWindowInfo> wndsInfo;
        wndsInfo.reserve(setHwnds.size());

        for (auto iter = setHwnds.begin(); iter != setHwnds.end(); ++iter) {
			if (!IsWindowValid(*iter)) {
				continue;
			}

			RECT rc_wnd;
			::GetWindowRect(*iter, &rc_wnd);
			if (rc_wnd.right - rc_wnd.left <= 0 || rc_wnd.bottom - rc_wnd.top <= 0) {
				continue;
			}
			
            char class_name[100] = { 0 };
            WCHAR szName[MAX_PATH] = { 0 };
            char name[MAX_PATH] = { 0 };
            GetWindowTextW(*iter, szName, MAX_PATH);
            if (wcslen(szName) == 0)//
                continue;
            ::WideCharToMultiByte(CP_UTF8, 0, szName, wcslen(szName), name, MAX_PATH, NULL, NULL);
            GetClassNameA(*iter, class_name, 99);
            HWND windowid = *iter;
            if (strcmp(class_name, "EdgeUiInputTopWndClass") == 0
                || strcmp(class_name, "Shell_TrayWnd") == 0
                || strcmp(class_name, "DummyDWMListenerWindow") == 0
                || strcmp(class_name, "WorkerW") == 0
                || strcmp(class_name, "PopupRbWebDialog") == 0
                || strcmp(class_name, "TXGuiFoundation") == 0)//kuwo advertisement
            {
                continue;
            }
			if (strcmp(class_name, "Progman") == 0
				&& strcmp(name, "Program Manager") == 0)
			{
				continue;
			}

			if (strcmp(class_name, "TaskManagerWindow") == 0)
			{
				continue;
			}

			bool displayLogo = IsDisplayLogo(class_name);

            captureBmpToJpeg(windowid, name, windows, displayLogo);
        }
    }

    return windows;
}

std::vector<ScreenDisplayInfo> getAllDisplayInfo()
{
	Gdiplus::Status status = Gdiplus::Ok;
	std::vector<ScreenDisplayInfo> displayInfos;
	if (g_gdiplusToken == NULL)
		status = InitializeGdiplus();


	if (status == Gdiplus::Ok) {
		EnumDisplayMonitors(NULL, NULL, Monitorenumproc, LPARAM(&displayInfos));
		RECT rc = { 0, 0, 0, 0 };

		HWND hDesktop = GetDesktopWindow();
		HDC hDC = GetDC(hDesktop);
		RECT rcCapture = { 0, 0, 0, 0 };
		for (int i = 0; i < displayInfos.size(); i++)
		{
			ScreenDisplayInfo &info = displayInfos[i];
			dumpDisplayInfo(hDC, &info, 20, displayInfos);
		}
	}
    return displayInfos;
}

std::vector<ScreenDisplayInfo> getAllRealDisplayInfo()
{
	Gdiplus::Status status = Gdiplus::Ok;
	bool flag = true;
	int dsp_num = 0;
	std::vector<ScreenDisplayInfo> _display_infos;
	if (g_gdiplusToken == NULL)
		status = InitializeGdiplus();
		
	DISPLAY_DEVICE _display_device;
	ZeroMemory(&_display_device, sizeof(_display_device));
	_display_device.cb = sizeof(_display_device);
	for(int _device_index = 0; ; ++_device_index) {
		ScreenDisplayInfo _display_info;
		flag = EnumDisplayDevicesA(NULL, _device_index, &_display_device, 0);
		
		if (!flag)
			break;

		if (!(_display_device.StateFlags & DISPLAY_DEVICE_ACTIVE))
			continue;

		DEVMODE _dev_mode;
		_dev_mode.dmSize = sizeof(_dev_mode);
		_dev_mode.dmDriverExtra = 0;
		if (EnumDisplaySettingsExA(_display_device.DeviceName, ENUM_CURRENT_SETTINGS, &_dev_mode, 0))
		{
			_display_info.displayId.width = _dev_mode.dmPelsWidth;
			_display_info.displayId.height = _dev_mode.dmPelsHeight;
			_display_info.displayId.x = _dev_mode.dmPosition.x;
			_display_info.displayId.y = _dev_mode.dmPosition.y;
		}

		_display_info.name = _display_device.DeviceName;
		_display_info.displayInfo.idVal = _device_index;
    	_display_infos.push_back(_display_info);
	}

	for (int i = 0; i < _display_infos.size(); i ++) {
		HWND hDesktop = GetDesktopWindow();
		HDC hDC = GetDC(hDesktop);
		for (int i = 0; i < _display_infos.size(); i++)
		{
			ScreenDisplayInfo &info = _display_infos[i];
			dumpDisplayInfo(hDC, &info, i, _display_infos);
		}
	} 
	return _display_infos;
}