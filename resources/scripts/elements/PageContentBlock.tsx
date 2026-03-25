import type { ReactNode } from 'react';
import { useEffect } from 'react';
import tw from 'twin.macro';
import ContentContainer from '@/elements/ContentContainer';
import FlashMessageRender from '@/elements/FlashMessageRender';

export interface PageContentBlockProps {
    children?: ReactNode;

    title?: string;
    header?: boolean;
    description?: string;
    className?: string;
    showFlashKey?: string;
}

function PageContentBlock({ title, header, description, showFlashKey, className, children }: PageContentBlockProps) {
    useEffect(() => {
        if (title) {
            document.title = title;
        }
    }, [title]);

    return (
        <>
            <ContentContainer css={tw`my-4 sm:my-10 animate-fade-up`} className={className}>
                {showFlashKey && <FlashMessageRender byKey={showFlashKey} css={tw`mb-4`} />}
                {header && (
                    <div className={'mt-8 mb-12'}>
                        <h1 className={'text-4xl lg:text-5xl font-extrabold tracking-tight bg-zb-gradient bg-clip-text text-transparent inline-block'}>
                            {title}
                        </h1>
                        {description && <p className={'text-zb-text-dim font-medium text-base mt-2 max-w-2xl'}>{description}</p>}
                    </div>
                )}
                {children}
            </ContentContainer>

            <ContentContainer css={tw`mb-8 mt-12 pt-8 border-t border-white/5`}>
                <p css={tw`text-center text-zb-muted text-xs uppercase tracking-widest font-bold`}>
                    Powered by&nbsp;
                    <a
                        rel={'noopener nofollow noreferrer'}
                        href={'https://zero-bot.net'}
                        target={'_blank'}
                        css={tw`no-underline text-zb-accent hover:text-white transition-all duration-250 shadow-zb-glow-sm`}
                    >
                        Zero-Bot.net
                    </a>
                </p>
            </ContentContainer>
        </>
    );
};

export default PageContentBlock;
