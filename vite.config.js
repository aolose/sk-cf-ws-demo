import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import ws from 'vite-sveltekit-cf-ws';

export default defineConfig({
	plugins: [sveltekit(),ws()]
});
