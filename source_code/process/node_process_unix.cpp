
/*
 * Copyright (c) 2018 Agora.io
 * All rights reserved.
 * Proprietary and Confidential -- Agora.io
 */

/*
 *  Created by Wang Yongli, 2018
 */
#include "node_base.h"
#include "node_process.h"
#include <dlfcn.h>
#include <fcntl.h>
#include <mach-o/dyld.h>
#include <memory>
#include <sstream>
#include <sys/socket.h>
#include <thread>
#include <unistd.h>

class NodeProcessUnixImpl : public INodeProcess {
public:
  NodeProcessUnixImpl(int fd, int pid);
  ~NodeProcessUnixImpl();

  virtual void Monitor(std::function<void(INodeProcess *)> callback) override;
  virtual int GetProcessId() override;

  bool TerminateNodeProcess();

private:
  int m_pid;
  int m_fd;
};

NodeProcessUnixImpl::NodeProcessUnixImpl(int fd, int pid)
    : m_pid(pid), m_fd(fd) {}

NodeProcessUnixImpl::~NodeProcessUnixImpl() {}

int NodeProcessUnixImpl::GetProcessId() { return m_pid; }

bool NodeProcessUnixImpl::TerminateNodeProcess() { return true; }

void NodeProcessUnixImpl::Monitor(
    std::function<void(INodeProcess *)> callback) {
  auto monitor = std::thread([callback, this] {
    char tmp;
    read(this->m_fd, &tmp, 1);
    callback(this);
  });
  monitor.detach();
}

#define VS_PARAM_NUM 3
INodeProcess *INodeProcess::CreateNodeProcess(const char *path,
                                              const char **params,
                                              unsigned int flag) {
  LOG_F(INFO, "TO start process, path : %s", path);
  if (!path || !params || !params[0]) {
    LOG_F(INFO, "Parameter error");
    return nullptr;
  }
  int fd[2] = {0, 0};
  if (socketpair(AF_UNIX, SOCK_STREAM, 0, fd) != 0) {
    LOG_F(INFO, "socket pair fail");
    return nullptr;
  }
  pid_t pid = fork();
  if (pid == -1) {
    LOG_F(INFO, "fork fail.");
    // fork failed.
    return nullptr;
  } else if (pid == 0) {
    LOG_F(INFO, "CreateNodeProcess ");
    // child process here.
    close(fd[0]);
    int flag = fcntl(fd[1], F_GETFD);
    flag &= ~O_CLOEXEC;
    int result = fcntl(fd[1], F_SETFD, flag);
    if (result == 0) {

      std::stringstream ss;
      ss << fd[1];
      std::string fd_param = "fd:" + ss.str();
      const char *vs_params[] = {params[0],        params[1], params[2],
                                 fd_param.c_str(), params[3], params[4],
                                 nullptr};
      LOG_F(INFO, "====execv : %s, %s, %s, %s,%s, %s\n", vs_params[0],
            vs_params[1], vs_params[2], vs_params[3], vs_params[4],
            vs_params[5]);
      execv((std::string(path) + vs_params[0]).c_str(), (char **)vs_params);
    } else {
      LOG_F(INFO, "fcntl error.");
    }
  } else {
    // parent process
    close(fd[1]);
    NodeProcessUnixImpl *pProcess = new NodeProcessUnixImpl(fd[0], pid);
    return pProcess;
  }
  return nullptr;
}

INodeProcess *INodeProcess::OpenNodeProcess(int pid) {
  /**
   * On unix, treate the parameter as the socketpair fd
   */
  NodeProcessUnixImpl *pProcess = new NodeProcessUnixImpl(pid, getppid());
  return pProcess;
}

void INodeProcess::DestroyNodeProcess(INodeProcess *pProcess, bool terminate) {}

int INodeProcess::GetCurrentNodeProcessId() { return getpid(); }

bool INodeProcess::getCurrentModuleFileName(std::string &path) {
  Dl_info info;
  if (dladdr((const void *)INodeProcess::getCurrentModuleFileName, &info)) {
    path.assign(info.dli_fname);
    return true;
  }
  return false;
}
