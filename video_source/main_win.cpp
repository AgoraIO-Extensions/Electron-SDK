#include "node_log.h"
#include "video_source.h"
#include <DbgHelp.h>
#include <ShlObj.h>
#include <chrono>
#include <thread>

static void dump_file(const wchar_t *path, EXCEPTION_POINTERS *exception) {
  HANDLE file = CreateFile(path, GENERIC_WRITE, 0, NULL, CREATE_ALWAYS,
                           FILE_ATTRIBUTE_NORMAL, NULL);

  MINIDUMP_EXCEPTION_INFORMATION dump;
  dump.ExceptionPointers = exception;
  dump.ThreadId = GetCurrentThreadId();
  dump.ClientPointers = TRUE;

  MiniDumpWriteDump(GetCurrentProcess(), GetCurrentProcessId(), file,
                    MiniDumpWithFullMemory, &dump, NULL, NULL);

  CloseHandle(file);
}

static long exception_handler(EXCEPTION_POINTERS *ep) {
  std::wstring dmp_path;
  wchar_t buffer[MAX_PATH] = {0};

  if (S_OK == ::SHGetFolderPathW(NULL, CSIDL_LOCAL_APPDATA | CSIDL_FLAG_CREATE,
                                 NULL, SHGFP_TYPE_CURRENT, buffer))
    dmp_path = buffer;

  if (!dmp_path.empty())
    if (dmp_path.back() != L'\\')
      dmp_path.push_back(L'\\');
    else
      dmp_path = L".\\";

  dmp_path.append(L"videosource.dmp");

  LOG_ERROR("Unhandled exception, auto write dmp file to LocalAppData\\videosource.dmp...");

  dump_file(dmp_path.c_str(), ep);

  LOG_ERROR("Write dmp file finished");

  return EXCEPTION_EXECUTE_HANDLER;
}

int main(int argc, char *argv[]) {
  SetUnhandledExceptionFilter((LPTOP_LEVEL_EXCEPTION_FILTER)exception_handler);

  initLogService();

  if (argc < 3) {
    LOG_ERROR("Need at least 3 parameter. Current parameter num : %d\n", argc);
    return 0;
  }

  std::string param;
  LOG_INFO("Args : %s\n", param.c_str());

  for (int i = 1; i < argc; i++) {
    param.append(argv[i]);
    param.append(" ");
  }
  run(param);
}
