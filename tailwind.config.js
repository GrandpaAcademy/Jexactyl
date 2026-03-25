const colors = require('tailwindcss/colors');

module.exports = {
    content: ['./resources/scripts/**/*.{js,ts,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Inter"', 'system-ui', 'sans-serif'],
                header: ['"Inter"', '"IBM Plex Sans"', 'system-ui', 'sans-serif'],
                mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
            },
            colors: {
                black: '#09090b',
                slate: colors.slate,
                primary: colors.green,
                neutral: colors.slate,
                cyan: colors.cyan,
                zinc: colors.zinc,
                // Zero-Bot.net Design System
                zb: {
                    bg: '#0A0E17',
                    'bg-2': '#0D1220',
                    surface: '#111827',
                    card: '#1A1F2E',
                    'card-2': '#1E2435',
                    border: 'rgba(255,255,255,0.06)',
                    accent: '#00F0FF',
                    'accent-dim': '#00C4D4',
                    'accent-2': '#7C3AED',
                    'accent-2-dim': '#6D28D9',
                    success: '#10B981',
                    warning: '#F59E0B',
                    danger: '#EF4444',
                    muted: '#6B7280',
                    text: '#E5E7EB',
                    'text-dim': '#9CA3AF',
                },
            },
            fontSize: {
                '2xs': '0.625rem',
            },
            transitionDuration: {
                250: '250ms',
            },
            backgroundImage: {
                'login': "url('https://images.unsplash.com/photo-1531257114315-24a694751517')",
                'zb-gradient': 'linear-gradient(135deg, #00F0FF 0%, #7C3AED 100%)',
                'zb-gradient-dark': 'linear-gradient(135deg, rgba(0,240,255,0.15) 0%, rgba(124,58,237,0.15) 100%)',
                'zb-card-gradient': 'linear-gradient(145deg, #1A1F2E 0%, #111827 100%)',
            },
            boxShadow: {
                'zb-glow-sm': '0 0 10px rgba(0, 240, 255, 0.1)',
                'zb-glow-sm-purple': '0 0 10px rgba(124, 58, 237, 0.15)',
                'zb-glow-sm-red': '0 0 10px rgba(239, 68, 68, 0.15)',
                'zb-glow': '0 0 20px rgba(0, 240, 255, 0.15)',
                'zb-glow-md': '0 0 30px rgba(0, 240, 255, 0.25)',
                'zb-glow-strong': '0 0 40px rgba(0, 240, 255, 0.25)',
                'zb-glow-violet': '0 0 20px rgba(124, 58, 237, 0.2)',
                'zb-card': '0 4px 24px rgba(0, 0, 0, 0.4)',
                'zb-card-hover': '0 8px 40px rgba(0, 0, 0, 0.6)',
            },
            borderColor: theme => ({
                default: theme('colors.neutral.400', 'currentColor'),
            }),
            animation: {
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'shimmer': 'shimmer 1.5s linear infinite',
                'aurora': 'aurora 8s ease-in-out infinite alternate',
                'fade-up': 'fadeUp 0.2s ease-out',
                'fade-in': 'fadeIn 0.2s ease-out',
            },
            keyframes: {
                pulseGlow: {
                    '0%, 100%': { opacity: '1', boxShadow: '0 0 8px rgba(0,240,255,0.4)' },
                    '50%': { opacity: '0.7', boxShadow: '0 0 20px rgba(0,240,255,0.7)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                aurora: {
                    '0%': { backgroundPosition: '0% 50%' },
                    '100%': { backgroundPosition: '100% 50%' },
                },
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(8px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
            dropShadow: {
                'zb-glow-sm': '0 0 10px rgba(0, 240, 255, 0.4)',
            },
        },
    },
    plugins: [
        require('@tailwindcss/line-clamp'),
        require('@tailwindcss/forms')({
            strategy: 'class',
        }),
    ],
};
