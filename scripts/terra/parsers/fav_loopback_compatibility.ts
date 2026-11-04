import {
  CXXFile,
  CXXTYPE,
  SimpleTypeKind,
} from '@agoraio-extensions/cxx-parser';
import { ParseResult, TerraContext } from '@agoraio-extensions/terra-core';
import { getIrisApiIdValue } from '@agoraio-extensions/terra_shared_configs';

/** Keep the TypeScript surface and wire format compatible with the FAV Iris package. */
export default function (
  _context: TerraContext,
  args: { sdkVersion: string },
  result?: ParseResult
): ParseResult | undefined {
  if (!result || args.sdkVersion !== '4.5.3.135') {
    return result;
  }

  for (const file of result.nodes as CXXFile[]) {
    for (const node of file.nodes) {
      if (node.__TYPE !== CXXTYPE.Clazz) {
        continue;
      }
      const clazz = node.asClazz();
      if (clazz.name === 'IMediaEngine') {
        const methods = clazz.methods;
        const overloads = methods.filter(
          (method) => method.name === 'createLoopbackAudioTrack'
        );
        const legacy = overloads.find(
          (method) => method.parameters.length === 1
        );
        const explicit = overloads.find(
          (method) => method.parameters.length === 2
        );
        if (
          overloads.length !== 2 ||
          !legacy ||
          !explicit ||
          getIrisApiIdValue(legacy) !==
            'MediaEngine_createLoopbackAudioTrack_599af35' ||
          getIrisApiIdValue(explicit) !==
            'MediaEngine_createLoopbackAudioTrack_7dc7df9' ||
          explicit.parameters[1]?.name !== 'enable'
        ) {
          throw new Error(
            'Review the FAV loopback signatures before generating TypeScript'
          );
        }

        // Native create(config) is explicitly documented as create(config, true).
        // One optional parameter preserves both calls without duplicate implementations.
        explicit.parameters[1]!.default_value = 'true';
        const first = methods.findIndex(
          (method) => method.name === legacy.name
        );
        clazz.methods = methods.flatMap((method, index) =>
          index === first
            ? [explicit]
            : method.name === legacy.name
            ? []
            : [method]
        );
      }

      if (clazz.name === 'IAudioDeviceManager') {
        const method = clazz.methods.find(
          (entry) => entry.name === 'startRecordingDeviceTest'
        );
        if (!method || method.parameters.length !== 1) {
          throw new Error('Review the FAV recording-device test signature');
        }
        const apiId =
          method.user_data?.OverrideNodeParser?.redirectIrisApiId ||
          getIrisApiIdValue(method);
        if (
          apiId !== 'AudioDeviceManager_startRecordingDeviceTest_db21a14' &&
          apiId !== 'AudioDeviceManager_startRecordingDeviceTest_46f8ab7'
        ) {
          throw new Error(
            `Review the recording-device test Iris wire contract: ${apiId}`
          );
        }
        // The shared overlay declares a configuration struct that this Native version
        // does not have. Its released Iris still accepts an integer interval.
        method.parameters[0]!.name = 'indicationInterval';
        Object.assign(method.parameters[0]!.type, {
          name: 'int',
          source: 'int',
          kind: SimpleTypeKind.value_t,
          is_const: false,
          is_builtin_type: true,
          namespaces: [],
          template_arguments: [],
          clang_qualtype: 'int',
        });
        method.user_data = {
          ...method.user_data,
          IrisApiIdParser: {
            ...method.user_data?.IrisApiIdParser,
            value: 'AudioDeviceManager_startRecordingDeviceTest_46f8ab7',
          },
          OverrideNodeParser: {
            ...method.user_data?.OverrideNodeParser,
            redirectIrisApiId:
              'AudioDeviceManager_startRecordingDeviceTest_46f8ab7',
            sourceApiSignature:
              'virtual int startRecordingDeviceTest(int indicationInterval) = 0;',
          },
        };
      }
    }
  }
  return result;
}
