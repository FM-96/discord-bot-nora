declare module 'base65536' {
	export function encode(data: Buffer): string;
	export function decode(data: string): Buffer;
}
