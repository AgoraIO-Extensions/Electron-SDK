/*
* Copyright (c) 2018 Agora.io
* All rights reserved.
* Proprietary and Confidential -- Agora.io
*/

/*
*  Created by Wang Yongli, 2018
*/

#include "node_process.h"
#include <thread>
#include <memory>
#include <Windows.h>
#include "node_log.h"
#include "loguru.hpp"

class NodeProcessWinImpl : public INodeProcess
{
public:
    NodeProcessWinImpl(HANDLE hProcess, int pid);
    ~NodeProcessWinImpl();

    virtual void Monitor(std::function<void(INodeProcess*)> callback) override;
    virtual int GetProcessId() override;

    bool TerminateNodeProcess();
    
private:
    int m_pid;
    HANDLE m_hProcess;
};

NodeProcessWinImpl::NodeProcessWinImpl(HANDLE hProcess, int pid)
    : m_pid(pid)
    , m_hProcess(hProcess)
{
    LOG_F(INFO, "%s created.\n", __FUNCTION__);
}

NodeProcessWinImpl::~NodeProcessWinImpl() 
{
    LOG_F(INFO, "%s deleted\n", __FUNCTION__);
}

int NodeProcessWinImpl::GetProcessId()
{
    return m_pid;
}

bool NodeProcessWinImpl::TerminateNodeProcess()
{
    LOG_F(INFO, "%s, to terminate process.\n", __FUNCTION__);
    if (m_hProcess != NULL) {
        TerminateProcess(m_hProcess, 0);
        CloseHandle(m_hProcess);
        m_hProcess = NULL;
        m_pid = 0;
    }
    else {
        LOG_F(INFO, "%s, process is null.\n", __FUNCTION__);
    }
    return true;
}

void NodeProcessWinImpl::Monitor(std::function<void(INodeProcess*)> callback)
{
    LOG_F(INFO, "%s, to monitor\n", __FUNCTION__);
    HANDLE hp = m_hProcess;
    INodeProcess *pProcess = static_cast<INodeProcess*>(this);
    auto thd = std::thread([hp, pProcess, callback] {
        if (hp != NULL) {
            LOG_F(INFO, "Waiting for process\n");
            WaitForSingleObject(hp, INFINITE);
        }
        else {
            LOG_F(INFO, "monitor : process is null\n");
        }
        LOG_F(INFO, "Monitor complete.\n");
        if (callback) {
            callback(pProcess);
        }
    });
    thd.detach();
}

INodeProcess* INodeProcess::CreateNodeProcess(const char* path, const char** params, unsigned int flag)
{
    STARTUPINFOA info = { 0 };
    info.cb = sizeof(info);
    PROCESS_INFORMATION pi = { 0 };
    DWORD err;
    std::string cmdline(path);
    const char** param = &params[0];
    while (*param) {
        cmdline += *param;
        cmdline += " ";
        param++;
    }
    cmdline += '\0';
    LOG_F(INFO, "%s, INodeProcess with success ", __FUNCTION__ );
    if (cmdline.empty()) {
        LOG_F(INFO, "%s, INodeProcess with error:cmdline.empty() ", __FUNCTION__ );
        LOG_F(INFO, "%s, cmdline empty\n", __FUNCTION__);
        return nullptr;
    }

    LOG_F(INFO, "%s, cmdline : %s\n", __FUNCTION__, cmdline.c_str());
    if (!CreateProcessA(NULL, (LPSTR)cmdline.c_str(), NULL, NULL, FALSE, CREATE_NO_WINDOW, NULL, NULL, &info, &pi))
    {
        err = GetLastError();
        LOG_F(INFO, "%s, create process failed with error %d\n", __FUNCTION__ ,err);
        LOG_F(INFO, "%s, create process failed with error %d\n", __FUNCTION__, err);
        return nullptr;
    }
    LOG_F(INFO, "%s success.\n", __FUNCTION__);
    CloseHandle(pi.hThread);
    NodeProcessWinImpl *pProcess = new NodeProcessWinImpl(pi.hProcess, pi.dwProcessId);
    if (!pProcess) {
        LOG_F(INFO, "create process failed with error :CloseHandle");
        TerminateProcess(pi.hProcess, 0);
        CloseHandle(pi.hProcess);
        return nullptr;
    }
    return pProcess;
}

INodeProcess* INodeProcess::OpenNodeProcess(int pid)
{
    HANDLE hProcess = OpenProcess(SYNCHRONIZE, FALSE, pid);
    if (!hProcess) {
        LOG_F(INFO, "%s, open process failed.\n", __FUNCTION__);
        return nullptr;
    }

    auto *pProcess = new NodeProcessWinImpl(hProcess, pid);
    if (!pProcess) {
        CloseHandle(hProcess);
        return nullptr;
    }
    return pProcess;
}

void INodeProcess::DestroyNodeProcess(INodeProcess* pProcess, bool terminate)
{
    if (!pProcess) {
        LOG_F(INFO, "%s, null process\n", __FUNCTION__);
        return;
    }
    NodeProcessWinImpl *pWinProcess = static_cast<NodeProcessWinImpl*>(pProcess);
    if (!pWinProcess) {
        LOG_F(INFO, "%s, not winprocess\n", __FUNCTION__);
        return;
    }
    if (terminate) {
        pWinProcess->TerminateNodeProcess();
    }

    delete pWinProcess;
}

int INodeProcess::GetCurrentNodeProcessId()
{
    return GetCurrentProcessId();
}

bool INodeProcess::getCurrentModuleFileName(std::string& targetPath)
{
    HMODULE module = NULL;
    if (!GetModuleHandleExA(GET_MODULE_HANDLE_EX_FLAG_FROM_ADDRESS, (LPCSTR)&getCurrentModuleFileName, &module)) {
        return false;
    }

    char path[MAX_PATH] = { 0 };
    if (!GetModuleFileNameA(module, path, MAX_PATH)) {
        return false;
    }
    targetPath.assign(path);
    return true;
}