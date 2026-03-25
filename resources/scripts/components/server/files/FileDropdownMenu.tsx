import { memo, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import RenameFileModal from '@server/files/RenameFileModal';
import { ServerContext } from '@/state/server';
import { join } from 'pathe';
import { deleteFiles, copyFile, getFileDownloadUrl, compressFiles, decompressFiles } from '@/api/routes/server/files';
import Can from '@/elements/Can';
import { type FileObject } from '@definitions/server';
import useFlash from '@/plugins/useFlash';
import useFileManagerSwr from '@/plugins/useFileManagerSwr';
import useEventListener from '@/plugins/useEventListener';
import isEqual from 'react-fast-compare';
import ChmodFileModal from '@server/files/ChmodFileModal';
import { Dialog } from '@/elements/dialog';
import { Button } from '@/elements/button';
import {
    ArchiveIcon,
    ArrowUpIcon,
    ClipboardCopyIcon,
    CogIcon,
    DownloadIcon,
    InboxIcon,
    PencilIcon,
    TrashIcon,
} from '@heroicons/react/outline';

type ModalType = 'rename' | 'move' | 'chmod';

const FileDropdownMenu = ({ file }: { file: FileObject }) => {
    const [visible, setVisible] = useState<boolean>(false);
    const [modal, setModal] = useState<ModalType | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const uuid = ServerContext.useStoreState(state => state.server.data!.uuid);
    const { mutate } = useFileManagerSwr();
    const { clearAndAddHttpError, clearFlashes } = useFlash();
    const directory = ServerContext.useStoreState(state => state.files.directory);

    useEventListener(`pterodactyl:files:ctx:${file.key}`, (e: CustomEvent) => {
        setVisible(true);
    });

    useEffect(() => {
        if (modal || showConfirmation) {
            setVisible(false);
        }
    }, [modal, showConfirmation]);

    const doDeletion = async () => {
        clearFlashes('files');
        await mutate(files => files!.filter(f => f.key !== file.key), false);
        deleteFiles(uuid, directory, [file.name]).catch(error => {
            mutate();
            clearAndAddHttpError({ key: 'files', error });
        });
    };

    const doCopy = () => {
        clearFlashes('files');
        copyFile(uuid, join(directory, file.name))
            .then(() => {
                mutate();
                setVisible(false);
            })
            .catch(error => clearAndAddHttpError({ key: 'files', error }));
    };

    const doDownload = () => {
        clearFlashes('files');
        getFileDownloadUrl(uuid, join(directory, file.name))
            .then(url => {
                // @ts-expect-error this is valid
                window.location = url;
            })
            .catch(error => clearAndAddHttpError({ key: 'files', error }));
    };

    const doArchive = () => {
        clearFlashes('files');
        compressFiles(uuid, directory, [file.name])
            .then(() => {
                mutate();
                setVisible(false);
            })
            .catch(error => clearAndAddHttpError({ key: 'files', error }));
    };

    const doUnarchive = () => {
        clearFlashes('files');
        decompressFiles(uuid, directory, file.name)
            .then(() => {
                mutate();
                setVisible(false);
            })
            .catch(error => clearAndAddHttpError({ key: 'files', error }));
    };

    return (
        <>
            {modal ? (
                modal === 'chmod' ? (
                    <ChmodFileModal
                        visible
                        appear
                        files={[{ file: file.name, mode: file.modeBits }]}
                        onDismissed={() => setModal(null)}
                    />
                ) : (
                    <RenameFileModal
                        visible
                        appear
                        files={[file.name]}
                        useMoveTerminology={modal === 'move'}
                        onDismissed={() => setModal(null)}
                    />
                )
            ) : null}
            <Dialog.Confirm
                open={showConfirmation}
                onClose={() => setShowConfirmation(false)}
                title={`Delete ${file.isFile ? 'File' : 'Directory'}`}
                confirm={'Delete'}
                onConfirmed={doDeletion}
            >
                You will not be able to recover the contents of&nbsp;
                <span className={'font-semibold text-zb-text'}>{file.name}</span> once deleted.
            </Dialog.Confirm>
            
            <button
                onClick={() => setVisible(true)}
                className="p-2 rounded-lg bg-white/5 border border-white/5 text-zb-muted/40 hover:text-zb-accent hover:bg-zb-accent/10 hover:border-zb-accent/30 transition-all duration-300 shadow-zb-glow-sm/0 hover:shadow-zb-glow-sm/20"
            >
                 <FontAwesomeIcon icon={faEllipsisV} className="w-4 h-4" />
            </button>

            {visible && (
                <Dialog open={visible} onClose={() => setVisible(false)} title={'File Options'}>
                    <div className={'grid grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-4 mt-6'}>
                        <Can action={'file.update'}>
                            <Button className={'w-full bg-white/5 border-white/10 hover:bg-white/10 text-zb-text-dim'} onClick={() => setModal('rename')}>
                                <PencilIcon className={'w-4 mt-0.5 mr-2'} />
                                Rename
                            </Button>
                            <Button className={'w-full bg-white/5 border-white/10 hover:bg-white/10 text-zb-text-dim'} onClick={() => setModal('move')}>
                                <ArrowUpIcon className={'w-4 mt-0.5 mr-2'} />
                                Move
                            </Button>
                            <Button className={'w-full bg-white/5 border-white/10 hover:bg-white/10 text-zb-text-dim'} onClick={() => setModal('chmod')}>
                                <CogIcon className={'w-4 mt-0.5 mr-2'} />
                                Permissions
                            </Button>
                        </Can>
                        {file.isFile && (
                            <Can action={'file.create'}>
                                <Button className={'w-full bg-white/5 border-white/10 hover:bg-white/10 text-zb-text-dim'} onClick={doCopy}>
                                    <ClipboardCopyIcon className={'w-4 mt-0.5 mr-2'} />
                                    Copy File
                                </Button>
                            </Can>
                        )}
                        {file.isArchiveType() ? (
                            <Can action={'file.create'}>
                                <Button className={'w-full bg-zb-warning/10 border-zb-warning/30 text-zb-warning hover:bg-zb-warning/20'} onClick={doUnarchive}>
                                    <InboxIcon className={'w-4 mt-0.5 mr-2'} />
                                    Extract
                                </Button>
                            </Can>
                        ) : (
                            <Can action={'file.archive'}>
                                <Button className={'w-full bg-zb-accent/10 border-zb-accent/30 text-zb-accent hover:bg-zb-accent/20'} onClick={doArchive}>
                                    <ArchiveIcon className={'w-4 mt-0.5 mr-2'} />
                                    Archive
                                </Button>
                            </Can>
                        )}
                        {file.isFile && (
                            <Button className={'w-full bg-white/5 border-white/10 hover:bg-white/10 text-zb-text-dim'} onClick={doDownload}>
                                <DownloadIcon className={'w-4 mt-0.5 mr-2'} />
                                Download
                            </Button>
                        )}
                        <Can action={'file.archive'}>
                            <Button className={'w-full bg-zb-danger/10 border-zb-danger/30 text-zb-danger hover:bg-zb-danger/20'} onClick={() => setShowConfirmation(true)}>
                                <TrashIcon className={'w-4 mt-0.5 mr-2'} />
                                Delete
                            </Button>
                        </Can>
                    </div>
                </Dialog>
            )}
        </>
    );
};

export default memo(FileDropdownMenu, isEqual);
