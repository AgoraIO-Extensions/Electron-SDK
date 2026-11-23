import {
  ColorSpace,
  MatrixID,
  PrimaryID,
  RangeID,
  TransferID,
} from '../../Private/AgoraMediaBase';

// SDK ColorSpace (ITU-T H.273 code points) -> WebCodecs VideoColorSpaceInit names. Values that
// WebCodecs has no name for (unspecified and the rest) are left out.
const PRIMARIES: { [k: number]: string } = {
  [PrimaryID.PrimaryidBt709]: 'bt709',
  [PrimaryID.PrimaryidBt470bg]: 'bt470bg',
  [PrimaryID.PrimaryidSmpte170m]: 'smpte170m',
  [PrimaryID.PrimaryidBt2020]: 'bt2020',
  [PrimaryID.PrimaryidSmptest432]: 'smpte432',
};
const TRANSFER: { [k: number]: string } = {
  [TransferID.TransferidBt709]: 'bt709',
  [TransferID.TransferidSmpte170m]: 'smpte170m',
  [TransferID.TransferidLinear]: 'linear',
  [TransferID.TransferidIec6196621]: 'iec61966-2-1',
  [TransferID.TransferidSmptest2084]: 'pq',
  [TransferID.TransferidAribStdB67]: 'hlg',
};
const MATRIX: { [k: number]: string } = {
  [MatrixID.MatrixidRgb]: 'rgb',
  [MatrixID.MatrixidBt709]: 'bt709',
  [MatrixID.MatrixidBt470bg]: 'bt470bg',
  [MatrixID.MatrixidSmpte170m]: 'smpte170m',
  [MatrixID.MatrixidBt2020Ncl]: 'bt2020-ncl',
};

/**
 * The color space of an SDK frame as a VideoColorSpaceInit, field by field as the SDK reports it.
 * Fields the SDK leaves unspecified are omitted (Chromium then applies its own defaults).
 * @ignore
 */
export function toVideoColorSpaceInit(cs?: ColorSpace): any {
  if (!cs) return undefined;
  const init: any = {};
  if (cs.primaries !== undefined && PRIMARIES[cs.primaries]) {
    init.primaries = PRIMARIES[cs.primaries];
  }
  if (cs.transfer !== undefined && TRANSFER[cs.transfer]) {
    init.transfer = TRANSFER[cs.transfer];
  }
  if (cs.matrix !== undefined && MATRIX[cs.matrix]) {
    init.matrix = MATRIX[cs.matrix];
  }
  if (cs.range === RangeID.RangeidFull) init.fullRange = true;
  if (cs.range === RangeID.RangeidLimited) init.fullRange = false;
  return init;
}
