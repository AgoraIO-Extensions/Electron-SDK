import './extension/IAgoraSpatialAudioExtension';
import { RtcConnection } from './IAgoraRtcEngineEx';

/**
 * Spatial position information of a remote user or media player.
 */
export class RemoteVoicePositionInfo {
  /**
   * Coordinates in the world coordinate system. This parameter is an array of length 3, representing the coordinates in the forward, right, and up directions respectively.
   */
  position?: number[];
  /**
   * Unit vector of the forward axis in the world coordinate system. This parameter is an array of length 3, representing the forward, right, and up directions respectively.
   */
  forward?: number[];
}

/**
 * Sound isolation zone settings.
 */
export class SpatialAudioZone {
  /**
   * ID of the sound isolation zone.
   */
  zoneSetId?: number;
  /**
   * Spatial center point of the sound isolation zone. This parameter is an array of length 3, representing the coordinates in the forward, right, and up directions.
   */
  position?: number[];
  /**
   * Unit vector in the forward direction from position. This parameter is an array of length 3 representing the coordinates in the forward, right, and up directions.
   */
  forward?: number[];
  /**
   * Unit vector in the right direction from position. This parameter is an array of length 3 representing the coordinates in the forward, right, and up directions.
   */
  right?: number[];
  /**
   * Unit vector in the upward direction from position. This parameter is an array of length 3 representing the coordinates in the forward, right, and up directions.
   */
  up?: number[];
  /**
   * Treating the sound isolation zone as a cube, this represents the length of the forward edge, in game engine units.
   */
  forwardLength?: number;
  /**
   * Treating the sound isolation zone as a cube, this represents the length of the right edge, in game engine units.
   */
  rightLength?: number;
  /**
   * Treating the sound isolation zone as a cube, this represents the length of the upward edge, in game engine units.
   */
  upLength?: number;
  /**
   * Sound attenuation coefficient when users inside and outside the sound isolation zone communicate. Value range: [0,1]:
   *  0: Broadcast mode. Volume and timbre do not attenuate with distance.
   *  (0,0.5): Weak attenuation. Volume and timbre attenuate slightly, allowing sound to travel farther than in real environments.
   *  0.5: Simulates real-world volume attenuation. Equivalent to not setting audioAttenuation.
   *  (0.5,1]: Strong attenuation (default is 1). Volume and timbre attenuate rapidly.
   */
  audioAttenuation?: number;
}

/**
 * This class contains part of the APIs from the ILocalSpatialAudioEngine class.
 *
 * The ILocalSpatialAudioEngine class inherits from IBaseSpatialAudioEngine.
 */
export abstract class IBaseSpatialAudioEngine {
  /**
   * Destroys IBaseSpatialAudioEngine.
   *
   * This method releases all resources under IBaseSpatialAudioEngine. When you no longer need to use spatial audio, you can call this method to release the resources for other operations.
   * After calling this method, you can no longer use any APIs under IBaseSpatialAudioEngine.
   */
  abstract release(): void;

  /**
   * Sets the maximum number of audio streams that can be received within the audio reception range.
   *
   * If the number of audio streams that can be received within the audio reception range exceeds the set value, the local user will receive the maxCount audio streams from the nearest sources.
   *
   * @param maxCount Maximum number of audio streams that can be received within the audio reception range. The value must be ≤ 16. Default is 10.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setMaxAudioRecvCount(maxCount: number): number;

  /**
   * Sets the audio reception range for the local user.
   *
   * After successful setting, the user can only hear remote users within the specified range or those in the same team. You can call this method at any time to update the audio reception range.
   *
   * @param range Maximum range for receiving audio, measured in the distance units of the game engine. The value must be greater than 0. Default is 20.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setAudioRecvRange(range: number): number;

  /**
   * Sets the length (in meters) of one unit of distance in the game engine.
   *
   * The distance unit in the game engine is custom-defined, while the unit used by Agora's spatial audio algorithm is meters. By default, the SDK converts one game engine unit to one meter. You can call this method to convert one unit of the game engine's distance into the specified number of meters.
   *
   * @param unit The number of meters corresponding to one unit of game engine distance. The value must be greater than 0.00. Default is 1.00. For example, if unit is set to 2.00, it means one unit of game engine distance equals 2 meters.
   * The larger the value, the faster the sound fades as the remote user moves away from the local user.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setDistanceUnit(unit: number): number;

  /**
   * Updates the spatial position of the local user.
   *
   * Under the ILocalSpatialAudioEngine class, this method must be used together with updateRemotePosition. The SDK calculates the relative position between the local and remote users based on the parameters set in this method and updateRemotePosition, and then calculates the spatial audio parameters.
   *
   * @param position Coordinates in the world coordinate system. This parameter is an array of length 3, with the three values representing the forward, right, and up coordinates, respectively.
   * @param axisForward Unit vector of the forward axis in the world coordinate system. This parameter is an array of length 3, with the three values representing the forward, right, and up coordinates, respectively.
   * @param axisRight Unit vector of the right axis in the world coordinate system. This parameter is an array of length 3, with the three values representing the forward, right, and up coordinates, respectively.
   * @param axisUp Unit vector of the up axis in the world coordinate system. This parameter is an array of length 3, with the three values representing the forward, right, and up coordinates, respectively.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract updateSelfPosition(
    position: number[],
    axisForward: number[],
    axisRight: number[],
    axisUp: number[]
  ): number;

  /**
   * @ignore
   */
  abstract updateSelfPositionEx(
    position: number[],
    axisForward: number[],
    axisRight: number[],
    axisUp: number[],
    connection: RtcConnection
  ): number;

  /**
   * Updates the spatial position of the media player.
   *
   * After a successful update, the local user can hear changes in the media player's spatial position.
   *
   * @param playerId Media player ID.
   * @param positionInfo Spatial position information of the media player. See RemoteVoicePositionInfo.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract updatePlayerPositionInfo(
    playerId: number,
    positionInfo: RemoteVoicePositionInfo
  ): number;

  /**
   * @ignore
   */
  abstract setParameters(params: string): number;

  /**
   * Stops or resumes publishing the local audio stream.
   *
   * This method does not affect the audio capture state because it does not disable the audio capture device.
   *  This method must be called after joinChannel1 or joinChannel.
   *  When using spatial audio, if you need to set whether to publish the local audio stream, it is recommended to call this method instead of IRtcEngine 's muteLocalAudioStream method.
   *  After successfully calling this method, the remote side triggers the onUserMuteAudio and onRemoteAudioStateChanged callbacks.
   *
   * @param mute Whether to stop publishing the local audio stream. true : Stop publishing the local audio stream. false : Publish the local audio stream.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract muteLocalAudioStream(mute: boolean): number;

  /**
   * Stops or resumes subscribing to all remote users' audio streams.
   *
   * After successfully calling this method, the local user stops or resumes subscribing to all remote users' audio streams, including users who join the channel after the method is called.
   *  This method must be called after joinChannel.
   *  When using spatial audio, if you need to set whether to subscribe to all remote users' audio streams, it is recommended to call this method instead of IRtcEngine 's muteAllRemoteAudioStreams method.
   *  After calling this method, you need to call updateSelfPosition and updateRemotePosition to update the spatial positions of the local and remote users; otherwise, the settings in this method will not take effect.
   *
   * @param mute Whether to stop subscribing to all remote users' audio streams: true : Stop subscribing to all remote users' audio streams. false : Subscribe to all remote users' audio streams.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract muteAllRemoteAudioStreams(mute: boolean): number;

  /**
   * Sets sound insulation zones.
   *
   * In virtual interactive scenarios, you can use this method to set sound insulation zones and audio attenuation coefficients. When the sound source (which can be a user or media player) and the listener are in different zones, the sound experiences attenuation similar to real-world scenarios when encountering physical barriers.
   *  When the sound source and listener are in different zones, the attenuation effect is determined by the audio attenuation coefficient in SpatialAudioZone.
   *  If the user or media player is in the same zone, the attenuation effect is determined by the attenuation parameter in setPlayerAttenuation or setRemoteAudioAttenuation. If neither method is called, the SDK defaults to an attenuation coefficient of 0.5, simulating real-world sound attenuation.
   *  If the sound source and receiver are in two different zones, the receiver cannot hear the sound source. If this method is called multiple times, the most recent configuration takes effect.
   *
   * @param zones Configuration of sound insulation zones. See SpatialAudioZone. Setting this parameter to null clears all zones. On Windows, ensure that the number of elements in the zones array matches the value of zoneCount, otherwise a crash may occur.
   * @param zoneCount Number of sound insulation zones.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setZones(zones: SpatialAudioZone[], zoneCount: number): number;

  /**
   * Sets the sound attenuation properties of the media player.
   *
   * @param playerId Media player ID.
   * @param attenuation Sound attenuation coefficient of the media player, range [0,1].
   *  0: Broadcast mode. Volume and tone do not attenuate with distance. The local user hears the same volume and tone regardless of distance.
   *  (0,0.5): Weak attenuation mode. Volume and tone attenuate slightly during transmission, allowing sound to travel farther than in real environments.
   *  0.5: (Default) Simulates sound attenuation in real environments. Equivalent to not setting the attenuation parameter.
   *  (0.5,1]: Strong attenuation mode. Volume and tone attenuate rapidly during transmission.
   * @param forceSet Whether to force the media player to use the specified attenuation effect: true : Forces the media player to use the attenuation setting. In this case, the audioAttenuation setting in SpatialAudioZone does not affect the media player. false : Does not force the media player to use the attenuation setting. Two scenarios:
   *  If the sound source and listener are in different zones (inside and outside the sound isolation zone), the attenuation effect is determined by audioAttenuation in SpatialAudioZone.
   *  If both are in the same zone or both outside the zone, the attenuation effect is determined by the attenuation value in this method.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setPlayerAttenuation(
    playerId: number,
    attenuation: number,
    forceSet: boolean
  ): number;

  /**
   * Stops or resumes subscribing to the audio stream of a specified remote user.
   *
   * @param uid User ID. Must be the same as the user ID used when joining the channel.
   * @param mute Whether to stop subscribing to the specified remote user's audio stream. true : Stop subscribing to the specified user's audio stream. false : (Default) Subscribe to the specified user's audio stream. The SDK determines whether to subscribe based on the distance between the local and remote users.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract muteRemoteAudioStream(uid: number, mute: boolean): number;
}

/**
 * This class implements spatial audio by calculating user coordinates through the SDK.
 *
 * This class inherits from IBaseSpatialAudioEngine. Before calling other APIs in this class, you need to call the initialize method to initialize it.
 */
export abstract class ILocalSpatialAudioEngine extends IBaseSpatialAudioEngine {
  /**
   * Initializes ILocalSpatialAudioEngine.
   *
   * You need to call this method to initialize ILocalSpatialAudioEngine before calling any other methods in the ILocalSpatialAudioEngine class.
   *  The SDK supports only one ILocalSpatialAudioEngine instance per app.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract initialize(): number;

  /**
   * Updates the spatial position information of a remote user.
   *
   * After successfully calling this method, the SDK calculates the spatial audio parameters based on the relative position between the local and remote users. This method must be called after joinChannel.
   *
   * @param uid User ID. Must be the same as the user ID used when joining the channel.
   * @param posInfo The spatial position information of the remote user. See RemoteVoicePositionInfo.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract updateRemotePosition(
    uid: number,
    posInfo: RemoteVoicePositionInfo
  ): number;

  /**
   * @ignore
   */
  abstract updateRemotePositionEx(
    uid: number,
    posInfo: RemoteVoicePositionInfo,
    connection: RtcConnection
  ): number;

  /**
   * Deletes the spatial position information of the specified remote user.
   *
   * After this method is successfully called, the local user will no longer hear the specified remote user.
   * To avoid wasting computing resources after leaving the channel, you need to call this method to delete the spatial position information of the specified remote user. Otherwise, the spatial position information of that user will be retained. When the number of remote users exceeds the maximum number of audio streams set in setMaxAudioRecvCount, the SDK will automatically unsubscribe from the audio streams of the farthest users based on relative distance.
   *
   * @param uid User ID. Must be the same as the user ID used when joining the channel.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract removeRemotePosition(uid: number): number;

  /**
   * @ignore
   */
  abstract removeRemotePositionEx(
    uid: number,
    connection: RtcConnection
  ): number;

  /**
   * Deletes the spatial position information of all remote users.
   *
   * After successfully calling this method, the local user will not hear any remote users.
   * After leaving the channel, you can also call this method to delete all remote users' spatial position information to avoid wasting computing resources.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract clearRemotePositions(): number;

  /**
   * @ignore
   */
  abstract clearRemotePositionsEx(connection: RtcConnection): number;

  /**
   * Sets the audio attenuation effect for the specified user.
   *
   * @param uid User ID. Must be the same as the user ID used when joining the channel.
   * @param attenuation The audio attenuation coefficient for the user, ranging from [0,1].
   * @param forceSet Whether to force the audio attenuation effect for the user: true : Forces the use of attenuation to set the user's audio attenuation effect. In this case, the audioAttenuation set in SpatialAudioZone does not apply to the user. false : Does not force the use of attenuation to set the user's audio attenuation effect. There are two cases:
   *  If the sound source and listener are inside and outside the sound insulation zone respectively, the attenuation effect is determined by audioAttenuation in SpatialAudioZone.
   *  If the sound source and listener are both inside the same sound insulation zone or both outside, the attenuation effect is determined by attenuation in this method.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setRemoteAudioAttenuation(
    uid: number,
    attenuation: number,
    forceSet: boolean
  ): number;
}
