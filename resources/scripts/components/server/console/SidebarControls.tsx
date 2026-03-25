import { useEffect, useState } from 'react';
import * as React from 'react';
import Can from '@/elements/Can';
import { ServerContext } from '@/state/server';
import { PowerAction } from '@server/console/ServerConsoleContainer';
import { Dialog } from '@/elements/dialog';
import { PlayIcon, StopIcon, BanIcon, RefreshIcon } from '@heroicons/react/outline';
import classNames from 'classnames';

interface PowerButtonProps {
    className?: string;
}

export default ({ className }: PowerButtonProps) => {
    const [open, setOpen] = useState(false);
    const status = ServerContext.useStoreState(state => state.status.value);
    const instance = ServerContext.useStoreState(state => state.socket.instance);

    const killable = status === 'stopping';
    const onButtonClick = (
        action: PowerAction | 'kill-confirmed',
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ): void => {
        e.preventDefault();
        if (action === 'kill') {
            return setOpen(true);
        }

        if (instance) {
            setOpen(false);
            instance.send('set state', action === 'kill-confirmed' ? 'kill' : action);
        }
    };

    useEffect(() => {
        if (status === 'offline') {
            setOpen(false);
        }
    }, [status]);

    return (
        <div className={classNames(className, 'flex flex-col gap-y-4')}>
            <Dialog.Confirm
                open={open}
                hideCloseIcon
                onClose={() => setOpen(false)}
                title={'Forcibly Stop Process'}
                confirm={'Continue'}
                onConfirmed={onButtonClick.bind(this, 'kill-confirmed')}
            >
                Forcibly stopping a server can lead to data corruption.
            </Dialog.Confirm>
            <div className="flex items-center justify-between bg-zb-card/30 backdrop-blur-xl border border-white/5 p-4 rounded-2xl shadow-xl mx-4">
                <Can action={'control.start'}>
                    <button
                        disabled={status !== 'offline'}
                        onClick={onButtonClick.bind(this, 'start')}
                        className={classNames('p-3 rounded-xl transition-all duration-300 bg-white/5 border border-white/5', status === 'offline' ? 'text-zb-success hover:bg-zb-success/10 hover:border-zb-success/30 hover:shadow-zb-glow-success/30' : 'text-zb-muted/40 cursor-not-allowed')}
                    >
                        <PlayIcon className={'w-6 h-6'} />
                    </button>
                </Can>
                <Can action={'control.restart'}>
                    <button
                        disabled={!status || status === 'offline'}
                        onClick={onButtonClick.bind(this, 'restart')}
                        className={classNames('p-3 rounded-xl transition-all duration-300 bg-white/5 border border-white/5', status && status !== 'offline' ? 'text-zb-warning hover:bg-zb-warning/10 hover:border-zb-warning/30 hover:shadow-zb-glow-warning/20' : 'text-zb-muted/40 cursor-not-allowed')}
                    >
                        <RefreshIcon className={'w-6 h-6'} />
                    </button>
                </Can>
                <Can action={'control.stop'}>
                    <button
                        disabled={status === 'offline'}
                        onClick={onButtonClick.bind(this, killable ? 'kill' : 'stop')}
                        className={classNames('p-3 rounded-xl transition-all duration-300 bg-white/5 border border-white/5', status !== 'offline' ? 'text-zb-danger hover:bg-zb-danger/10 hover:border-zb-danger/30 hover:shadow-zb-glow-danger/30' : 'text-zb-muted/40 cursor-not-allowed')}
                    >
                        {killable ? <BanIcon className={'w-6 h-6'} /> : <StopIcon className={'w-6 h-6'} />}
                    </button>
                </Can>
            </div>
        </div>
    );
};
