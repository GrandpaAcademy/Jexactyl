import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faFileArchive, faFileImport, faFolder } from '@fortawesome/free-solid-svg-icons';
import { differenceInHours, format, formatDistanceToNow } from 'date-fns';
import { memo, ReactNode } from 'react';
import FileDropdownMenu from '@server/files/FileDropdownMenu';
import { ServerContext } from '@/state/server';
import { NavLink } from 'react-router-dom';
import isEqual from 'react-fast-compare';
import SelectFileCheckbox from '@server/files/SelectFileCheckbox';
import { usePermissions } from '@/plugins/usePermissions';
import { join } from 'pathe';
import { bytesToString } from '@/lib/formatters';
import { FileObject } from '@definitions/server';
import classNames from 'classnames';
import { encodePathSegments } from '@/lib/helpers';

function Clickable({ file, children }: { file: FileObject; children: ReactNode }) {
    const [canRead] = usePermissions(['file.read']);
    const [canReadContents] = usePermissions(['file.read-content']);
    const id = ServerContext.useStoreState(state => state.server.data!.id);
    const directory = ServerContext.useStoreState(state => state.files.directory);

    return (file.isFile && (!file.isEditable() || !canReadContents)) || (!file.isFile && !canRead) ? (
        <div className="flex flex-1 items-center overflow-hidden px-4 py-3">{children}</div>
    ) : (
        <NavLink
            className="flex flex-1 items-center overflow-hidden px-4 py-3 no-underline transition-all duration-300 group-hover:bg-white/5"
            to={`/server/${id}/files${file.isFile ? '/edit' : '#'}${encodePathSegments(join(directory, file.name))}`}
        >
            {children}
        </NavLink>
    );
}

const FileObjectRow = ({ file }: { file: FileObject }) => {
    return (
        <div
            className="group relative flex items-center bg-white/[0.02] border border-white/5 rounded-xl mb-1 transition-all duration-300 hover:border-zb-accent/30 hover:shadow-zb-glow-sm/10 overflow-hidden"
            key={file.name}
            onContextMenu={e => {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent(`pterodactyl:files:ctx:${file.key}`, { detail: e.clientX }));
            }}
        >
            <div className="pl-4">
                <SelectFileCheckbox name={file.name} />
            </div>
            
            <Clickable file={file}>
                <div className="flex-none ml-2 mr-4 text-lg w-10 flex justify-center">
                    {file.isFile ? (
                        <FontAwesomeIcon
                            icon={file.isSymlink ? faFileImport : file.isArchiveType() ? faFileArchive : faFileAlt}
                            className={classNames(file.isArchiveType() ? 'text-zb-warning' : 'text-zb-text-dim/60')}
                        />
                    ) : (
                        <FontAwesomeIcon icon={faFolder} className="text-zb-accent" />
                    )}
                </div>
                
                <div className="flex-1 truncate font-medium text-zb-text-dim group-hover:text-zb-text transition-colors duration-300">
                    {file.name}
                </div>
                
                {file.isFile && (
                    <div className="w-1/6 text-right mr-4 hidden sm:block text-xs font-mono text-zb-muted/60 lowercase tracking-tighter">
                        {bytesToString(file.size)}
                    </div>
                )}
                
                <div 
                    className="w-1/4 text-right mr-6 hidden md:block text-[10px] font-bold uppercase tracking-widest text-zb-muted/40" 
                    title={file.modifiedAt.toString()}
                >
                    {Math.abs(differenceInHours(file.modifiedAt, new Date())) > 48
                        ? format(file.modifiedAt, 'MMM do, h:mma')
                        : formatDistanceToNow(file.modifiedAt, { addSuffix: true })}
                </div>
            </Clickable>
            
            <div className="pr-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <FileDropdownMenu file={file} />
            </div>
        </div>
    );
};
export default memo(FileObjectRow, (prevProps, nextProps) => {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const { isArchiveType, isEditable, ...prevFile } = prevProps.file;
    const { isArchiveType: nextIsArchiveType, isEditable: nextIsEditable, ...nextFile } = nextProps.file;
    /* eslint-enable @typescript-eslint/no-unused-vars */

    return isEqual(prevFile, nextFile);
});
