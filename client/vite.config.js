import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [sveltekit()],
    server: {
        proxy: {
            '/check-username': 'http://localhost:3000',
            '/select-username': 'http://localhost:3000',
        }
    }
});
