import { memo } from 'react';
import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import tw from 'twin.macro';
import isEqual from 'react-fast-compare';

interface Props {
    icon?: IconProp;
    title: string | React.ReactNode;
    className?: string;
    children: React.ReactNode;
}

const TitledGreyBox = ({ icon, title, children, className }: Props) => {
    return (
        <div css={tw`rounded-xl overflow-hidden shadow-2xl bg-zb-card/40 backdrop-blur-xl border border-white/5 transition-all duration-250`} className={className}>
            <div css={tw`p-4 border-b border-white/10 bg-zb-accent/5 flex items-center`}>
                {typeof title === 'string' ? (
                    <p css={tw`text-sm font-bold text-zb-text tracking-wide uppercase`}>
                        {icon && <FontAwesomeIcon icon={icon} css={tw`mr-3 text-zb-accent shadow-zb-glow animate-pulse-slow`} />}
                        {title}
                    </p>
                ) : (
                    title
                )}
            </div>
            <div css={tw`p-6 text-zb-text`}>{children}</div>
        </div>
    );
};

export default memo(TitledGreyBox, isEqual);
