import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ReactNode } from 'react';
import SpinnerOverlay from '@/elements/SpinnerOverlay';
import Spinner from '@/elements/Spinner';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/outline';
import FlashMessageRender from '@/elements/FlashMessageRender';
import { Status } from '@/plugins/useStatus';
import classNames from 'classnames';

interface Props {
    icon?: IconProp;
    isLoading?: boolean;
    title: string | ReactNode;
    className?: string;
    noPadding?: boolean;
    byKey?: string;
    children: ReactNode;
    button?: ReactNode;

    status?: Status;
    canDelete?: boolean;
}

const AdminBox = ({
    icon,
    title,
    className,
    isLoading,
    children,
    button,
    noPadding,
    byKey,
    status,
    canDelete,
}: Props) => {
    let position = 'right-10';
    if (canDelete) position = 'right-12';

    return (
        <div
            className={classNames(
                'relative bg-zb-card/30 backdrop-blur-xl rounded-2xl border border-white/5 shadow-2xl transition-all duration-300 hover:border-white/10 overflow-hidden',
                className,
            )}
        >
            <SpinnerOverlay visible={isLoading || false} />
            {status === 'loading' && (
                <div className={classNames(position, 'absolute top-0 mt-4')}>
                    <Spinner size={'small'} />
                </div>
            )}
            {status === 'success' && (
                <CheckCircleIcon className={classNames(position, 'w-5 h-5 absolute top-0 mt-4 text-zb-success shadow-zb-glow-sm/20')} />
            )}
            {status === 'error' && (
                <ExclamationCircleIcon
                    className={classNames(position, 'w-5 h-5 absolute top-0 mt-4 text-zb-danger shadow-zb-glow-sm/20')}
                />
            )}
            <div className="flex flex-row items-center justify-between px-6 py-4 bg-white/5 border-b border-white/5 transition-all duration-300">
                {typeof title === 'string' ? (
                    <div className="flex items-center gap-3">
                        {icon && <FontAwesomeIcon icon={icon} className="text-zb-accent shadow-zb-glow-sm/20" />}
                        <p className="font-semibold text-neutral-100 tracking-tight">
                            {title}
                        </p>
                    </div>
                ) : (
                    title
                )}
                {button}
            </div>
            <div className={classNames('transition-all duration-300', !noPadding && 'px-6 py-6')}>
                <FlashMessageRender byKey={byKey ?? 'null'} className={'mb-4'} />
                <div className="text-neutral-300 leading-relaxed">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AdminBox;
