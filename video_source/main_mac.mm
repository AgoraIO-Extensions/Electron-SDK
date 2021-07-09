#import <Foundation/Foundation.h>
#include <thread>  
#include "loguru.hpp"
#include "video_source.h"
#import <Cocoa/Cocoa.h>

int main(int argc, char* argv[])
{
    initLogService();
    if (argc < 3){
        return 0;
    }

    std::string param;
    for (int i = 1; i < argc; i++) {
        param.append(argv[i]);
        param.append(" ");
    }
    
    @autoreleasepool {
        NSApplication * application = [NSApplication sharedApplication];
        auto _thread = new std::thread([param](){
            run(param);
        });
        [NSApp run];
    }
}