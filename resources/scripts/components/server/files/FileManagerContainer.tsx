import { useEffect, useMemo } from 'react';

import { httpErrorToHuman } from '@/api/http';
import Spinner from '@/elements/Spinner';
import FileObjectGrid from '@server/files/FileObjectGrid';
import FileManagerBreadcrumbs from '@server/files/FileManagerBreadcrumbs';
import { type FileObject } from '@definitions/server';
import NewDirectoryButton from '@server/files/NewDirectoryButton';
import { NavLink, useLocation } from 'react-router-dom';
import Can from '@/elements/Can';
import { ServerError } from '@/elements/ScreenBlock';
import { Button } from '@/elements/button/index';
import { ServerContext } from '@/state/server';
import useFileManagerSwr from '@/plugins/useFileManagerSwr';
import FileManagerStatus from '@server/files/FileManagerStatus';
import MassActionsBar from '@server/files/MassActionsBar';
import UploadButton from '@server/files/UploadButton';
import { useStoreActions, useStoreState } from '@/state/hooks';
import ErrorBoundary from '@/elements/ErrorBoundary';
import { FileActionCheckbox } from '@server/files/SelectFileCheckbox';
import FadeTransition from '@/elements/transitions/FadeTransition';
import { usePersistedState } from '@/plugins/usePersistedState';
import { faBorderAll, faFolderPlus, faList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FileObjectList from './FileObjectList';
import CopyOnClick from '@/elements/CopyOnClick';
import Input from '@/elements/Input';
import { ip } from '@/lib/formatters';
import PageContentBlock from '@/elements/PageContentBlock';
import { hashToPath } from '@/lib/helpers';
import FileSortControls from '@server/files/FileSortControls';
import type { SortField, SortDirection } from '@/state/server/files';

const sortFiles = (files: FileObject[], sortField: SortField, sortDirection: SortDirection): FileObject[] => {
    const sorted = [...files].sort((a, b) => {
        // Always put directories first, then files
        if (a.isFile !== b.isFile) {
            return a.isFile ? 1 : -1;
        }

        let comparison = 0;

        switch (sortField) {
            case 'name':
                comparison = a.name.localeCompare(b.name);
                break;
            case 'modified':
                comparison = a.modifiedAt.getTime() - b.modifiedAt.getTime();
                break;
            case 'size':
                comparison = a.size - b.size;
                break;
            case 'type': {
                // For type, we sort by file extension
                const extA = a.isFile ? a.name.split('.').pop()?.toLowerCase() || '' : '';
                const extB = b.isFile ? b.name.split('.').pop()?.toLowerCase() || '' : '';
                comparison = extA.localeCompare(extB);
                break;
            }
        }

        return sortDirection === 'asc' ? comparison : -comparison;
    });

    // Remove duplicates
    return sorted.filter((file, index) => index === 0 || file.name !== sorted[index - 1]?.name);
};

const filterFiles = (files: FileObject[], searchTerm: string): FileObject[] => {
    if (!searchTerm.trim()) {
        return files;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    return files.filter(file => file.name.toLowerCase().includes(lowerSearchTerm));
};

export default () => {
    const id = ServerContext.useStoreState(state => state.server.data!.id);
    const { hash } = useLocation();
    const { data: files, error, mutate } = useFileManagerSwr();
    const directory = ServerContext.useStoreState(state => state.files.directory);
    const clearFlashes = useStoreActions(actions => actions.flashes.clearFlashes);
    const setDirectory = ServerContext.useStoreActions(actions => actions.files.setDirectory);
    const [gridView, setGridView] = usePersistedState<boolean>(`${id}_file_manager_view`, false);
    const sortField = ServerContext.useStoreState(state => state.files.sortField);
    const sortDirection = ServerContext.useStoreState(state => state.files.sortDirection);
    const searchTerm = ServerContext.useStoreState(state => state.files.searchTerm);
    const setSortField = ServerContext.useStoreActions(actions => actions.files.setSortField);
    const setSortDirection = ServerContext.useStoreActions(actions => actions.files.setSortDirection);
    const { colors } = useStoreState(state => state.theme.data!);
    const [persistedSortField, setPersistedSortField] = usePersistedState<SortField>(
        `${id}_file_manager_sort_field`,
        'name',
    );
    const [persistedSortDirection, setPersistedSortDirection] = usePersistedState<SortDirection>(
        `${id}_file_manager_sort_direction`,
        'asc',
    );

    const sftp = ServerContext.useStoreState(state => state.server.data!.sftpDetails);
    const username = useStoreState(state => state.user.data!.username);
    const setSelectedFiles = ServerContext.useStoreActions(actions => actions.files.setSelectedFiles);
    const selectedFilesLength = ServerContext.useStoreState(state => state.files.selectedFiles.length);

    // Initialize sort settings from persisted state on mount
    useEffect(() => {
        setSortField(persistedSortField);
        setSortDirection(persistedSortDirection);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Persist sort settings when they change
    useEffect(() => {
        setPersistedSortField(sortField);
        setPersistedSortDirection(sortDirection);
    }, [sortField, sortDirection, setPersistedSortField, setPersistedSortDirection]);

    useEffect(() => {
        clearFlashes('files');
        setSelectedFiles([]);
        setDirectory(hashToPath(hash));
    }, [hash]);

    useEffect(() => {
        void mutate();
    }, [directory]);

    const onSelectAllClick = (e: ChangeEvent<HTMLInputElement>) => {
        setSelectedFiles(e.currentTarget.checked ? files?.map(file => file.name) || [] : []);
    };

    // Memoized computation of filtered and sorted files
    const { filteredFiles, displayFiles } = useMemo(() => {
        if (!files) {
            return { filteredFiles: [], displayFiles: [] };
        }

        const filtered = filterFiles(files, searchTerm);
        const sorted = sortFiles(filtered, sortField, sortDirection);
        const display = sorted.slice(0, 250);

        return { filteredFiles: filtered, displayFiles: display };
    }, [files, searchTerm, sortField, sortDirection]);

    if (error) {
        return <ServerError message={httpErrorToHuman(error)} onRetry={() => mutate()} />;
    }

    return (
        <PageContentBlock
            title={'File Manager'}
            header
            description={'Control your files and folders via the UI.'}
            showFlashKey={'files'}
        >
            <ErrorBoundary>
                <div className={'mb-6 flex flex-wrap-reverse md:flex-nowrap items-center gap-4 bg-zb-card/30 backdrop-blur-xl border border-white/5 p-4 rounded-2xl shadow-xl'}>
                    <FileManagerBreadcrumbs
                        renderLeft={
                            <FileActionCheckbox
                                type={'checkbox'}
                                checked={selectedFilesLength === (files?.length === 0 ? -1 : files?.length)}
                                onChange={onSelectAllClick}
                            />
                        }
                    />
                    <Can action={'file.create'}>
                        <div className="flex items-center gap-2 ml-auto">
                            <FileManagerStatus />
                            <div className="h-8 w-px bg-white/10 mx-2 hidden md:block" />
                            <NewDirectoryButton />
                            <UploadButton />
                            <NavLink to={`/server/${id}/files/new${window.location.hash}`}>
                                <Button className="bg-zb-accent/10 border-zb-accent/30 text-zb-accent hover:bg-zb-accent/20">New File</Button>
                            </NavLink>
                            <Button onClick={() => setGridView(!gridView)} className="bg-white/5 border-white/10 hover:bg-white/10 text-zb-text-dim">
                                <FontAwesomeIcon icon={gridView ? faList : faBorderAll} fixedWidth />
                            </Button>
                        </div>
                    </Can>
                </div>
                <div className={'mb-6'}>
                    <FileSortControls />
                </div>
            </ErrorBoundary>
            <div className={'grid gap-6 xl:grid-cols-4'}>
                <div className={'xl:col-span-3'}>
                    {!files ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-zb-card/20 backdrop-blur-md rounded-2xl border border-white/5">
                            <Spinner size={'large'} />
                            <p className="mt-4 text-zb-muted animate-pulse">Scanning file system...</p>
                        </div>
                    ) : (
                        <div className="bg-zb-card/30 backdrop-blur-xl border border-white/5 rounded-2xl shadow-xl p-4 min-h-[400px]">
                            {!filteredFiles.length ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <p className="text-zb-muted font-medium">
                                        {searchTerm
                                            ? 'No files found matching your search.'
                                            : 'This directory seems to be empty.'}
                                    </p>
                                </div>
                            ) : (
                                <FadeTransition duration="duration-150" appear show>
                                    <div>
                                        {filteredFiles.length > 250 && (
                                            <div className="rounded-xl bg-zb-warning/10 border border-zb-warning/30 mb-4 p-4">
                                                <p className="text-zb-warning text-sm text-center font-medium">
                                                    {searchTerm
                                                        ? `Found ${filteredFiles.length} files matching your search, showing first 250.`
                                                        : 'This directory is too large to display in the browser, limiting the output to the first 250 files.'}
                                                </p>
                                            </div>
                                        )}
                                        {searchTerm && filteredFiles.length <= 250 && (
                                            <div className="rounded-xl bg-zb-accent/10 border border-zb-accent/30 mb-4 p-4">
                                                <p className="text-zb-accent text-sm text-center font-bold">
                                                    Found {filteredFiles.length}{' '}
                                                    {filteredFiles.length === 1 ? 'file' : 'files'} matching &quot;
                                                    {searchTerm}&quot;
                                                </p>
                                            </div>
                                        )}
                                        <div className="space-y-1">
                                            {gridView ? (
                                                <div className={'grid grid-cols-2 gap-4 lg:grid-cols-4 xl:grid-cols-6'}>
                                                    {displayFiles.map(file => (
                                                        <FileObjectGrid key={file.key} file={file} />
                                                    ))}
                                                </div>
                                            ) : (
                                                <>
                                                    {displayFiles.map(file => (
                                                        <FileObjectList key={file.key} file={file} />
                                                    ))}
                                                </>
                                            )}
                                        </div>
                                        <MassActionsBar />
                                    </div>
                                </FadeTransition>
                            )}
                        </div>
                    )}
                </div>
                <Can action={'file.sftp'}>
                    <div className="flex flex-col gap-y-6">
                        <div className="bg-zb-card/40 backdrop-blur-2xl border border-white/5 p-6 rounded-2xl shadow-2xl transition-all duration-300 hover:border-zb-accent/20 group">
                            <div className="flex items-center gap-x-3 mb-6">
                                <div className="p-2 rounded-lg bg-zb-accent/10 text-zb-accent group-hover:shadow-zb-glow-sm transition-all duration-300">
                                    <FontAwesomeIcon icon={faFolderPlus} />
                                </div>
                                <h3 className="font-bold text-zb-text tracking-tight">SFTP Details</h3>
                            </div>
                            
                            <div className="space-y-6">
                                <div>
                                    <Label className="text-[10px] uppercase tracking-widest text-zb-muted font-bold mb-2 block">Server Address</Label>
                                    <CopyOnClick text={`sftp://${ip(sftp.ip)}:${sftp.port}`}>
                                        <div className="relative group/input">
                                            <input 
                                                type="text" 
                                                value={`sftp://${ip(sftp.ip)}:${sftp.port}`} 
                                                readOnly 
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-zb-text-dim font-mono text-xs focus:ring-0 focus:border-zb-accent/50 transition-all duration-300"
                                            />
                                        </div>
                                    </CopyOnClick>
                                </div>
                                
                                <div>
                                    <Label className="text-[10px] uppercase tracking-widest text-zb-muted font-bold mb-2 block">Username</Label>
                                    <CopyOnClick text={`${username}.${id}`}>
                                        <div className="relative group/input">
                                            <input 
                                                type="text" 
                                                value={`${username}.${id}`} 
                                                readOnly 
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-zb-text-dim font-mono text-xs focus:ring-0 focus:border-zb-accent/50 transition-all duration-300"
                                            />
                                        </div>
                                    </CopyOnClick>
                                </div>

                                <div className="bg-zb-accent/5 border-l-4 border-zb-accent p-4 rounded-r-xl">
                                    <p className="text-[11px] text-zb-text-dim leading-relaxed">
                                        Your SFTP password is the same as the password you use to access this panel.
                                    </p>
                                </div>

                                <a 
                                    href={`sftp://${username}.${id}@${ip(sftp.ip)}:${sftp.port}`}
                                    className="block"
                                >
                                    <Button className="w-full bg-zb-accent text-black font-bold py-3 rounded-xl shadow-zb-glow-sm hover:shadow-zb-glow-md transition-all duration-300">
                                        Launch SFTP
                                    </Button>
                                </a>
                            </div>
                        </div>
                    </div>
                </Can>
            </div>
        </PageContentBlock>
    );
};
