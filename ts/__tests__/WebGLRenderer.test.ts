jest.mock('../Renderer/WebGLRenderer/webgl-utils', () => ({
  createProgramFromSources: jest.fn(),
}));

import {
  ColorSpace,
  MatrixID,
  PrimaryID,
  RangeID,
  TransferID,
} from '../Private/AgoraMediaBase';
import { WebGLRenderer } from '../Renderer/WebGLRenderer';

const getParams = (colorSpace?: ColorSpace) =>
  (
    new WebGLRenderer() as unknown as {
      getColorSpaceParams(colorSpace?: ColorSpace): {
        yOffset: number;
        yScale: number;
        rVCoeff: number;
        gUCoeff: number;
        gVCoeff: number;
        bUCoeff: number;
      };
    }
  ).getColorSpaceParams(colorSpace);

test.each([
  [MatrixID.MatrixidBt709, RangeID.RangeidLimited, 1.792741],
  [MatrixID.MatrixidBt709, RangeID.RangeidFull, 1.5748],
  [MatrixID.MatrixidBt470bg, RangeID.RangeidLimited, 1.596027],
  [MatrixID.MatrixidSmpte170m, RangeID.RangeidFull, 1.402],
  [MatrixID.MatrixidBt2020Ncl, RangeID.RangeidLimited, 1.678674],
  [MatrixID.MatrixidBt2020Cl, RangeID.RangeidFull, 1.4746],
])(
  'matrix %s and range %s select conversion coefficients',
  (matrix, range, rVCoeff) => {
    const params = getParams({ matrix, range });
    expect(params.rVCoeff).toBe(rVCoeff);
    expect(params.yOffset).toBe(range === RangeID.RangeidFull ? 0 : 16 / 255);
    expect(params.yScale).toBe(range === RangeID.RangeidFull ? 1 : 255 / 219);
  }
);

test('matrix takes precedence over conflicting primaries and transfer', () => {
  const bt601 = getParams({ matrix: MatrixID.MatrixidSmpte170m });
  expect(
    getParams({
      matrix: MatrixID.MatrixidSmpte170m,
      primaries: PrimaryID.PrimaryidBt709,
      transfer: TransferID.TransferidBt709,
    })
  ).toEqual(bt601);
  expect(bt601.rVCoeff).toBe(1.596027);
  expect(
    getParams({
      matrix: MatrixID.MatrixidBt709,
      primaries: PrimaryID.PrimaryidSmpte170m,
      transfer: TransferID.TransferidSmpte170m,
    }).rVCoeff
  ).toBe(1.792741);
});

test('missing or unspecified matrix defaults to BT.601 limited', () => {
  const bt601 = getParams({
    matrix: MatrixID.MatrixidBt470bg,
    range: RangeID.RangeidLimited,
  });
  expect(getParams()).toEqual(bt601);
  expect(getParams({ matrix: MatrixID.MatrixidUnspecified })).toEqual(bt601);
});
