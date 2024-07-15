import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [sveltekit()],
    server: {
        proxy: {
            '/check-username': 'https://messenger-tu85.onrender.com',
            '/select-username': 'https://messenger-tu85.onrender.com',
            '/api': 'https://messenger-tu85.onrender.com',
        }
    }
});
