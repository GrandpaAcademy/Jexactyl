import tw from 'twin.macro';
import styled from 'styled-components';
import { ReactNode } from 'react';

interface Props {
    $hoverable?: boolean;
    children: ReactNode;
    className?: string;
}

const GreyRowBox = styled.div<{ $hoverable?: boolean }>`
    ${tw`flex rounded-xl no-underline text-zb-text items-center p-4 border border-white/5 transition-all duration-250 overflow-hidden`};
    ${tw`bg-white/5 shadow-lg`};

    ${props => props.$hoverable !== false && tw`hover:border-zb-accent/40 hover:bg-white/[0.08] hover:shadow-zb-glow`};

    & .icon {
        ${tw`rounded-full w-12 h-12 flex items-center justify-center bg-zb-accent/10 text-zb-accent border border-zb-accent/20 p-3 shadow-zb-glow`};
    }
`;

export default (props: Props) => {
    return (
        <GreyRowBox $hoverable={props.$hoverable} className={props.className}>
            {props.children}
        </GreyRowBox>
    );
};
