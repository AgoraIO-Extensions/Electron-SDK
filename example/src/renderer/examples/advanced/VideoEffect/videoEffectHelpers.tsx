import { MediaSourceType } from 'agora-electron-sdk';

export const CUSTOM_VIDEO_EFFECT_BUNDLE_RELATIVE_PATH =
  'AgoraBeautyMaterial/beauty_material_functional';
export const CLEAR_VISION_EXTENSION_PROVIDER =
  'agora_video_filters_clear_vision';
export const CLEAR_VISION_EXTENSION_NAME = 'clear_vision';
export const DEFAULT_VIDEO_EFFECT_BUNDLE_RELATIVE_PATH =
  'beauty_agora/beauty_material.bundle/beauty_material_v2.0.0';
export const VIDEO_EFFECT_BUNDLE_RELATIVE_PATH_CANDIDATES = [
  DEFAULT_VIDEO_EFFECT_BUNDLE_RELATIVE_PATH,
  'beauty_agora/beauty_material.bundle/beauty_material_v2.0.0_encrypted',
  'beauty_material.bundle/beauty_material_v2.0.0',
  'beauty_material.bundle/beauty_material_v2.0.0_encrypted',
];

export interface VideoEffectOperation {
  kind: 'bool' | 'int' | 'float';
  option: string;
  key: string;
  value: boolean | number;
}

export interface MakeupOptions {
  enable_mu: boolean;
  browStyle: number;
  browColor: number;
  browStrength: number;
  lashStyle: number;
  lashColor: number;
  lashStrength: number;
  shadowStyle: number;
  shadowStrength: number;
  pupilStyle: number;
  pupilStrength: number;
  blushStyle: number;
  blushColor: number;
  blushStrength: number;
  lipStyle: number;
  lipColor: number;
  lipStrength: number;
}

export interface FaceShapeOptions {
  shapeArea: number;
  shapeIntensity: number;
  shapeStyle: number;
  styleIntensity: number;
}

export interface SdkDrivenBeautyOptions {
  smoothness: number;
  lightness: number;
  redness: number;
  eyePouch: number;
  faceStyle: number;
  faceIntensity: number;
}

export interface BundleTemplateOption {
  label: string;
  relativePath: string;
  templateName: string;
}

export interface BundleTemplateGroups {
  beauty: BundleTemplateOption[];
  filter: BundleTemplateOption[];
  sticker: BundleTemplateOption[];
  styleMakeup: BundleTemplateOption[];
}

export const BEAUTY_TEMPLATES = {
  basic: {
    label: 'Basic (基础)',
    templateName: 'Beauty-Basic',
  },
} as const;

export const STYLE_MAKEUP_TEMPLATES = {
  none: {
    label: 'None',
    templateName: null,
  },
  natural: {
    label: 'Natural (百熙)',
    templateName: 'Makeup-Natural',
  },
} as const;

export const FILTER_TEMPLATES = {
  none: {
    label: 'None',
    templateName: null,
  },
  whiteTea: {
    label: 'Whitetea (白茶)',
    templateName: 'Filter-Whitetea',
  },
} as const;

export function parseBundleUiOptions(config: {
  user_interface_option?: Record<string, string>;
}): BundleTemplateOption[] {
  return Object.entries(config.user_interface_option ?? {}).map(
    ([label, relativePath]) => ({
      label,
      relativePath,
      templateName: label,
    })
  );
}

export function classifyBundleTemplates(
  options: BundleTemplateOption[]
): BundleTemplateGroups {
  return options.reduce<BundleTemplateGroups>(
    (groups, option) => {
      if (option.templateName.startsWith('Beauty-')) {
        groups.beauty.push(option);
      } else if (option.templateName.startsWith('Makeup-')) {
        groups.styleMakeup.push(option);
      } else if (option.templateName.startsWith('Filter-')) {
        groups.filter.push(option);
      } else if (option.templateName.startsWith('Sticker-')) {
        groups.sticker.push(option);
      }
      return groups;
    },
    {
      beauty: [],
      filter: [],
      sticker: [],
      styleMakeup: [],
    }
  );
}

export const DEFAULT_MAKEUP_OPTIONS: MakeupOptions = {
  enable_mu: false,
  browStyle: 0,
  browColor: 0,
  browStrength: 0,
  lashStyle: 0,
  lashColor: 0,
  lashStrength: 0,
  shadowStyle: 0,
  shadowStrength: 0,
  pupilStyle: 0,
  pupilStrength: 0,
  blushStyle: 0,
  blushColor: 0,
  blushStrength: 0,
  lipStyle: 0,
  lipColor: 0,
  lipStrength: 0,
};

export const FACE_SHAPE_AREAS = {
  FaceShapeAreaNone: -1,
  FaceShapeAreaHeadscale: 100,
  FaceShapeAreaForehead: 101,
  FaceShapeAreaFacecontour: 102,
  FaceShapeAreaFacelength: 103,
  FaceShapeAreaFacewidth: 104,
  FaceShapeAreaCheekbone: 105,
  FaceShapeAreaCheek: 106,
  FaceShapeAreaChin: 108,
  FaceShapeAreaEyescale: 200,
  FaceShapeAreaNoselength: 300,
  FaceShapeAreaNosewidth: 301,
  FaceShapeAreaMouthscale: 400,
} as const;

export const FACE_SHAPE_BEAUTY_STYLES = {
  FaceShapeBeautyStyleFemale: 0,
  FaceShapeBeautyStyleMale: 1,
} as const;

export const DEFAULT_FACE_SHAPE_OPTIONS: FaceShapeOptions = {
  shapeArea: FACE_SHAPE_AREAS.FaceShapeAreaNone,
  shapeIntensity: 0,
  shapeStyle: FACE_SHAPE_BEAUTY_STYLES.FaceShapeBeautyStyleFemale,
  styleIntensity: 0,
};

export const DEFAULT_SDK_DRIVEN_BEAUTY_OPTIONS: SdkDrivenBeautyOptions = {
  smoothness: 0.5,
  lightness: 0.3,
  redness: 0,
  eyePouch: 0,
  faceStyle: -1,
  faceIntensity: 50,
};

export function extractSdkDrivenBeautyOptionsFromConfig(
  config: any,
  fallback: SdkDrivenBeautyOptions = DEFAULT_SDK_DRIVEN_BEAUTY_OPTIONS
): SdkDrivenBeautyOptions {
  return {
    smoothness: config?.beauty_effect_option?.smoothness ?? fallback.smoothness,
    lightness: config?.beauty_effect_option?.lightness ?? fallback.lightness,
    redness: config?.beauty_effect_option?.redness ?? fallback.redness,
    eyePouch: config?.face_buffing_option?.eye_pouch ?? fallback.eyePouch,
    faceStyle: config?.face_shape_beauty_option?.style ?? fallback.faceStyle,
    faceIntensity:
      config?.face_shape_beauty_option?.intensity ?? fallback.faceIntensity,
  };
}

export const MAKEUP_ITEMS = {
  browStyle: ['CLOSE', 'eyebrow001', 'eyebrow002', 'eyebrow003'],
  browColor: ['Brown', 'Gray Brown', 'Dark Brown'],
  lashStyle: ['CLOSE', 'eyelash003', 'eyelash005'],
  lashColor: ['Black', 'Brown', 'Blue'],
  shadowStyle: ['CLOSE', 'eyeshadow001', 'eyeshadow006'],
  pupilStyle: ['CLOSE', 'facial002'],
  blushStyle: ['CLOSE', 'blush001', 'blush002', 'blush004', 'blush009'],
  blushColor: ['Pink', 'Orange', 'Red', 'Coral', 'Purple', 'Brown'],
  lipStyle: ['CLOSE', 'Moisturizing', 'Matte'],
  lipColor: ['Natural', 'Pink', 'Orange', 'Red', 'Coral', 'Purple'],
};

export function toIndexedItems(labels: string[]) {
  return labels.map((label, index) => ({
    label,
    value: index,
  }));
}

export const FACE_SHAPE_AREA_ITEMS = [
  {
    label: 'FACE_SHAPE_AREA_NONE',
    value: FACE_SHAPE_AREAS.FaceShapeAreaNone,
  },
  {
    label: 'FACE_SHAPE_AREA_HEADSCALE',
    value: FACE_SHAPE_AREAS.FaceShapeAreaHeadscale,
  },
  {
    label: 'FACE_SHAPE_AREA_FOREHEAD',
    value: FACE_SHAPE_AREAS.FaceShapeAreaForehead,
  },
  {
    label: 'FACE_SHAPE_AREA_FACECONTOUR',
    value: FACE_SHAPE_AREAS.FaceShapeAreaFacecontour,
  },
  {
    label: 'FACE_SHAPE_AREA_FACELENGTH',
    value: FACE_SHAPE_AREAS.FaceShapeAreaFacelength,
  },
  {
    label: 'FACE_SHAPE_AREA_FACEWIDTH',
    value: FACE_SHAPE_AREAS.FaceShapeAreaFacewidth,
  },
  {
    label: 'FACE_SHAPE_AREA_CHEEKBONE',
    value: FACE_SHAPE_AREAS.FaceShapeAreaCheekbone,
  },
  {
    label: 'FACE_SHAPE_AREA_CHEEK',
    value: FACE_SHAPE_AREAS.FaceShapeAreaCheek,
  },
  {
    label: 'FACE_SHAPE_AREA_CHIN',
    value: FACE_SHAPE_AREAS.FaceShapeAreaChin,
  },
  {
    label: 'FACE_SHAPE_AREA_EYESCALE',
    value: FACE_SHAPE_AREAS.FaceShapeAreaEyescale,
  },
  {
    label: 'FACE_SHAPE_AREA_NOSELENGTH',
    value: FACE_SHAPE_AREAS.FaceShapeAreaNoselength,
  },
  {
    label: 'FACE_SHAPE_AREA_NOSEWIDTH',
    value: FACE_SHAPE_AREAS.FaceShapeAreaNosewidth,
  },
  {
    label: 'FACE_SHAPE_AREA_MOUTHSCALE',
    value: FACE_SHAPE_AREAS.FaceShapeAreaMouthscale,
  },
];

export const FACE_SHAPE_STYLE_ITEMS = [
  {
    label: 'FACE_SHAPE_STYLE_FEMALE',
    value: FACE_SHAPE_BEAUTY_STYLES.FaceShapeBeautyStyleFemale,
  },
  {
    label: 'FACE_SHAPE_STYLE_MALE',
    value: FACE_SHAPE_BEAUTY_STYLES.FaceShapeBeautyStyleMale,
  },
];

const RESOURCE_ID_MAP: Record<string, number[] | undefined> = {
  eyelash: [0, 3, 5],
  eyeshadow: [0, 1, 6],
  blush: [0, 1, 2, 4, 9],
  pupil: [0, 2],
};

const FACE_SHAPE_AREA_PARAM_NAMES: Record<number, string> = {
  [FACE_SHAPE_AREAS.FaceShapeAreaHeadscale]: 'headScale',
  [FACE_SHAPE_AREAS.FaceShapeAreaForehead]: 'forehead',
  [FACE_SHAPE_AREAS.FaceShapeAreaFacecontour]: 'faceContour',
  [FACE_SHAPE_AREAS.FaceShapeAreaFacelength]: 'faceLength',
  [FACE_SHAPE_AREAS.FaceShapeAreaFacewidth]: 'faceWidth',
  [FACE_SHAPE_AREAS.FaceShapeAreaCheekbone]: 'cheekBone',
  [FACE_SHAPE_AREAS.FaceShapeAreaCheek]: 'cheek',
  [FACE_SHAPE_AREAS.FaceShapeAreaChin]: 'chin',
  [FACE_SHAPE_AREAS.FaceShapeAreaEyescale]: 'eyeScale',
  [FACE_SHAPE_AREAS.FaceShapeAreaNoselength]: 'noseLength',
  [FACE_SHAPE_AREAS.FaceShapeAreaNosewidth]: 'noseWidth',
  [FACE_SHAPE_AREAS.FaceShapeAreaMouthscale]: 'mouthScale',
};

export function mapUiToResourceId(resourceType: string, uiIndex: number) {
  const mapping = RESOURCE_ID_MAP[resourceType];
  if (!mapping) {
    return uiIndex;
  }
  return uiIndex < mapping.length ? mapping[uiIndex] ?? 0 : 0;
}

export function getFaceShapeAreaParamName(shapeArea: number) {
  return FACE_SHAPE_AREA_PARAM_NAMES[shapeArea] ?? '';
}

export function resolveVideoEffectBundlePath(
  resolveAbsolutePath: (relativePath: string) => string,
  exists: (absolutePath: string) => boolean
) {
  const absoluteCandidates =
    VIDEO_EFFECT_BUNDLE_RELATIVE_PATH_CANDIDATES.map(resolveAbsolutePath);
  return (
    absoluteCandidates.find((absolutePath) => exists(absolutePath)) ??
    absoluteCandidates[0]!
  );
}

export function releaseVideoEffectResources(
  engine:
    | {
        destroyVideoEffectObject?: (videoEffectObject: any) => void;
        enableExtension?: (
          provider: string,
          extension: string,
          enable?: boolean,
          type?: MediaSourceType
        ) => void;
      }
    | undefined,
  videoEffectObject: any
) {
  if (videoEffectObject && engine?.destroyVideoEffectObject) {
    engine.destroyVideoEffectObject(videoEffectObject);
  }

  engine?.enableExtension?.(
    CLEAR_VISION_EXTENSION_PROVIDER,
    CLEAR_VISION_EXTENSION_NAME,
    false,
    MediaSourceType.PrimaryCameraSource
  );
}

export function buildBundleCacheSyncTargets(
  bundlePath: string,
  relativePaths: string[]
) {
  return [
    {
      cachePath: `${bundlePath}/saved.cache`,
      jsonPath: `${bundlePath}/saved.json`,
    },
    ...relativePaths.map((relativePath) => ({
      cachePath: `${bundlePath}/${relativePath.replace(/\/$/, '')}/saved.cache`,
      jsonPath: `${bundlePath}/${relativePath.replace(/\/$/, '')}/saved.json`,
    })),
  ];
}

export function buildSdkDrivenBeautyOperations(
  options: SdkDrivenBeautyOptions
): VideoEffectOperation[] {
  return [
    {
      kind: 'float',
      option: 'beauty_effect_option',
      key: 'smoothness',
      value: options.smoothness,
    },
    {
      kind: 'float',
      option: 'beauty_effect_option',
      key: 'lightness',
      value: options.lightness,
    },
    {
      kind: 'float',
      option: 'beauty_effect_option',
      key: 'redness',
      value: options.redness,
    },
    {
      kind: 'float',
      option: 'face_buffing_option',
      key: 'eye_pouch',
      value: options.eyePouch,
    },
    {
      kind: 'int',
      option: 'face_shape_beauty_option',
      key: 'style',
      value: options.faceStyle,
    },
    {
      kind: 'int',
      option: 'face_shape_beauty_option',
      key: 'intensity',
      value: options.faceIntensity,
    },
  ];
}

export function buildStyleEffectOperations(
  option:
    | 'style_effect_option'
    | 'style_makeup_option'
    | 'filter_effect_option',
  value: number
): VideoEffectOperation[] {
  return [
    {
      kind: 'float',
      option,
      key: option === 'filter_effect_option' ? 'strength' : 'styleIntensity',
      value,
    },
  ];
}

export function buildMakeupEffectOperations(
  options: MakeupOptions
): VideoEffectOperation[] {
  const operations: VideoEffectOperation[] = [
    {
      kind: 'bool',
      option: 'makeup_options',
      key: 'enable_mu',
      value: options.enable_mu,
    },
  ];

  if (!options.enable_mu) {
    return operations;
  }

  operations.push(
    {
      kind: 'int',
      option: 'makeup_options',
      key: 'browStyle',
      value: mapUiToResourceId('eyebrow', options.browStyle),
    },
    {
      kind: 'int',
      option: 'makeup_options',
      key: 'browColor',
      value: options.browColor,
    },
    {
      kind: 'float',
      option: 'makeup_options',
      key: 'browStrength',
      value: options.browStrength,
    },
    {
      kind: 'int',
      option: 'makeup_options',
      key: 'lashStyle',
      value: mapUiToResourceId('eyelash', options.lashStyle),
    },
    {
      kind: 'int',
      option: 'makeup_options',
      key: 'lashColor',
      value: options.lashColor,
    },
    {
      kind: 'float',
      option: 'makeup_options',
      key: 'lashStrength',
      value: options.lashStrength,
    },
    {
      kind: 'int',
      option: 'makeup_options',
      key: 'shadowStyle',
      value: mapUiToResourceId('eyeshadow', options.shadowStyle),
    },
    {
      kind: 'float',
      option: 'makeup_options',
      key: 'shadowStrength',
      value: options.shadowStrength,
    },
    {
      kind: 'int',
      option: 'makeup_options',
      key: 'pupilStyle',
      value: mapUiToResourceId('pupil', options.pupilStyle),
    },
    {
      kind: 'float',
      option: 'makeup_options',
      key: 'pupilStrength',
      value: options.pupilStrength,
    },
    {
      kind: 'int',
      option: 'makeup_options',
      key: 'blushStyle',
      value: mapUiToResourceId('blush', options.blushStyle),
    },
    {
      kind: 'int',
      option: 'makeup_options',
      key: 'blushColor',
      value: options.blushColor,
    },
    {
      kind: 'float',
      option: 'makeup_options',
      key: 'blushStrength',
      value: options.blushStrength,
    },
    {
      kind: 'int',
      option: 'makeup_options',
      key: 'lipStyle',
      value: options.lipStyle,
    },
    {
      kind: 'int',
      option: 'makeup_options',
      key: 'lipColor',
      value: options.lipColor,
    },
    {
      kind: 'float',
      option: 'makeup_options',
      key: 'lipStrength',
      value: options.lipStrength,
    }
  );

  return operations;
}

export function buildFaceShapeEffectOperations(
  options: FaceShapeOptions
): VideoEffectOperation[] {
  const operations: VideoEffectOperation[] = [];
  const faceShapeAreaParamName = getFaceShapeAreaParamName(options.shapeArea);

  if (faceShapeAreaParamName) {
    operations.push({
      kind: 'float',
      option: 'face_buffing_option',
      key: faceShapeAreaParamName,
      value: options.shapeIntensity / 100,
    });
  }

  if (
    options.shapeStyle !== FACE_SHAPE_BEAUTY_STYLES.FaceShapeBeautyStyleFemale
  ) {
    operations.push(
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
        value: options.styleIntensity,
      }
    );
  }

  return operations;
}
