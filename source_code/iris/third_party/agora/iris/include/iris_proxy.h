//
// Created by LXH on 2021/4/29.
//

#ifndef IRIS_PROXY_H_
#define IRIS_PROXY_H_

namespace agora {
namespace iris {
class IRIS_CPP_API IrisProxy {
 public:
  virtual int CallApi(unsigned int api_type, const char *params,
                      char *result) = 0;

  virtual int CallApi(unsigned int api_type, const char *params, void *buffer,
                      char *result) = 0;
};
}// namespace iris
}// namespace agora

#endif//IRIS_PROXY_H_
