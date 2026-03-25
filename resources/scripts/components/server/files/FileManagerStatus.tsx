import { CloudUploadIcon, XIcon } from '@heroicons/react/solid';
import { useContext, useEffect, useState } from 'react';

import { Button } from '@/elements/button/index';
import { Dialog, DialogWrapperContext } from '@/elements/dialog';
import Tooltip from '@/elements/tooltip/Tooltip';
import asDialog from '@/hoc/asDialog';
import { ServerContext } from '@/state/server';

const svgProps = {
    cx: 16,
    cy: 16,
    r: 14,
    strokeWidth: 3,
    fill: 'none',
    stroke: 'currentColor',
};

const Spinner = ({ progress, className }: { progress: number; className?: string }) => (
    <svg viewBox={'0 0 32 32'} className={className}>
        <circle {...svgProps} className={'opacity-10 text-white'} />
        <circle
            {...svgProps}
            stroke={'#00F0FF'}
            strokeDasharray={28 * Math.PI}
            className={'origin-[50%_50%] rotate-[-90deg] transition-[stroke-dashoffset] duration-300 drop-shadow-[0_0_2px_rgba(0,240,255,0.5)]'}
            style={{ strokeDashoffset: ((100 - progress) / 100) * 28 * Math.PI }}
        />
    </svg>
);

const FileUploadList = () => {
    const { close } = useContext(DialogWrapperContext);
    const cancelFileUpload = ServerContext.useStoreActions(actions => actions.files.cancelFileUpload);
    const clearFileUploads = ServerContext.useStoreActions(actions => actions.files.clearFileUploads);
    const uploads = ServerContext.useStoreState(state =>
        Object.entries(state.files.uploads).sort(([a], [b]) => a.localeCompare(b)),
    );

    return (
        <div className={'mt-6 space-y-3'}>
            {uploads.map(([name, file]) => (
                <div key={name} className={'flex items-center space-x-3 rounded-xl bg-white/5 border border-white/5 p-4 transition-all duration-300 hover:border-white/10'}>
                    <Tooltip content={`${Math.floor((file.loaded / file.total) * 100)}%`} placement={'left'}>
                        <div className={'flex-shrink-0'}>
                            <Spinner progress={(file.loaded / file.total) * 100} className={'h-8 w-8'} />
                        </div>
                    </Tooltip>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zb-text-dim truncate lowercase tracking-tight">
                            {name}
                        </p>
                    </div>
                    <button
                        onClick={cancelFileUpload.bind(this, name)}
                        className={'text-zb-muted/40 transition-colors duration-300 hover:text-zb-danger'}
                    >
                        <XIcon className={'h-5 w-5'} />
                    </button>
                </div>
            ))}
            <Dialog.Footer>
                <Button onClick={() => clearFileUploads()} className="bg-zb-danger/10 border-zb-danger/30 text-zb-danger hover:bg-zb-danger/20">
                    Cancel All
                </Button>
                <Button onClick={close} className="bg-white/5 border-white/10 hover:bg-white/10 text-zb-text-dim">
                    Close
                </Button>
            </Dialog.Footer>
        </div>
    );
};

const FileUploadListDialog = asDialog({
    title: 'File Uploads',
    description: 'The following files are being uploaded to your server.',
})(FileUploadList);

export default () => {
    const [open, setOpen] = useState(false);

    const count = ServerContext.useStoreState(state => Object.keys(state.files.uploads).length);
    const progress = ServerContext.useStoreState(state => ({
        uploaded: Object.values(state.files.uploads).reduce((count, file) => count + file.loaded, 0),
        total: Object.values(state.files.uploads).reduce((count, file) => count + file.total, 0),
    }));

    useEffect(() => {
        if (count === 0) {
            setOpen(false);
        }
    }, [count]);

    return (
        <>
            {count > 0 && (
                <Tooltip content={`${count} files are uploading, click to view`}>
                    <button className={'relative flex h-10 w-10 items-center justify-center group'} onClick={() => setOpen(true)}>
                        <Spinner progress={(progress.uploaded / progress.total) * 100} className={'h-10 w-10 group-hover:scale-110 transition-transform duration-300'} />
                        <CloudUploadIcon className={'absolute mx-auto h-4 text-zb-accent animate-pulse drop-shadow-zb-glow-sm'} />
                    </button>
                </Tooltip>
            )}
            <FileUploadListDialog open={open} onClose={() => setOpen(false)} />
        </>
    );
};
