
export enum MaxDeviceIdLengthType {
MaxDeviceIdLength = 512,
}

export abstract class IAudioDeviceCollection {
abstract getCount(): number;

abstract getDevice(index: number): { deviceName: string, deviceId: string };

abstract setDevice(deviceId: string): number;

abstract setApplicationVolume(volume: number): number;

abstract getApplicationVolume(): number;

abstract setApplicationMute(mute: boolean): number;

abstract isApplicationMute(): boolean;

abstract release(): void;
}

export abstract class IAudioDeviceManager {
abstract enumeratePlaybackDevices(): IAudioDeviceCollection;

abstract enumerateRecordingDevices(): IAudioDeviceCollection;

abstract setPlaybackDevice(deviceId: string): number;

abstract getPlaybackDevice(): string;

abstract getPlaybackDeviceInfo(): { deviceId: string, deviceName: string };

abstract setPlaybackDeviceVolume(volume: number): number;

abstract getPlaybackDeviceVolume(): number;

abstract setRecordingDevice(deviceId: string): number;

abstract getRecordingDevice(): string;

abstract getRecordingDeviceInfo(): { deviceId: string, deviceName: string };

abstract setRecordingDeviceVolume(volume: number): number;

abstract getRecordingDeviceVolume(): number;

abstract setPlaybackDeviceMute(mute: boolean): number;

abstract getPlaybackDeviceMute(): boolean;

abstract setRecordingDeviceMute(mute: boolean): number;

abstract getRecordingDeviceMute(): boolean;

abstract startPlaybackDeviceTest(testAudioFilePath: string): number;

abstract stopPlaybackDeviceTest(): number;

abstract startRecordingDeviceTest(indicationInterval: number): number;

abstract stopRecordingDeviceTest(): number;

abstract startAudioDeviceLoopbackTest(indicationInterval: number): number;

abstract stopAudioDeviceLoopbackTest(): number;

abstract release(): void;
}
