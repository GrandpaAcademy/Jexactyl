import styled, { css } from 'styled-components';
import tw from 'twin.macro';

export interface Props {
    isLight?: boolean;
    hasError?: boolean;
}

const light = css<Props>`
    ${tw`bg-white border-neutral-200 text-neutral-800`};

    &:disabled {
        ${tw`bg-neutral-100 border-neutral-200`};
    }
`;

const checkboxStyle = css<Props>`
    ${tw`bg-neutral-500 cursor-pointer appearance-none inline-block align-middle select-none flex-shrink-0 w-4 h-4 text-primary-400 border border-neutral-300 rounded-sm`};
    color-adjust: exact;
    background-origin: border-box;
    transition: all 75ms linear, box-shadow 25ms linear;

    &:checked {
        ${tw`border-transparent bg-no-repeat bg-center`};
        background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
        background-color: currentColor;
        background-size: 100% 100%;
    }
`;

const inputStyle = () => {
    return css<Props>`
        // Reset to normal styling.
        resize: none;
        ${tw`appearance-none outline-none w-full min-w-0`};
        ${tw`py-2.5 px-3 border-2 rounded-lg transition-all duration-250`};
        ${tw`bg-white/5 border-white/10 text-zb-text shadow-none`};

        &:hover:not(:disabled):not(:read-only) {
            ${tw`border-white/20 bg-white/[0.08]`};
        }

        &:focus {
            ${tw`border-zb-accent/50 bg-white/[0.08]`};
            box-shadow: 0 0 15px rgba(0, 240, 255, 0.15);
        }

        & + .input-help {
            ${tw`mt-1 text-xs`};
            ${props => (props.hasError ? tw`text-zb-danger` : tw`text-zb-text-dim`)};
        }

        &:required,
        &:invalid {
            ${tw`shadow-none`};
        }

        &:disabled {
            ${tw`opacity-50 cursor-not-allowed`};
        }

        ${props =>
            props.isLight
                ? light
                : css`
                      &:not(.ignoreReadOnly):read-only {
                          ${tw`border-white/5 bg-white/[0.02] text-zb-muted`};
                      }
                  `};
        ${props => props.hasError && tw`text-zb-danger border-zb-danger/50 hover:border-zb-danger`};
    `;
};

const Input = styled.input<Props>`
    &:not([type='checkbox']):not([type='radio']) {
        ${inputStyle};
    }

    &[type='checkbox'],
    &[type='radio'] {
        ${checkboxStyle};

        &[type='radio'] {
            ${tw`rounded-full`};
        }
    }
`;

const Textarea = styled.textarea<Props>`
    ${inputStyle}
`;

export { Textarea };
export default Input;
