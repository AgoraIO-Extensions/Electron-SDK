import {
  VideoSourceType,
  RendererConfigInternal,
  RendererConfig,
  CONTENT_MODE,
} from "../Renderer/type";
/*
 * @Author: zhangtao@agora.io
 * @Date: 2021-04-28 13:34:31
 * @Last Modified by: zhangtao@agora.io
 * @Last Modified time: 2021-05-10 11:16:41
 */

export const TAG = "[Agora]: ";

export const deprecate = (originApi?: string, replaceApi?: string) => {
  console.warn(
    `${TAG} This method ${originApi} will be deprecated soon. `,
    replaceApi ? `Please use ${replaceApi} instead` : ""
  );
};

export const logWarn = (msg: string, tag: string = TAG) => {
  console.warn(`${tag} ${msg}`);
};

export const logError = (msg: string, tag: string = TAG) => {
  console.error(`${tag} ${msg}`);
};

export const logInfo = (msg: string, tag: string = TAG) => {
  console.log(`${tag} ${msg}`);
};

export const objsKeysToLowerCase = (array: Array<any>) => {
  array.forEach((obj) => {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const element = obj[key];
        obj[key.toLocaleLowerCase()] = element;
      }
    }
  });
};

export const changeEventNameForOnXX = (eventName: string) =>
  eventName.slice(2, 3).toLocaleLowerCase() + eventName.slice(3);
export const jsonStringToArray = (jsonString: string) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    logError(`jsonStringToArray error: ${jsonString}`);
    return [];
  }
};
interface ForwardEventParam {
  event: {
    eventName: string;
    params: string;
    buffer?: string;
    changeNameHandler: (_eventName: string) => string;
  };
  fire: (eventName: string, ...arg: any[]) => void;
  filter: (eventName: string, params: Array<any>, buffer?: string) => Boolean;
}
export const forwardEvent = ({
  event: { eventName, params, buffer, changeNameHandler },
  fire,
  filter,
}: ForwardEventParam) => {
  let _params;
  try {
    _params = JSON.parse(params);
  } catch (error) {
    console.error(`eventName:${eventName}  params:${params}`);
    console.error("parse error: ", error);
    return;
  }
  try {
    const isFilter = filter(eventName, _params, buffer);
    if (isFilter || !fire) {
      return;
    }
    const finalEventName = changeNameHandler(eventName);

    fire(finalEventName, ..._params);
    fire(finalEventName.toLocaleLowerCase(), ..._params);
  } catch (error) {
    console.error(`eventName:${eventName}  params:${params}`);
    console.error("fire error: ", error);
  }
};

export const getUidAndChannelIdForIrisRender = (
  videoSourceType: VideoSourceType,
  originChannelId?: string,
  originUid?: number
): {
  uid: number;
  channelId: string;
} => {
  let uid = originUid;
  let channelId = originChannelId;

  switch (videoSourceType) {
    case VideoSourceType.kVideoSourceCameraPrimary:
    case VideoSourceType.kVideoSourceCameraSecondary:
    case VideoSourceType.kVideoSourceScreenPrimary:
    case VideoSourceType.kVideoSourceScreenSecondary:
      channelId = "";
      uid = videoSourceType;
      break;
    case VideoSourceType.kVideoSourceRemote:
      if (!uid || !channelId) {
        throw new Error(`must have uid:${uid}}  channelId:${channelId}`);
      }
      break;
    default:
      break;
  }
  return { uid: uid!, channelId: channelId! };
};

export const getRendererConfigInternal = (
  originConfig: RendererConfig
): RendererConfigInternal => {
  const rendererOptions = Object.assign(
    {
      append: false,
      contentMode: CONTENT_MODE.FIT,
      mirror: false,
    },
    originConfig.rendererOptions
  );
  // set default RendererConfig
  const newConfig = Object.assign(
    {
      videoSourceType: VideoSourceType.kVideoSourceCameraPrimary,
    },
    originConfig
  );

  const { uid, channelId } = getUidAndChannelIdForIrisRender(
    newConfig.videoSourceType,
    newConfig.channelId,
    newConfig.uid
  );

  return { ...newConfig, uid, channelId, rendererOptions };
};
