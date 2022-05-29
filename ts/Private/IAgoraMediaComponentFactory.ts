import { MediaPlayerSourceType } from './AgoraMediaBase'
import { IMediaPlayer } from './IAgoraMediaPlayer'

export abstract class IMediaComponentFactory {
abstract createMediaPlayer(type?: MediaPlayerSourceType): IMediaPlayer;
}
