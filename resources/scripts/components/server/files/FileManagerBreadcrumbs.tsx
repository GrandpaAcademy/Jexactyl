import { Fragment, useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';

import { ServerContext } from '@/state/server';
import { encodePathSegments } from '@/lib/helpers';

interface Props {
    renderLeft?: JSX.Element;
    withinFileEditor?: boolean;
    isNewFile?: boolean;
}

export default ({ renderLeft, withinFileEditor, isNewFile }: Props) => {
    const id = ServerContext.useStoreState(state => state.server.data!.id);
    const directory = ServerContext.useStoreState(state => state.files.directory);

    const params = useParams<'*'>();

    const [file, setFile] = useState<string>();

    useEffect(() => {
        if (!withinFileEditor || isNewFile) {
            return;
        }

        if (withinFileEditor && params['*'] !== undefined && !isNewFile) {
            setFile(decodeURIComponent(params['*']).split('/').pop());
        }
    }, [withinFileEditor, isNewFile]);

    const breadcrumbs = (): { name: string; path?: string }[] => {
        if (directory === '.') {
            return [];
        }

        return directory
            .split('/')
            .filter(directory => !!directory)
            .map((directory, index, dirs) => {
                if (!withinFileEditor && index === dirs.length - 1) {
                    return { name: directory };
                }

                return { name: directory, path: `/${dirs.slice(0, index + 1).join('/')}` };
            });
    };

    return (
        <div className="flex flex-grow items-center text-sm overflow-x-auto no-scrollbar py-2">
            <div className="flex items-center gap-x-2">
                {renderLeft}
                <NavLink
                    to={`/server/${id}/files`}
                    className="flex items-center gap-x-2 px-3 py-1.5 rounded-lg bg-zb-card/40 backdrop-blur-md border border-white/5 text-zb-text-dim no-underline hover:text-zb-accent hover:border-zb-accent/30 transition-all duration-300"
                >
                    <span className="text-zb-accent/60">root</span>
                </NavLink>
                {directory !== '.' && <span className="text-zb-muted/40">/</span>}
            </div>
            <div className="flex items-center gap-x-2 ml-2">
                {breadcrumbs().map((crumb, index) => (
                    <Fragment key={index}>
                        {crumb.path ? (
                            <NavLink
                                to={`/server/${id}/files#${encodePathSegments(crumb.path)}`}
                                className="px-3 py-1.5 rounded-lg bg-zb-card/40 backdrop-blur-md border border-white/5 text-zb-text-dim no-underline hover:text-zb-accent hover:border-zb-accent/30 transition-all duration-300 whitespace-nowrap"
                                end
                            >
                                {crumb.name}
                            </NavLink>
                        ) : (
                            <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-zb-text whitespace-nowrap font-bold shadow-zb-glow-sm/10">
                                {crumb.name}
                            </span>
                        )}
                        {index < breadcrumbs().length - 1 && <span className="text-zb-muted/40">/</span>}
                    </Fragment>
                ))}
                {file && (
                    <>
                        <span className="text-zb-muted/40">/</span>
                        <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-zb-text whitespace-nowrap font-bold shadow-zb-glow-sm/10">
                            {file}
                        </span>
                    </>
                )}
            </div>
        </div>
    );
};
