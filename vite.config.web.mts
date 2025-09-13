import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
// import dts from 'vite-plugin-dts'

const config = defineConfig({
    build: {
        minify: false,
        lib: {
            entry: ["./index.html"],
            name: "@woby/slider",
            formats: ['cjs', 'es', 'umd'],
            fileName: (format: string, entryName: string) => `${entryName}.${format}.js`
        },
        outDir: './build',
        sourcemap: false,
        rollupOptions: {
            external: ['woby', 'woby/jsx-runtime', 'oby',
                './src/docs'
            ],
            output: {
                globals: {
                    'woby': 'woby',
                    'woby/jsx-runtime': 'woby/jsx-runtime',
                }
            }
        }
    },
    esbuild: {
        jsx: 'automatic',
    },
    plugins: [
        // dts({ entryRoot: './src', outputDir: './dist/types' })
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '~': path.resolve(__dirname, 'src'),
            'woby/jsx-dev-runtime': process.argv.includes('dev') ? path.resolve('../woby/src/jsx/runtime') : 'woby', //'woby/jsx-dev-runtime',
            'woby/jsx-runtime': process.argv.includes('dev') ? path.resolve('../woby/src/jsx/runtime') : 'woby', //'woby/jsx-runtime',
            'woby': process.argv.includes('dev') ? path.resolve('../woby/src') : 'woby'
        },
    },
})



export default config
