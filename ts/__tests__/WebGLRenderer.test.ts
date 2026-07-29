import { MatrixID, RangeID } from '../Private/AgoraMediaBase';
import { WebGLRenderer } from '../Renderer/WebGLRenderer';
import * as Utils from '../Utils';

jest.mock('../Renderer/WebGLRenderer/webgl-utils', () => ({
  createProgramFromSources: jest.fn(),
}));

type ColorSpaceParams = {
  yOffset: number;
  yScale: number;
  rVCoeff: number;
  gUCoeff: number;
  gVCoeff: number;
  bUCoeff: number;
};

const getColorSpaceParams = (
  renderer: WebGLRenderer,
  colorSpace?: { matrix?: MatrixID; range?: RangeID }
): ColorSpaceParams =>
  (
    renderer as unknown as {
      getColorSpaceParams(colorSpace?: {
        matrix?: MatrixID;
        range?: RangeID;
      }): ColorSpaceParams;
    }
  ).getColorSpaceParams(colorSpace);

const limitedOffset = 16 / 255;
const limitedScale = 255 / 219;

type ColorTriplet = readonly [number, number, number];

const rgbToYuv = {
  bt601Limited: ([r, g, b]: ColorTriplet): ColorTriplet => [
    (66 * r + 129 * g + 25 * b + 0x1080) >> 8,
    (112 * b - 74 * g - 38 * r + 0x8080) >> 8,
    (112 * r - 94 * g - 18 * b + 0x8080) >> 8,
  ],
  bt601Full: ([r, g, b]: ColorTriplet): ColorTriplet => [
    (77 * r + 150 * g + 29 * b + 0x80) >> 8,
    (128 * b - 85 * g - 43 * r + 0x8080) >> 8,
    (128 * r - 107 * g - 21 * b + 0x8080) >> 8,
  ],
  bt709Limited: ([r, g, b]: ColorTriplet): ColorTriplet => [
    (47 * r + 157 * g + 16 * b + 0x1080) >> 8,
    (112 * b - 87 * g - 26 * r + 0x8080) >> 8,
    (112 * r - 102 * g - 10 * b + 0x8080) >> 8,
  ],
  bt709Full: ([r, g, b]: ColorTriplet): ColorTriplet => [
    (55 * r + 183 * g + 19 * b + 0x80) >> 8,
    (130 * b - 101 * g - 30 * r + 0x8080) >> 8,
    (130 * r - 119 * g - 12 * b + 0x8080) >> 8,
  ],
};

test.each([
  {
    name: 'default BT.601 limited',
    colorSpace: undefined,
    expected: {
      yOffset: limitedOffset,
      yScale: limitedScale,
      rVCoeff: 1.596027,
      gUCoeff: -0.391762,
      gVCoeff: -0.812968,
      bUCoeff: 2.017232,
    },
  },
  {
    name: 'BT.601 full',
    colorSpace: {
      matrix: MatrixID.MatrixidBt470bg,
      range: RangeID.RangeidFull,
    },
    expected: {
      yOffset: 0,
      yScale: 1,
      rVCoeff: 1.402,
      gUCoeff: -0.344136,
      gVCoeff: -0.714136,
      bUCoeff: 1.772,
    },
  },
  {
    name: 'BT.601 limited',
    colorSpace: {
      matrix: MatrixID.MatrixidBt470bg,
      range: RangeID.RangeidLimited,
    },
    expected: {
      yOffset: limitedOffset,
      yScale: limitedScale,
      rVCoeff: 1.596027,
      gUCoeff: -0.391762,
      gVCoeff: -0.812968,
      bUCoeff: 2.017232,
    },
  },
  {
    name: 'BT.709 limited',
    colorSpace: {
      matrix: MatrixID.MatrixidBt709,
      range: RangeID.RangeidLimited,
    },
    expected: {
      yOffset: limitedOffset,
      yScale: limitedScale,
      rVCoeff: 1.792741,
      gUCoeff: -0.213249,
      gVCoeff: -0.532909,
      bUCoeff: 2.112402,
    },
  },
  {
    name: 'BT.709 full',
    colorSpace: {
      matrix: MatrixID.MatrixidBt709,
      range: RangeID.RangeidFull,
    },
    expected: {
      yOffset: 0,
      yScale: 1,
      rVCoeff: 1.5748,
      gUCoeff: -0.187324,
      gVCoeff: -0.468124,
      bUCoeff: 1.8556,
    },
  },
  {
    name: 'BT.2020 NCL limited',
    colorSpace: {
      matrix: MatrixID.MatrixidBt2020Ncl,
      range: RangeID.RangeidLimited,
    },
    expected: {
      yOffset: limitedOffset,
      yScale: 1,
      rVCoeff: 1.4746,
      gUCoeff: -0.164553,
      gVCoeff: -0.571353,
      bUCoeff: 1.8814,
    },
  },
  {
    name: 'BT.2020 CL full',
    colorSpace: {
      matrix: MatrixID.MatrixidBt2020Cl,
      range: RangeID.RangeidFull,
    },
    expected: {
      yOffset: 0,
      yScale: 1,
      rVCoeff: 1.4746,
      gUCoeff: -0.164553,
      gVCoeff: -0.571353,
      bUCoeff: 1.8814,
    },
  },
  {
    name: 'unspecified matrix uses BT.601 limited',
    colorSpace: {
      matrix: MatrixID.MatrixidUnspecified,
      range: RangeID.RangeidLimited,
    },
    expected: {
      yOffset: limitedOffset,
      yScale: limitedScale,
      rVCoeff: 1.596027,
      gUCoeff: -0.391762,
      gVCoeff: -0.812968,
      bUCoeff: 2.017232,
    },
  },
  {
    name: 'unsupported matrix falls back to BT.709 limited',
    colorSpace: {
      matrix: MatrixID.MatrixidFcc,
      range: RangeID.RangeidDerived,
    },
    expected: {
      yOffset: limitedOffset,
      yScale: limitedScale,
      rVCoeff: 1.792741,
      gUCoeff: -0.213249,
      gVCoeff: -0.532909,
      bUCoeff: 2.112402,
    },
  },
])(
  '$name uses native-aligned conversion parameters',
  ({ colorSpace, expected }) => {
    expect(getColorSpaceParams(new WebGLRenderer(), colorSpace)).toEqual(
      expected
    );
  }
);

test('logs color space changes after the initial application', () => {
  const renderer = new WebGLRenderer();
  const setColorSpaceUniforms = (
    renderer as unknown as {
      setColorSpaceUniforms(colorSpace: {
        matrix: MatrixID;
        range: RangeID;
      }): void;
    }
  ).setColorSpaceUniforms.bind(renderer);
  renderer.gl = {} as WebGLRenderingContext;
  renderer.program = {} as WebGLProgram;
  const logDebug = jest.spyOn(Utils, 'logDebug').mockImplementation(() => {});

  setColorSpaceUniforms({
    matrix: MatrixID.MatrixidBt470bg,
    range: RangeID.RangeidLimited,
  });
  expect(logDebug).not.toHaveBeenCalled();

  setColorSpaceUniforms({
    matrix: MatrixID.MatrixidBt709,
    range: RangeID.RangeidFull,
  });
  expect(logDebug).toHaveBeenCalledTimes(1);
  expect(logDebug).toHaveBeenCalledWith(
    'WebGLRenderer color space changed: 5:1 -> 1:2'
  );
});

test.each([
  {
    name: 'BT.601 limited',
    matrix: MatrixID.MatrixidBt470bg,
    range: RangeID.RangeidLimited,
    encode: rgbToYuv.bt601Limited,
  },
  {
    name: 'BT.601 full',
    matrix: MatrixID.MatrixidBt470bg,
    range: RangeID.RangeidFull,
    encode: rgbToYuv.bt601Full,
  },
  {
    name: 'BT.709 limited',
    matrix: MatrixID.MatrixidBt709,
    range: RangeID.RangeidLimited,
    encode: rgbToYuv.bt709Limited,
  },
  {
    name: 'BT.709 full',
    matrix: MatrixID.MatrixidBt709,
    range: RangeID.RangeidFull,
    encode: rgbToYuv.bt709Full,
  },
])(
  '$name RGB to YUV round trip stays within quantization error',
  (testCase) => {
    const sourceRgb: ColorTriplet = [200, 120, 40];
    const [y, u, v] = testCase.encode(sourceRgb);
    const params = getColorSpaceParams(new WebGLRenderer(), {
      matrix: testCase.matrix,
      range: testCase.range,
    });

    const normalizedY = params.yScale * (y / 255 - params.yOffset);
    const normalizedU = u / 255 - 0.5;
    const normalizedV = v / 255 - 0.5;
    const restoredRgb = [
      normalizedY + params.rVCoeff * normalizedV,
      normalizedY + params.gUCoeff * normalizedU + params.gVCoeff * normalizedV,
      normalizedY + params.bUCoeff * normalizedU,
    ].map((value) => Math.round(value * 255));

    restoredRgb.forEach((value, index) => {
      expect(Math.abs(value - sourceRgb[index]!)).toBeLessThanOrEqual(2);
    });
  }
);
