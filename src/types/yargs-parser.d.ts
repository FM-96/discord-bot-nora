declare module 'yargs-parser' {
	// biome-ignore lint/suspicious/noExplicitAny: type declaration for external module
	export default function yargsParser(input: string, options?: any): Record<string, any>;
}
