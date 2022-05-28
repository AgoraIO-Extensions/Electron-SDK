
export abstract class IAgoraParameter {
abstract release(): void;

abstract setBool(key: string, value: boolean): number;

abstract setInt(key: string, value: number): number;

abstract setUInt(key: string, value: number): number;

abstract setNumber(key: string, value: number): number;

abstract setString(key: string, value: string): number;

abstract setObject(key: string, value: string): number;

abstract setArray(key: string, value: string): number;

abstract getBool(key: string): boolean;

abstract getInt(key: string): number;

abstract getUInt(key: string): number;

abstract getNumber(key: string): number;

abstract getString(key: string): string;

abstract getObject(key: string): string;

abstract getArray(key: string, args: string): string;

abstract setParameters(parameters: string): number;

abstract convertPath(filePath: string, value: string): number;
}
