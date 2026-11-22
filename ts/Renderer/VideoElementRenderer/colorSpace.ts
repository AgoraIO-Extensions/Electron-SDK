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

/**
 * Read the color description from the SPS VUI of an H.264 Annex-B access unit. Returns undefined
 * when there is no SPS. Missing fields stay undefined (= unspecified).
 * @ignore
 */
export function parseH264SpsColor(buf: Uint8Array): CodedColor | undefined {
  const sps = findNal(buf, 7);
  if (!sps) return undefined;
  try {
    return readSps(unescapeRbsp(buf.subarray(sps.start + 1, sps.end))).color;
  } catch (e) {
    return undefined;
  }
}

function findNal(
  b: Uint8Array,
  type: number
): { start: number; end: number } | undefined {
  // start: index of the NAL header byte, end: one past the last payload byte
  let i = 0;
  const n = b.length;
  while (i + 3 < n) {
    let sc = 0;
    if (b[i] === 0 && b[i + 1] === 0 && b[i + 2] === 1) sc = 3;
    else if (b[i] === 0 && b[i + 1] === 0 && b[i + 2] === 0 && b[i + 3] === 1)
      sc = 4;
    if (!sc) {
      i++;
      continue;
    }
    const start = i + sc;
    let end = start + 1;
    while (
      end + 2 < n &&
      !(
        b[end] === 0 &&
        b[end + 1] === 0 &&
        (b[end + 2] === 1 || b[end + 2] === 0)
      )
    )
      end++;
    if (end + 2 >= n) end = n;
    if (((b[start] ?? 0) & 0x1f) === type) return { start, end };
    i = end;
  }
  return undefined;
}

function unescapeRbsp(b: Uint8Array): Uint8Array {
  const out = new Uint8Array(b.length);
  let o = 0;
  for (let i = 0; i < b.length; i++) {
    if (i >= 2 && b[i] === 3 && b[i - 1] === 0 && b[i - 2] === 0) continue;
    out[o++] = b[i]!;
  }
  return out.subarray(0, o);
}

class Bits {
  pos = 0;
  constructor(private b: Uint8Array) {}
  u(n: number): number {
    let v = 0;
    for (let k = 0; k < n; k++) {
      const byte = this.b[this.pos >> 3];
      if (byte === undefined) throw new Error('eof');
      v = (v << 1) | ((byte >> (7 - (this.pos & 7))) & 1);
      this.pos++;
    }
    return v >>> 0;
  }
  ue(): number {
    let z = 0;
    while (this.u(1) === 0) {
      if (++z > 31) throw new Error('bad ue');
    }
    return z === 0 ? 0 : (1 << z) - 1 + this.u(z);
  }
  se(): number {
    const k = this.ue();
    return k & 1 ? (k + 1) / 2 : -(k / 2);
  }
}

function skipScalingList(r: Bits, size: number) {
  let last = 8;
  let next = 8;
  for (let j = 0; j < size; j++) {
    if (next !== 0) next = (last + r.se() + 256) % 256;
    last = next === 0 ? last : next;
  }
}

type SpsInfo = {
  color: CodedColor;
  /** bit offset of vui_parameters_present_flag */
  vuiFlag: number;
  /** bit offsets of video_signal_type_present_flag and of the first bit after its block */
  vstStart?: number;
  vstEnd?: number;
};

function readSps(rbsp: Uint8Array): SpsInfo {
  const r = new Bits(rbsp);
  const profile = r.u(8);
  r.u(16); // constraint flags + level_idc
  r.ue(); // seq_parameter_set_id
  if (
    [100, 110, 122, 244, 44, 83, 86, 118, 128, 138, 139, 134, 135].includes(
      profile
    )
  ) {
    const chroma = r.ue();
    if (chroma === 3) r.u(1);
    r.ue();
    r.ue();
    r.u(1);
    if (r.u(1)) {
      for (let i = 0; i < (chroma !== 3 ? 8 : 12); i++) {
        if (r.u(1)) skipScalingList(r, i < 6 ? 16 : 64);
      }
    }
  }
  r.ue(); // log2_max_frame_num_minus4
  const pocType = r.ue();
  if (pocType === 0) r.ue();
  else if (pocType === 1) {
    r.u(1);
    r.se();
    r.se();
    const cycle = r.ue();
    for (let i = 0; i < cycle; i++) r.se();
  }
  r.ue(); // max_num_ref_frames
  r.u(1);
  r.ue(); // pic_width_in_mbs_minus1
  r.ue(); // pic_height_in_map_units_minus1
  if (!r.u(1)) r.u(1); // frame_mbs_only_flag / mb_adaptive_frame_field_flag
  r.u(1); // direct_8x8_inference_flag
  if (r.u(1)) {
    r.ue();
    r.ue();
    r.ue();
    r.ue();
  }
  const c: CodedColor = {};
  const vuiFlag = r.pos;
  if (!r.u(1)) return { color: c, vuiFlag }; // vui_parameters_present_flag
  if (r.u(1)) {
    if (r.u(8) === 255) r.u(32);
  }
  if (r.u(1)) r.u(1);
  const vstStart = r.pos;
  if (r.u(1)) {
    r.u(3); // video_format
    c.fullRange = r.u(1) === 1;
    if (r.u(1)) {
      c.primaries = r.u(8);
      c.transfer = r.u(8);
      c.matrix = r.u(8);
    }
  }
  return { color: c, vuiFlag, vstStart, vstEnd: r.pos };
}

const PRIMARIES_CODE: { [k: string]: number } = {
  bt709: 1,
  bt470bg: 5,
  smpte170m: 6,
  bt2020: 9,
  smpte432: 12,
};
const TRANSFER_CODE: { [k: string]: number } = {
  'bt709': 1,
  'smpte170m': 6,
  'linear': 8,
  'iec61966-2-1': 13,
  'pq': 16,
  'hlg': 18,
};
const MATRIX_CODE: { [k: string]: number } = {
  'rgb': 0,
  'bt709': 1,
  'bt470bg': 5,
  'smpte170m': 6,
  'bt2020-ncl': 9,
};

function toBits(b: Uint8Array, from: number, to: number, out: number[]) {
  for (let p = from; p < to; p++) out.push((b[p >> 3]! >> (7 - (p & 7))) & 1);
}
function pushU(out: number[], v: number, n: number) {
  for (let k = n - 1; k >= 0; k--) out.push((v >> k) & 1);
}
function escapeRbsp(b: Uint8Array): Uint8Array {
  const out: number[] = [];
  let zeros = 0;
  for (const v of b) {
    if (zeros >= 2 && v <= 3) {
      out.push(3);
      zeros = 0;
    }
    out.push(v);
    zeros = v === 0 ? zeros + 1 : 0;
  }
  return Uint8Array.from(out);
}

/**
 * Rewrite the SPS in an H.264 Annex-B access unit so its VUI carries exactly `cs` (video signal
 * type + colour description). Chromium's decoders take the color space from the bitstream, so
 * this is how the <video> path gets a chosen color space without a CPU copy of the frame.
 * Returns the input unchanged when there is no SPS or it cannot be parsed.
 * @ignore
 */
export function rewriteH264SpsColor(buf: Uint8Array, cs: any): Uint8Array {
  const pos = findNal(buf, 7);
  if (!pos) return buf;
  const rbsp = unescapeRbsp(buf.subarray(pos.start + 1, pos.end));
  let info: SpsInfo;
  try {
    info = readSps(rbsp);
  } catch (e) {
    return buf;
  }
  const p = PRIMARIES_CODE[cs.primaries] ?? 2;
  const t = TRANSFER_CODE[cs.transfer] ?? 2;
  const m = MATRIX_CODE[cs.matrix] ?? 2;
  const vst: number[] = [];
  pushU(vst, 1, 1); // video_signal_type_present_flag
  pushU(vst, 5, 3); // video_format: unspecified
  pushU(vst, cs.fullRange ? 1 : 0, 1);
  pushU(vst, 1, 1); // colour_description_present_flag
  pushU(vst, p, 8);
  pushU(vst, t, 8);
  pushU(vst, m, 8);
  // find the rbsp_stop_one_bit: last 1 bit
  let last = rbsp.length * 8 - 1;
  while (last >= 0 && ((rbsp[last >> 3]! >> (7 - (last & 7))) & 1) === 0)
    last--;
  if (last < 0) return buf;
  const bits: number[] = [];
  if (info.vstStart !== undefined && info.vstEnd !== undefined) {
    toBits(rbsp, 0, info.vstStart, bits);
    bits.push(...vst);
    toBits(rbsp, info.vstEnd, last, bits);
  } else {
    // no VUI: add a minimal one
    toBits(rbsp, 0, info.vuiFlag, bits);
    bits.push(1); // vui_parameters_present_flag
    bits.push(0, 0); // aspect_ratio_info_present_flag, overscan_info_present_flag
    bits.push(...vst);
    // chroma_loc, timing_info, nal_hrd, vcl_hrd, pic_struct, bitstream_restriction
    bits.push(0, 0, 0, 0, 0, 0);
  }
  bits.push(1); // rbsp_stop_one_bit
  while (bits.length % 8) bits.push(0);
  const out = new Uint8Array(bits.length / 8);
  for (let i = 0; i < out.length; i++) {
    let v = 0;
    for (let k = 0; k < 8; k++) v = (v << 1) | bits[i * 8 + k]!;
    out[i] = v;
  }
  const nal = escapeRbsp(out);
  const res = new Uint8Array(
    buf.length - (pos.end - pos.start - 1) + nal.length
  );
  res.set(buf.subarray(0, pos.start + 1), 0);
  res.set(nal, pos.start + 1);
  res.set(buf.subarray(pos.end), pos.start + 1 + nal.length);
  return res;
}
