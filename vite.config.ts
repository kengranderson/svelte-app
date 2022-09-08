import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import { loadEnv } from 'vite';

const config: UserConfig = {
	plugins: [sveltekit()],
	// https://dev.to/richardbray/how-to-fix-the-referenceerror-global-is-not-defined-error-in-sveltekitvite-2i49
	define: {
		__env__: JSON.stringify(loadEnv('development', process.cwd())),
		global: {}
	}
};

export default config;
