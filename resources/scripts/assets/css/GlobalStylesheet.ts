import tw from 'twin.macro';
import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
    /* -------------------------------------------------- */
    /* Zero-Bot.net — CSS Variables                        */
    /* -------------------------------------------------- */
    :root {
        --zb-bg:         #0A0E17;
        --zb-surface:    #111827;
        --zb-card:       #1A1F2E;
        --zb-accent:     #00F0FF;
        --zb-accent-2:   #7C3AED;
        --zb-success:    #10B981;
        --zb-warning:    #F59E0B;
        --zb-danger:     #EF4444;
        --zb-text:       #E5E7EB;
        --zb-muted:      #6B7280;

        /* Glassmorphism */
        --glass-bg:      rgba(26, 31, 46, 0.6);
        --glass-border:  rgba(255, 255, 255, 0.06);
        --glass-blur:    16px;
        --glass-shadow:  0 4px 24px rgba(0, 0, 0, 0.4);

        /* Accent glow */
        --glow-cyan:     0 0 20px rgba(0, 240, 255, 0.15);
        --glow-violet:   0 0 20px rgba(124, 58, 237, 0.2);
    }

    /* -------------------------------------------------- */
    /* Base                                               */
    /* -------------------------------------------------- */
    *, *::before, *::after {
        box-sizing: border-box;
    }

    html {
        scroll-behavior: smooth;
        -webkit-text-size-adjust: 100%;
    }

    body {
        ${tw`font-sans text-zb-text`};
        background-color: var(--zb-bg);
        background-image:
            radial-gradient(ellipse 80% 50% at 20% -20%, rgba(0, 240, 255, 0.06) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 100%, rgba(124, 58, 237, 0.06) 0%, transparent 60%);
        background-attachment: fixed;
        letter-spacing: 0.012em;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    h1, h2, h3, h4, h5, h6 {
        ${tw`font-medium tracking-normal font-header text-zb-text`};
    }

    p {
        ${tw`text-zb-text leading-snug font-sans`};
    }

    form {
        ${tw`m-0`};
    }

    textarea, select, input, button, button:focus, button:focus-visible {
        ${tw`outline-none`};
    }

    input[type=number]::-webkit-outer-spin-button,
    input[type=number]::-webkit-inner-spin-button {
        -webkit-appearance: none !important;
        margin: 0;
    }

    input[type=number] {
        -moz-appearance: textfield !important;
    }

    /* -------------------------------------------------- */
    /* Selection                                          */
    /* -------------------------------------------------- */
    ::selection {
        background: rgba(0, 240, 255, 0.2);
        color: #fff;
    }

    /* -------------------------------------------------- */
    /* Scrollbar                                          */
    /* -------------------------------------------------- */
    ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
        background: transparent;
    }

    ::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.02);
        border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        transition: background 0.2s;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 240, 255, 0.25);
    }

    ::-webkit-scrollbar-corner {
        background: transparent;
    }

    /* -------------------------------------------------- */
    /* Utility Classes                                    */
    /* -------------------------------------------------- */

    /* Glass card */
    .glass {
        background: var(--glass-bg);
        backdrop-filter: blur(var(--glass-blur));
        -webkit-backdrop-filter: blur(var(--glass-blur));
        border: 1px solid var(--glass-border);
        box-shadow: var(--glass-shadow);
    }

    /* Gradient text */
    .gradient-text {
        background: linear-gradient(135deg, #00F0FF 0%, #7C3AED 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    /* Neon glow border */
    .glow-border {
        border-color: rgba(0, 240, 255, 0.3) !important;
        box-shadow: 0 0 12px rgba(0, 240, 255, 0.1), inset 0 0 12px rgba(0, 240, 255, 0.05);
    }

    /* Skeleton shimmer */
    .skeleton {
        background: linear-gradient(90deg,
            rgba(255,255,255,0.04) 25%,
            rgba(255,255,255,0.08) 50%,
            rgba(255,255,255,0.04) 75%
        );
        background-size: 200% 100%;
        animation: shimmer 1.5s linear infinite;
    }

    @keyframes shimmer {
        0%   { background-position: -200% 0; }
        100% { background-position:  200% 0; }
    }

    @keyframes pulseGlow {
        0%, 100% { box-shadow: 0 0 8px rgba(0,240,255,0.4); }
        50%       { box-shadow: 0 0 20px rgba(0,240,255,0.7); }
    }

    @keyframes fadeUp {
        from { opacity: 0; transform: translateY(8px); }
        to   { opacity: 1; transform: translateY(0); }
    }
`;

