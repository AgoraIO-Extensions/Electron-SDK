/*
* Copyright (c) 2018 Agora.io
* All rights reserved.
* Proprietary and Confidential -- Agora.io
*/

/*
*  Created by Wang Yongli, 2018
*/

#ifndef NODE_ERROR_H
#define NODE_ERROR_H

enum node_error
{
    node_ok = 0,
    node_generic_error,
    node_invalid_args,
    node_low_memory,
    node_status_error
};

#endif