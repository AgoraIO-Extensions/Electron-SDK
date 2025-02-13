import path from 'path';

import { AgoraDropdownItem } from '../components/ui';

export const objToArray = (obj: any) =>
  Object.keys(obj).map((key) => ({ key, value: obj[key] }));

export const configMapToOptions = (obj: any) =>
  objToArray(obj).map(({ key, value }) => ({
    dropId: value,
    dropText: key,
  }));

export const configEnumToOptions = (enumValue: any) => {
  const items = Object.values(enumValue);
  const keys = items.filter((v) => typeof v === 'string') as string[];
  const values = items.filter((v) => typeof v === 'number') as number[];
  return keys.map((value, index) => ({
    dropId: values[index],
    dropText: value,
  }));
};

export const objectToItems = (object: any): AgoraDropdownItem[] => {
  return Object.keys(object).map((value) => {
    return {
      label: value,
      value: object[value],
    };
  });
};

export const arrayToItems = (array: any[]): AgoraDropdownItem[] => {
  return array.map((value) => {
    return {
      label: value.toString(),
      value: value,
    };
  });
};

export const enumToItems = (enumType: any): AgoraDropdownItem[] => {
  const entries = Object.entries(enumType);
  const items = entries.filter(([, value]) => typeof value === 'number');
  items.sort((a: any, b: any) => a[1] - b[1]);
  return items.map(([key, value]) => ({
    label: key,
    value: value,
  }));
};

export const isDebug = () => {
  return process.env.NODE_ENV === 'development';
};

export const getResourcePath = (filePath = './') => {
  let resourcePath;
  if (isDebug()) {
    resourcePath = path.resolve(
      `${__dirname}`,
      '../../../extraResources/',
      filePath
    );
  } else {
    resourcePath = path.resolve(
      // @ts-ignore
      `${process.resourcesPath}/extraResources`,
      filePath
    );
  }
  return resourcePath;
};

export const getRandomInt = (min = 1, max = 99999) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
