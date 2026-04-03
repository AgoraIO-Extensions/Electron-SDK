import {
  BEAUTY_TEMPLATES,
  FACE_SHAPE_AREAS,
  FILTER_TEMPLATES,
  STYLE_MAKEUP_TEMPLATES,
  VIDEO_EFFECT_BUNDLE_RELATIVE_PATH_CANDIDATES,
  buildFaceShapeEffectOperations,
  buildMakeupEffectOperations,
  buildSdkDrivenBeautyOperations,
  buildStyleEffectOperations,
  mapUiToResourceId,
  releaseVideoEffectResources,
  resolveVideoEffectBundlePath,
  toIndexedItems,
} from '../../example/src/renderer/examples/advanced/VideoEffect/videoEffectHelpers';

describe('mapUiToResourceId', () => {
  test('returns upstream-mapped resource ids for constrained makeup assets', () => {
    expect(mapUiToResourceId('eyebrow', 2)).toBe(2);
    expect(mapUiToResourceId('eyelash', 1)).toBe(3);
    expect(mapUiToResourceId('eyeshadow', 2)).toBe(6);
    expect(mapUiToResourceId('blush', 4)).toBe(9);
    expect(mapUiToResourceId('pupil', 1)).toBe(2);
  });

  test('falls back to zero for unsupported constrained indices', () => {
    expect(mapUiToResourceId('eyelash', 9)).toBe(0);
    expect(mapUiToResourceId('eyeshadow', 9)).toBe(0);
    expect(mapUiToResourceId('blush', 9)).toBe(0);
    expect(mapUiToResourceId('pupil', 9)).toBe(0);
  });
});

describe('resolveVideoEffectBundlePath', () => {
  test('prefers the first existing default bundle candidate', () => {
    expect(
      resolveVideoEffectBundlePath(
        (relativePath) => `/resources/${relativePath}`,
        (absolutePath) =>
          absolutePath ===
          `/resources/${VIDEO_EFFECT_BUNDLE_RELATIVE_PATH_CANDIDATES[0]}`
      )
    ).toBe(`/resources/${VIDEO_EFFECT_BUNDLE_RELATIVE_PATH_CANDIDATES[0]}`);
  });

  test('falls back to later candidates when the preferred bundle is missing', () => {
    expect(
      resolveVideoEffectBundlePath(
        (relativePath) => `/resources/${relativePath}`,
        (absolutePath) =>
          absolutePath ===
          `/resources/${VIDEO_EFFECT_BUNDLE_RELATIVE_PATH_CANDIDATES[1]}`
      )
    ).toBe(`/resources/${VIDEO_EFFECT_BUNDLE_RELATIVE_PATH_CANDIDATES[1]}`);
  });

  test('returns the first candidate when none of the bundle paths exist yet', () => {
    expect(
      resolveVideoEffectBundlePath(
        (relativePath) => `/resources/${relativePath}`,
        () => false
      )
    ).toBe(`/resources/${VIDEO_EFFECT_BUNDLE_RELATIVE_PATH_CANDIDATES[0]}`);
  });
});

describe('toIndexedItems', () => {
  test('preserves labels while converting dropdown values to numeric indices', () => {
    expect(toIndexedItems(['CLOSE', 'eyelash003', 'eyelash005'])).toEqual([
      { label: 'CLOSE', value: 0 },
      { label: 'eyelash003', value: 1 },
      { label: 'eyelash005', value: 2 },
    ]);
  });
});

describe('releaseVideoEffectResources', () => {
  test('destroys the object and disables clear vision without any React state coupling', () => {
    const destroyVideoEffectObject = jest.fn();
    const enableExtension = jest.fn();
    const videoEffectObject = { objectId: 1 } as any;

    expect(
      releaseVideoEffectResources(
        {
          destroyVideoEffectObject,
          enableExtension,
        } as any,
        videoEffectObject
      )
    ).toBeUndefined();

    expect(destroyVideoEffectObject).toHaveBeenCalledWith(videoEffectObject);
    expect(enableExtension).toHaveBeenCalledWith(
      'agora_video_filters_clear_vision',
      'clear_vision',
      false,
      2
    );
  });

  test('still disables clear vision even if the object is already missing', () => {
    const enableExtension = jest.fn();

    expect(
      releaseVideoEffectResources(
        {
          enableExtension,
        } as any,
        undefined
      )
    ).toBeUndefined();

    expect(enableExtension).toHaveBeenCalledWith(
      'agora_video_filters_clear_vision',
      'clear_vision',
      false,
      2
    );
  });
});

describe('buildMakeupEffectOperations', () => {
  test('builds mapped params that mirror the native style makeup logic', () => {
    expect(
      buildMakeupEffectOperations({
        enable_mu: true,
        browStyle: 2,
        browColor: 1,
        browStrength: 0.6,
        lashStyle: 2,
        lashColor: 1,
        lashStrength: 0.7,
        shadowStyle: 2,
        shadowStrength: 0.4,
        pupilStyle: 1,
        pupilStrength: 0.5,
        blushStyle: 4,
        blushColor: 3,
        blushStrength: 0.8,
        lipStyle: 2,
        lipColor: 5,
        lipStrength: 0.9,
      })
    ).toEqual([
      {
        kind: 'bool',
        option: 'makeup_options',
        key: 'enable_mu',
        value: true,
      },
      {
        kind: 'int',
        option: 'makeup_options',
        key: 'browStyle',
        value: 2,
      },
      {
        kind: 'int',
        option: 'makeup_options',
        key: 'browColor',
        value: 1,
      },
      {
        kind: 'float',
        option: 'makeup_options',
        key: 'browStrength',
        value: 0.6,
      },
      {
        kind: 'int',
        option: 'makeup_options',
        key: 'lashStyle',
        value: 5,
      },
      {
        kind: 'int',
        option: 'makeup_options',
        key: 'lashColor',
        value: 1,
      },
      {
        kind: 'float',
        option: 'makeup_options',
        key: 'lashStrength',
        value: 0.7,
      },
      {
        kind: 'int',
        option: 'makeup_options',
        key: 'shadowStyle',
        value: 6,
      },
      {
        kind: 'float',
        option: 'makeup_options',
        key: 'shadowStrength',
        value: 0.4,
      },
      {
        kind: 'int',
        option: 'makeup_options',
        key: 'pupilStyle',
        value: 2,
      },
      {
        kind: 'float',
        option: 'makeup_options',
        key: 'pupilStrength',
        value: 0.5,
      },
      {
        kind: 'int',
        option: 'makeup_options',
        key: 'blushStyle',
        value: 9,
      },
      {
        kind: 'int',
        option: 'makeup_options',
        key: 'blushColor',
        value: 3,
      },
      {
        kind: 'float',
        option: 'makeup_options',
        key: 'blushStrength',
        value: 0.8,
      },
      {
        kind: 'int',
        option: 'makeup_options',
        key: 'lipStyle',
        value: 2,
      },
      {
        kind: 'int',
        option: 'makeup_options',
        key: 'lipColor',
        value: 5,
      },
      {
        kind: 'float',
        option: 'makeup_options',
        key: 'lipStrength',
        value: 0.9,
      },
    ]);
  });

  test('only keeps the enable flag when makeup is disabled', () => {
    expect(
      buildMakeupEffectOperations({
        enable_mu: false,
        browStyle: 1,
        browColor: 0,
        browStrength: 0.5,
        lashStyle: 1,
        lashColor: 0,
        lashStrength: 0.5,
        shadowStyle: 1,
        shadowStrength: 0.5,
        pupilStyle: 1,
        pupilStrength: 0.5,
        blushStyle: 1,
        blushColor: 0,
        blushStrength: 0.5,
        lipStyle: 1,
        lipColor: 0,
        lipStrength: 0.5,
      })
    ).toEqual([
      {
        kind: 'bool',
        option: 'makeup_options',
        key: 'enable_mu',
        value: false,
      },
    ]);
  });
});

describe('buildFaceShapeEffectOperations', () => {
  test('maps face shape area and style settings to native param names', () => {
    expect(
      buildFaceShapeEffectOperations({
        shapeArea: FACE_SHAPE_AREAS.FaceShapeAreaCheekbone,
        shapeIntensity: 75,
        shapeStyle: 1,
        styleIntensity: 42,
      })
    ).toEqual([
      {
        kind: 'float',
        option: 'face_buffing_option',
        key: 'cheekBone',
        value: 0.75,
      },
      {
        kind: 'bool',
        option: 'face_shape_beauty_option',
        key: 'enable',
        value: true,
      },
      {
        kind: 'int',
        option: 'face_shape_beauty_option',
        key: 'intensity',
        value: 42,
      },
    ]);
  });

  test('omits area/style params when the upstream sample treats them as defaults', () => {
    expect(
      buildFaceShapeEffectOperations({
        shapeArea: FACE_SHAPE_AREAS.FaceShapeAreaNone,
        shapeIntensity: 0,
        shapeStyle: 0,
        styleIntensity: 18,
      })
    ).toEqual([]);
  });
});

describe('buildSdkDrivenBeautyOperations', () => {
  test('builds flutter-style beauty params for the BEAUTY node', () => {
    expect(
      buildSdkDrivenBeautyOperations({
        smoothness: 0.5,
        lightness: 0.3,
        redness: 0.1,
        eyePouch: 0.2,
        faceStyle: 1,
        faceIntensity: 42,
      })
    ).toEqual([
      {
        kind: 'float',
        option: 'beauty_effect_option',
        key: 'smoothness',
        value: 0.5,
      },
      {
        kind: 'float',
        option: 'beauty_effect_option',
        key: 'lightness',
        value: 0.3,
      },
      {
        kind: 'float',
        option: 'beauty_effect_option',
        key: 'redness',
        value: 0.1,
      },
      {
        kind: 'float',
        option: 'face_buffing_option',
        key: 'eye_pouch',
        value: 0.2,
      },
      {
        kind: 'int',
        option: 'face_shape_beauty_option',
        key: 'style',
        value: 1,
      },
      {
        kind: 'int',
        option: 'face_shape_beauty_option',
        key: 'intensity',
        value: 42,
      },
    ]);
  });
});

describe('buildStyleEffectOperations', () => {
  test('builds style makeup intensity params', () => {
    expect(buildStyleEffectOperations('style_effect_option', 0.8)).toEqual([
      {
        kind: 'float',
        option: 'style_effect_option',
        key: 'styleIntensity',
        value: 0.8,
      },
    ]);
  });

  test('builds filter strength params', () => {
    expect(buildStyleEffectOperations('filter_effect_option', 0.6)).toEqual([
      {
        kind: 'float',
        option: 'filter_effect_option',
        key: 'strength',
        value: 0.6,
      },
    ]);
  });
});

describe('template metadata', () => {
  test('keeps flutter-aligned template names', () => {
    expect(BEAUTY_TEMPLATES.basic.templateName).toBe('Beauty-Basic');
    expect(STYLE_MAKEUP_TEMPLATES.natural.templateName).toBe('Makeup-Natural');
    expect(FILTER_TEMPLATES.whiteTea.templateName).toBe('Filter-Whitetea');
  });
});
