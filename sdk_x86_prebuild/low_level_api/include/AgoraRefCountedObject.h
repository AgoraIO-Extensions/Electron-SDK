
// Copyright (c) 2020 Agora.io. All rights reserved

// This program is confidential and proprietary to Agora.io.
// And may not be copied, reproduced, modified, disclosed to others, published
// or used, in whole or in part, without the express prior written permission
// of Agora.io.
#pragma once
#include <atomic>
#include "AgoraRefPtr.h"

namespace agora {
class RefCounter {
 public:
  explicit RefCounter(int ref_count) : ref_count_(ref_count) {}
  RefCounter() = delete;

  void IncRef() { ref_count_.fetch_add(1); }

  /**
   *  Returns true if this was the last reference, and the resource protected by
   * the reference counter can be deleted.
   */
  agora::RefCountReleaseStatus DecRef() {
    return (ref_count_.fetch_sub(1) == 1) ? agora::RefCountReleaseStatus::kDroppedLastRef
                                          : agora::RefCountReleaseStatus::kOtherRefsRemained;
  }

  /**
   * Return whether the reference count is one. If the reference count is used
   * in the conventional way, a reference count of 1 implies that the current
   * thread owns the reference and no other thread shares it. This call performs
   * the test for a reference count of one, and performs the memory barrier
   * needed for the owning thread to act on the resource protected by the
   * reference counter, knowing that it has exclusive access.
   */
  bool HasOneRef() const { return ref_count_.load() == 1; }

 private:
  volatile std::atomic<int> ref_count_;
};

/**
 * Agora sample code for wrapping a class that needs to inherit RefCountInterface in order
 * to be held by agora::agora_refptr 
 * Usage:
 *  agora::agora_refptr<TypeName> ptr = new RefCountedObject<TypeName>(Arg1, Arg2, ...);
 */

template <class T>
class RefCountedObject : public T {
 public:
  RefCountedObject() {}
  RefCountedObject(RefCountedObject&) = delete;
  RefCountedObject& operator=(RefCountedObject&) = delete;

  template <class P0>
  explicit RefCountedObject(P0&& p0) : T(std::forward<P0>(p0)) {}

  template <class P0, class P1, class... Args>
  RefCountedObject(P0&& p0, P1&& p1, Args&&... args)
      : T(std::forward<P0>(p0), std::forward<P1>(p1), std::forward<Args>(args)...) {}

  virtual void AddRef() const { ref_count_.IncRef(); }

  virtual agora::RefCountReleaseStatus Release() const {
    const auto status = ref_count_.DecRef();
    if (status == agora::RefCountReleaseStatus::kDroppedLastRef) {
      delete this;
    }
    return status;
  }

  /**
   * Return whether the reference count is one. If the reference count is used
   * in the conventional way, a reference count of 1 implies that the current
   * thread owns the reference and no other thread shares it. This call
   * performs the test for a reference count of one, and performs the memory
   * barrier needed for the owning thread to act on the object, knowing that it
   * has exclusive access to the object.
   */
  virtual bool HasOneRef() const { return ref_count_.HasOneRef(); }

 protected:
  virtual ~RefCountedObject() {}

  mutable agora::RefCounter ref_count_{0};
};
}  // namespace agora
