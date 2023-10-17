#include <chrono>
#include <thread>
#include "node_log.h"
#include "video_source.h"
#include "dump.h"

void miniDmpSenderCallback(UINT nCode, LPVOID lVal1, LPVOID lVal2) {
  LOG_ERROR(
      "Crash happened, exception code : 0x%08x val0: 0x%08x val1 0x%08x\n",
      nCode, (std::uintptr_t)lVal1, (std::uintptr_t)lVal2);
}

int main(int argc, char *argv[]) {
  initLogService();
  initializeDump(L"3.6.1.19", miniDmpSenderCallback);

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
