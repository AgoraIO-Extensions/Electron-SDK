import { ColorSpace } from '../../Private/AgoraMediaBase';
import { AgoraEnv } from '../../Utils';

/**
 * Color description of a stream in ITU-T H.273 code points (the values used by H.264/H.265 VUI and
 * by the SDK's ColorSpace: primaries / transfer / matrix; 2 = unspecified).
 * @ignore
 */
export type CodedColor = {
  primaries?: number;
  transfer?: number;
  matrix?: number;
  fullRange?: boolean;
};

const PRIMARIES: { [k: number]: string } = {
  1: 'bt709',
  5: 'bt470bg',
  6: 'smpte170m',
  9: 'bt2020',
  12: 'smpte432',
};
const TRANSFER: { [k: number]: string } = {
  1: 'bt709',
  6: 'smpte170m',
  8: 'linear',
  13: 'iec61966-2-1',
  16: 'pq',
  18: 'hlg',
};
const MATRIX: { [k: number]: string } = {
  0: 'rgb',
  1: 'bt709',
  5: 'bt470bg',
  6: 'smpte170m',
  9: 'bt2020-ncl',
};

/**
 * Decide the VideoColorSpaceInit handed to Chromium for a <video> frame.
 *
 * - 'sdk' (default): same colors as the SDK WebGL renderer. Only matrix and range are taken from
 *   the stream (BT.709 if the matrix is BT.709, BT.2020 if BT.2020, otherwise BT.601); primaries
 *   and transfer are reported as BT.709 so Chromium does no gamut or transfer conversion.
 * - 'browser': same colors as Chromium (Web SDK). A stream whose primaries, transfer and matrix are
 *   not all specified is shown as BT.709 when it is at least 720 lines high and as BT.601 below,
 *   for all three; a fully specified stream is shown as specified.
 * @ignore
 */
export function videoElementColorSpace(
  c: CodedColor | undefined,
  height: number,
  mode: string = AgoraEnv.videoElementColorMode ?? 'sdk'
): any {
  const fullRange = !!c?.fullRange;
  if (mode === 'browser') {
    if (isFullySpecified(c)) {
      return {
        primaries: PRIMARIES[c!.primaries!],
        transfer: TRANSFER[c!.transfer!],
        matrix: MATRIX[c!.matrix!],
        fullRange,
      };
    }
    const hd = height >= 720;
    return {
      primaries: hd ? 'bt709' : 'smpte170m',
      transfer: hd ? 'bt709' : 'smpte170m',
      matrix: hd ? 'bt709' : 'smpte170m',
      fullRange,
    };
  }
  const matrix =
    c?.matrix === 1 ? 'bt709' : c?.matrix === 9 ? 'bt2020-ncl' : 'smpte170m';
  return { primaries: 'bt709', transfer: 'bt709', matrix, fullRange };
}

/** Whether primaries, transfer and matrix are all specified with values Chromium knows. @ignore */
export function isFullySpecified(c?: CodedColor): boolean {
  return (
    !!PRIMARIES[c?.primaries ?? 2] &&
    !!TRANSFER[c?.transfer ?? 2] &&
    !!MATRIX[c?.matrix ?? 2]
  );
}

/** SDK frame ColorSpace (RangeID 2 = full) -> CodedColor. @ignore */
export function fromSdkColorSpace(cs?: ColorSpace): CodedColor | undefined {
  if (!cs) return undefined;
  return {
    primaries: cs.primaries,
    transfer: cs.transfer,
    matrix: cs.matrix,
    fullRange: cs.range === 2,
  };
}
