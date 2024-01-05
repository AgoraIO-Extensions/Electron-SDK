import { SimpleType, SimpleTypeKind } from '@agoraio-extensions/cxx-parser';
import {
  UpdateNodeConfig,
  updateSimpleTypeName,
} from '@agoraio-extensions/terra_shared_configs';

module.exports = {
  '^Optional<(.*)>': '$1',
  '^(.*)::(.*)': '$2',
  '^AString$': 'string',
  '^user_id_t$': 'string',
  '^view_t$': 'any',
  '^view_t\\*$': 'any[]',
  '^uid_t$': 'number',
  '^const uid_t\\*$': 'number[]',
  '^track_id_t$': 'number',
  '^video_track_id_t$': 'number',
  '^conn_id_t$': 'number',
  '^char$': 'number',
  '^unsigned int$': 'number',
  '^size_t$': 'number',
  '^unsigned short$': 'number',
  '^unsigned char$': 'number',
  '^float$': 'number',
  '^double$': 'number',
  '^int(.*)_t$': 'number',
  '^uint(.*)_t$': 'number',
  '^long$': 'number',
  '^long long$': 'number',
  '^int$': 'number',
  '^bool$': 'boolean',
  '^intptr_t$': 'number',
  '^uintptr_t$': 'number',
  '^const char \\*$': 'string',
  'customHook': (node: SimpleType, configs: UpdateNodeConfig) => {
    let type = node.name;
    if (!type) {
      type = node.source;
    }
    switch (node.asSimpleType().kind) {
      case SimpleTypeKind.value_t:
        type = updateSimpleTypeName(type, configs);
        break;
      case SimpleTypeKind.pointer_t:
        if (type == 'char') {
          if (node.source.endsWith('**')) {
            type = 'string[]';
          } else {
            type = 'string';
          }
        } else if (type == 'uint8_t' || type == 'unsigned char') {
          type = 'Uint8Array';
        } else if (type == 'void') {
          type = 'any';
        } else {
          type = updateSimpleTypeName(type, configs);
        }
        break;
      case SimpleTypeKind.reference_t:
        type = updateSimpleTypeName(type, configs);
        break;
      case SimpleTypeKind.array_t:
        if (type == 'char') {
          if (node.source.endsWith('**')) {
            type = 'string[]';
          } else {
            type = 'string';
          }
        } else if (type == 'void') {
          type = 'Uint8Array';
        } else {
          type = updateSimpleTypeName(type, configs) + '[]';
        }
        break;
      case SimpleTypeKind.template_t:
        type = updateSimpleTypeName(node.template_arguments[0]!, configs);
        break;
      default:
        type = updateSimpleTypeName(type, configs);
        break;
    }
    return type;
  },
};
