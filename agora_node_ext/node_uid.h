/*
* Copyright (c) 2017 Agora.io
* All rights reserved.
* Proprietry and Confidential -- Agora.io
*/

/*
*  Created by Wang Yongli, 2017
*/

#ifndef AGORA_NODE_UID_H
#define AGORA_NODE_UID_H

#include <IAgoraRtcEngine.h>
#include "node.h"
#include "node_napi_api.h"
namespace agora {
    namespace rtc {
        /**
         * The class is used to translation from uid_t to string and vice versa.
         * Currently uid_t is uint32 type, and maybe string type in future.
         */
#define NODE_UID_TYPE int32
        class NodeUid
        {
        public:
            NodeUid(uid_t id)
                : m_id(id)
            {}
            ~NodeUid()
            {}

            operator uid_t()
            {
                return m_id;
            }

            /**
             * To generate V8 type from uid_t
             * @param isolate : Isolate context
             * @param id : uid_t type to be transferred to V8 type.
             */
            static Local<Value> getNodeValue(Isolate *isolate, uid_t id)
            {
                return v8::Number::New(isolate, id);
            }

            /**
             * To get uid_t type value from V8 type
             * @param value : the V8 value type contains uid_t type value.
             * @param id : the uid_t type reference used to store the value
             */
            static napi_status getUidFromNodeValue(const Local<Value>& value, uid_t& id)
            {
                napi_status status = napi_get_value_uint32_(value, id);
                return status;
            }

        private:
            uid_t m_id;
        };
    }
}

#endif
