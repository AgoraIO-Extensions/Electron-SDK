#include "HookPlugin.h"
#include "CicleBuffer.h"
#include <stdint.h>
CAudioCaptureCallback::CAudioCaptureCallback()
{
    m_lpHookAudioCicleBuffer = new CicleBuffer(48000 * 2 * 2, 0);
    m_lpHookAudioCicleBuffer->flushBuffer();
}

CAudioCaptureCallback::~CAudioCaptureCallback()
{
    if (m_lpHookAudioCicleBuffer) {
        delete[] m_lpHookAudioCicleBuffer;
        m_lpHookAudioCicleBuffer = nullptr;
    }
}

void CAudioCaptureCallback::onCaptureStart()
{

}

void CAudioCaptureCallback::onCaptureStop()
{
}

void CAudioCaptureCallback::onCapturedData(void* data, UINT dataLen, WAVEFORMATEX* format)
{
    m_lpHookAudioCicleBuffer->writeBuffer(data, dataLen);
}

//HookPlugin
CHookPlugin::CHookPlugin()
    : bForceRestartPlayer(false)
    , musicPlayerPath("")
{
    pPlayerData = new BYTE[0x800000];
}

CHookPlugin::~CHookPlugin()
{
    delete[] pPlayerData;
}

int16_t MixerAddS16(int16_t var1, int16_t var2)
{
    static const int32_t kMaxInt16 = 32767;
    static const int32_t kMinInt16 = -32768;
    int32_t tmp = (int32_t)var1 + (int32_t)var2;
    int16_t out16;

    if (tmp > kMaxInt16) {
        out16 = kMaxInt16;
    }
    else if (tmp < kMinInt16) {
        out16 = kMinInt16;
    }
    else {
        out16 = (int16_t)tmp;
    }

    return out16;
}

void MixerAddS16(int16_t* src1, const int16_t* src2, size_t size)
{
    for (size_t i = 0; i < size; ++i) {
        src1[i] = MixerAddS16(src1[i], src2[i]);
    }
}

bool CHookPlugin::onPluginRecordAudioFrame(AudioPluginFrame* audioFrame)
{
				if (!audioFrame) return true;

				SIZE_T nSize = audioFrame->channels*audioFrame->samples * 2;
				unsigned int datalen = 0;
				callback.getCicleBuffer()->readBuffer(pPlayerData, nSize, &datalen);

				int nMixLen = nSize;
				if (nSize > 0 && datalen > 0 && audioFrame->buffer)
				{
								int nMixLen = datalen > nSize ? nSize : datalen;
								MixerAddS16((int16_t*)audioFrame->buffer, (int16_t*)pPlayerData, (audioFrame->channels * audioFrame->bytesPerSample) *  audioFrame->samples / sizeof(int16_t));
				}
				return true;
}

bool CHookPlugin::onPluginPlaybackAudioFrame(AudioPluginFrame* audioFrame)
{
	return true;
}

bool CHookPlugin::onPluginMixedAudioFrame(AudioPluginFrame* audioFrame)
{
    return true;
}

bool CHookPlugin::onPluginPlaybackAudioFrameBeforeMixing(unsigned int uid, AudioPluginFrame* audioFrame)
{
    return true;
}

bool CHookPlugin::load(const char* path)
{
    if (strlen(path) == 0)
        return false;
    char szFileName[MAX_PATH] = { 0 };
    strncpy_s(szFileName, MAX_PATH, path, strlen(path));
    strcat_s(szFileName, MAX_PATH, "agora_playhook_sdk.dll");

    if (hModule == NULL)
        hModule = LoadLibrary(szFileName);

    if (hModule) {

        createPlayerHookerInstanceFunc = (createPlayerHookerInstanceFuncType*)GetProcAddress(hModule, "createPlayerHookerInstance");
        destoryPlayerHookerInstanceFunc = (destoryPlayerHookerInstanceFuncType*)GetProcAddress(hModule, "destoryPlayerHookerInstance");
        if (createPlayerHookerInstanceFunc) {
            m_lpAgoraPlayerHook = createPlayerHookerInstanceFunc();
        }

        if (m_lpAgoraPlayerHook)
            return true;
        else
            FreeLibrary(hModule);
    }
    // m_lpAgoraPlayerHook = createPlayerHookerInstance();
    if (m_lpAgoraPlayerHook)
        return true;
    return false;
}

bool CHookPlugin::unLoad()
{
				if (m_lpAgoraPlayerHook) {
								destoryPlayerHookerInstanceFunc(m_lpAgoraPlayerHook);
								m_lpAgoraPlayerHook = NULL;
				}

				if (hModule) {
								FreeLibrary(hModule);
								hModule = NULL;
				}
				return true;
}
/*
bool CHookPlugin::load(const char* path)
{
				if (!m_lpAgoraPlayerHook)
								m_lpAgoraPlayerHook = createPlayerHookerInstance();

				if (m_lpAgoraPlayerHook)
								return true;

				return false;
}

bool CHookPlugin::unLoad()
{
				if (m_lpAgoraPlayerHook) {
								destoryPlayerHookerInstance(m_lpAgoraPlayerHook);
								m_lpAgoraPlayerHook = NULL;
				}
				return true;
}
*/

bool CHookPlugin::enable()
{
    if (!m_lpAgoraPlayerHook)
        return false;

#ifdef UNICODE
    int ret = m_lpAgoraPlayerHook->startHook(playerPath, bForceRestartPlayer);
#else
    WCHAR wsczPath[MAX_PATH] = { 0 };
    MultiByteToWideChar(CP_UTF8, 0, musicPlayerPath.c_str(), MAX_PATH, wsczPath, MAX_PATH);
    int ret = m_lpAgoraPlayerHook->startHook(wsczPath, bForceRestartPlayer);
#endif
    if (ret != 0)
        return false;

    ret = m_lpAgoraPlayerHook->startAudioCapture(&callback);
    if (ret != 0)
        return false;

    return true;
}

bool CHookPlugin::disable()
{
				if (!m_lpAgoraPlayerHook) {
								return false;
				}

				m_lpAgoraPlayerHook->stopHook();
				m_lpAgoraPlayerHook->stopAudioCapture();
				return true;
}

bool CHookPlugin::setStringParameters(const char* param, const char* value)
{
    std::string strParam = param;
    if (strParam.compare("plugin.hookAudio.playerPath") == 0) {
        musicPlayerPath = value;
    }
    else if (strParam.compare("plugin.hookAudio.hookpath") == 0) {
        hookpath = value;
    }
    return true;
}

bool CHookPlugin::setBoolParameters(const char* param, bool value)
{
 std::string strParam = param;
 if (strParam.compare("plugin.hookAudio.forceRestart") == 0) {
  bForceRestartPlayer = value;
 }
 return true;
}

void CHookPlugin::release()
{
    delete this;
}

IAudioFramePlugin* createAudioFramePlugin()
{
    return new CHookPlugin;
}