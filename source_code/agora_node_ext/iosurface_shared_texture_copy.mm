#include "iosurface_shared_texture_copy.h"

#if defined(__APPLE__)

#import <IOSurface/IOSurface.h>
#import <Metal/Metal.h>

#include <cstring>

namespace agora {
namespace rtc {
namespace electron {

namespace {

MTLPixelFormat ToMetalPixelFormat(SharedTexturePixelFormat format) {
  return format == SharedTexturePixelFormat::kBgra ? MTLPixelFormatBGRA8Unorm
                                                   : MTLPixelFormatRGBA8Unorm;
}

}// namespace

bool CreateGlobalIOSurfaceGpuCopy(const uint8_t *native_handle,
                                  std::size_t handle_size,
                                  SharedTexturePixelFormat pixel_format,
                                  uint32_t &iosurface_id,
                                  void *&retained_surface, std::string &error) {
  @autoreleasepool {
    if (native_handle == nullptr || handle_size != sizeof(uintptr_t)) {
      error = "nativeHandle must contain exactly 8 bytes";
      return false;
    }

    uintptr_t source_bits = 0;
    std::memcpy(&source_bits, native_handle, sizeof(source_bits));
    IOSurfaceRef source = reinterpret_cast<IOSurfaceRef>(source_bits);
    if (source == nullptr) {
      error = "ioSurface contains a null IOSurfaceRef";
      return false;
    }
    const size_t width = IOSurfaceGetWidth(source);
    const size_t height = IOSurfaceGetHeight(source);
    const size_t bytes_per_row = IOSurfaceGetBytesPerRow(source);
    const size_t allocation_size = IOSurfaceGetAllocSize(source);
    if (width == 0 || height == 0 || bytes_per_row == 0
        || allocation_size == 0) {
      error = "source IOSurface dimensions are invalid";
      return false;
    }

    NSMutableDictionary *properties = [@{
      (__bridge NSString *) kIOSurfaceWidth: @(width),
      (__bridge NSString *) kIOSurfaceHeight: @(height),
      (__bridge NSString *) kIOSurfaceBytesPerElement: @4,
      (__bridge NSString *) kIOSurfaceBytesPerRow: @(bytes_per_row),
      (__bridge NSString *) kIOSurfaceAllocSize: @(allocation_size),
      (__bridge NSString *) kIOSurfaceIsGlobal: @YES,
    } mutableCopy];
    const OSType source_surface_format = IOSurfaceGetPixelFormat(source);
    if (source_surface_format != 0) {
      properties[(__bridge NSString *) kIOSurfacePixelFormat] =
          @(source_surface_format);
    }
    IOSurfaceRef destination =
        IOSurfaceCreate((__bridge CFDictionaryRef) properties);
    [properties release];
    if (destination == nullptr) {
      error = "could not create a global IOSurface";
      return false;
    }

    id<MTLDevice> device = MTLCreateSystemDefaultDevice();
    id<MTLCommandQueue> queue = [device newCommandQueue];
    MTLTextureDescriptor *descriptor = [MTLTextureDescriptor
        texture2DDescriptorWithPixelFormat:ToMetalPixelFormat(pixel_format)
                                     width:width
                                    height:height
                                 mipmapped:NO];
    descriptor.storageMode = MTLStorageModeShared;
    descriptor.usage = MTLTextureUsageShaderRead | MTLTextureUsageShaderWrite
        | MTLTextureUsageRenderTarget;
    id<MTLTexture> source_texture = [device newTextureWithDescriptor:descriptor
                                                           iosurface:source
                                                               plane:0];
    id<MTLTexture> destination_texture =
        [device newTextureWithDescriptor:descriptor
                               iosurface:destination
                                   plane:0];
    if (device == nil || queue == nil || source_texture == nil
        || destination_texture == nil) {
      [source_texture release];
      [destination_texture release];
      [queue release];
      [device release];
      CFRelease(destination);
      error = "could not create Metal textures for IOSurface copy";
      return false;
    }

    id<MTLCommandBuffer> command_buffer = [queue commandBuffer];
    id<MTLBlitCommandEncoder> encoder = [command_buffer blitCommandEncoder];
    [encoder copyFromTexture:source_texture
                 sourceSlice:0
                 sourceLevel:0
                sourceOrigin:MTLOriginMake(0, 0, 0)
                  sourceSize:MTLSizeMake(width, height, 1)
                   toTexture:destination_texture
            destinationSlice:0
            destinationLevel:0
           destinationOrigin:MTLOriginMake(0, 0, 0)];
    [encoder endEncoding];
    [command_buffer commit];
    [command_buffer waitUntilCompleted];
    if (command_buffer.status != MTLCommandBufferStatusCompleted) {
      const char *description =
          command_buffer.error.localizedDescription.UTF8String;
      error =
          description == nullptr ? "Metal IOSurface copy failed" : description;
      [source_texture release];
      [destination_texture release];
      [queue release];
      [device release];
      CFRelease(destination);
      return false;
    }

    iosurface_id = IOSurfaceGetID(destination);
    if (iosurface_id == 0) {
      [source_texture release];
      [destination_texture release];
      [queue release];
      [device release];
      CFRelease(destination);
      error = "global IOSurface has no ID";
      return false;
    }
    [source_texture release];
    [destination_texture release];
    [queue release];
    [device release];
    retained_surface = destination;
    error.clear();
    return true;
  }
}

void ReleaseGlobalIOSurface(void *retained_surface) {
  if (retained_surface != nullptr) {
    CFRelease(reinterpret_cast<IOSurfaceRef>(retained_surface));
  }
}

}// namespace electron
}// namespace rtc
}// namespace agora

#endif
