import type { ReactNode } from 'react';
import { useEffect } from 'react';
import FlashMessageRender from '@/elements/FlashMessageRender';

const AdminContentBlock: React.FC<{
    children: ReactNode;
    title?: string;
    showFlashKey?: string;
}> = ({ children, title, showFlashKey }) => {
    useEffect(() => {
        if (!title) return;
        document.title = `Admin | ${title}`;
    }, [title]);

    return (
        <>
            {showFlashKey && <FlashMessageRender byKey={showFlashKey} className="mb-6" />}
            {children}
            <p className="text-center text-neutral-500 text-xs mt-12 mb-8">
                &copy; {new Date().getFullYear()}&nbsp;
                <a
                    rel={'noopener nofollow noreferrer'}
                    href={'https://zero-bot.net'}
                    target={'_blank'}
                    className="no-underline text-neutral-500 hover:text-neutral-300 transition-colors duration-300 flex items-center justify-center gap-x-2"
                >
                    <img src={'https://xxxxxcdn.zero-bot.net/logo-icon.svg'} className={'w-3 h-3'} alt={'Zero-Bot'} />
                    Zero-Bot.net
                </a>
            </p>
        </>
    );
};

export default AdminContentBlock;
