import tw, { css, styled } from 'twin.macro';

import { SiteTheme } from '@/state/theme';
import { useStoreState } from '@/state/hooks';
import React from 'react';
import { withSubComponents } from '@/lib/helpers';

const Icon: React.FC<{ icon: React.ElementType }> = ({ icon: Icon }) => {
    return <Icon className={'text-zb-accent'} />;
};

const Wrapper = styled.div<{ $admin?: boolean }>`
    ${tw`w-full flex flex-col px-4`};

    & > a {
        ${tw`w-full flex flex-row items-center text-zb-text-dim cursor-pointer select-none px-4`};
        ${tw`hover:text-white hover:bg-white/5 rounded-xl`};
        height: ${({ $admin }) => ($admin ? '2.5rem' : '4rem')};
        ${tw`transition-all duration-250`};

        & > svg {
            ${tw`h-5 w-5 flex flex-shrink-0`};
        }

        & > span {
            ${tw`font-header font-medium text-base whitespace-nowrap leading-none ml-4`};
        }

        &:active,
        &.active {
            ${tw`bg-zb-accent/10 text-zb-accent shadow-zb-glow`};
            border-left: 3px solid var(--zb-accent);
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }
    }
`;

const Section = styled.div`
    ${tw`h-[18px] font-header font-bold text-xs text-zb-muted whitespace-nowrap uppercase ml-8 mt-6 mb-2 select-none tracking-widest`};

    &:not(:first-of-type) {
        ${tw`mt-8`};
    }
`;

const User = styled.div`
    ${tw`h-16 w-full flex items-center bg-black/10 justify-center border-t border-white/5`};
`;

const Sidebar = styled.div<{ $collapsed?: boolean }>`
    ${tw`hidden md:flex h-screen flex-col items-center flex-shrink-0 overflow-x-hidden ease-linear`};
    ${tw`transition-all duration-500`};
    ${tw`w-[16rem] bg-zb-bg/40 backdrop-blur-2xl border-r border-white/5 shadow-2xl`};

    & > a,
    & > span > a {
        ${tw`h-12 w-full flex flex-row items-center text-zb-text-dim cursor-pointer select-none px-8 my-1`};
        ${tw`hover:text-white hover:bg-white/5 transition-all duration-250 rounded-xl mx-2`};

        & > svg {
            ${tw`transition-none h-6 w-6 flex flex-shrink-0`};
        }

        & > span {
            ${tw`font-header font-medium text-lg whitespace-nowrap leading-none ml-4`};
        }

        &.active {
            ${tw`bg-zb-accent/10 text-zb-accent shadow-zb-glow`};
            border-left: 3px solid var(--zb-accent);
        }
    }

    ${props =>
        props.$collapsed &&
        css`
            ${tw`w-20`};

            ${Section} {
                ${tw`invisible`};
            }

            ${Wrapper} {
                ${tw`px-5`};

                & > a {
                    ${tw`justify-center px-0`};
                    border-left: none !important;
                    
                    &.active {
                        ${tw`bg-zb-accent/10 shadow-zb-glow rounded-xl`};
                    }
                }
            }

            & > a {
                ${tw`justify-center px-0 mx-0`};
                border-left: none !important;
            }

            & > a > span,
            ${User} > div,
            ${User} > a,
            ${Wrapper} > a > span {
                ${tw`hidden`};
            }
        `};
`;

export default withSubComponents(Sidebar, { Section, Wrapper, User, Icon });
