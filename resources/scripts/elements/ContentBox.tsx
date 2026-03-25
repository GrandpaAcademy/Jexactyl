import type { DetailedHTMLProps, HTMLAttributes } from 'react';
import tw from 'twin.macro';

import FlashMessageRender from '@/elements/FlashMessageRender';
import SpinnerOverlay from '@/elements/SpinnerOverlay';

type Props = Readonly<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
        title?: string;
        borderColor?: string;
        showFlashes?: string | boolean;
        showLoadingOverlay?: boolean;
    }
>;

const ContentBox = ({ title, borderColor, showFlashes, showLoadingOverlay, children, ...props }: Props) => {
    return (
        <div {...props}>
            {title && <h2 css={tw`text-zb-text mb-4 px-4 text-2xl font-bold tracking-tight`}>{title}</h2>}
            {showFlashes && (
                <FlashMessageRender byKey={typeof showFlashes === 'string' ? showFlashes : undefined} css={tw`mb-4`} />
            )}
            <div
                css={[
                    tw`p-6 rounded-2xl shadow-2xl relative bg-zb-card/40 backdrop-blur-xl border border-white/5`,
                    !!borderColor && tw`border-t-2 border-t-zb-accent shadow-zb-glow`,
                ]}
            >
                <SpinnerOverlay visible={showLoadingOverlay || false} />
                {children}
            </div>
        </div>
    );
};

export default ContentBox;
