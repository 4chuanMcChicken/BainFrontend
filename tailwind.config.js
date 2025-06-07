/** @type {import('tailwindcss').Config} */
const config = {
    content: [
        './src/**/*.{html,js,svelte,ts}',
        './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
    ],

    plugins: [
        require('flowbite/plugin')
    ],

    darkMode: 'class',

    theme: {
        extend: {
            colors: {
                gray: {
                    50: '#F9FAFB',
                    100: '#F3F4F6',
                    200: '#E5E7EB',
                    300: '#D1D5DB',
                    400: '#9CA3AF',
                    500: '#6B7280',
                    600: '#4B5563',
                    700: '#374151',
                    800: '#1F2937',
                    900: '#111827',
                },
                blue: {
                    500: '#3B82F6',
                },
                red: {
                    50: '#FEF2F2',
                    400: '#F87171',
                    600: '#DC2626',
                    700: '#B91C1C',
                    800: '#991B1B',
                },
                primary: {
                    50: '#FFF5F2',
                    100: '#FFF1EE',
                    200: '#FFE4DE',
                    300: '#FFD5CC',
                    400: '#FFBCAD',
                    500: '#FE795D',
                    600: '#EF562F',
                    700: '#EB4F27',
                    800: '#CC4522',
                    900: '#A5371B'
                }
            }
        }
    }
};

module.exports = config; 