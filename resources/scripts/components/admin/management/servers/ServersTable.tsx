import { useContext, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import type { Filters } from '@/api/routes/admin/servers/getServers';
import getServers, { Context as ServersContext } from '@/api/routes/admin/servers/getServers';
import AdminTable, {
    ContentWrapper,
    Loading,
    NoItems,
    Pagination,
    TableBody,
    TableHead,
    TableHeader,
    useTableHooks,
} from '@/elements/AdminTable';
import CopyOnClick from '@/elements/CopyOnClick';
import useFlash from '@/plugins/useFlash';

interface Props {
    filters?: Filters;
}

function ServersTable({ filters }: Props) {
    const { clearFlashes, clearAndAddHttpError } = useFlash();

    const { setPage, setFilters, sort, setSort, sortDirection } = useContext(ServersContext);
    const { data: servers, error, isValidating } = getServers(['node', 'user']);

    const length = servers?.items?.length || 0;

    const onSearch = (query: string): Promise<void> => {
        return new Promise(resolve => {
            if (query.length < 2) {
                setFilters(filters || null);
            } else {
                setFilters({ ...filters, name: query });
            }
            return resolve();
        });
    };

    useEffect(() => {
        if (!error) {
            clearFlashes('servers');
            return;
        }

        clearAndAddHttpError({ key: 'servers', error });
    }, [error]);

    return (
        <AdminTable>
            <ContentWrapper onSearch={onSearch}>
                <Pagination data={servers} onPageSelect={setPage}>
                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full border-separate border-spacing-y-2">
                            <TableHead>
                                <TableHeader
                                    name={'Identifier'}
                                    direction={sort === 'uuidShort' ? (sortDirection ? 1 : 2) : null}
                                    onClick={() => setSort('uuidShort')}
                                />
                                <TableHeader
                                    name={'Name'}
                                    direction={sort === 'name' ? (sortDirection ? 1 : 2) : null}
                                    onClick={() => setSort('name')}
                                />
                                <TableHeader
                                    name={'Owner'}
                                    direction={sort === 'owner_id' ? (sortDirection ? 1 : 2) : null}
                                    onClick={() => setSort('owner_id')}
                                />
                                <TableHeader
                                    name={'Node'}
                                    direction={sort === 'node_id' ? (sortDirection ? 1 : 2) : null}
                                    onClick={() => setSort('node_id')}
                                />
                                <TableHeader
                                    name={'Status'}
                                    direction={sort === 'status' ? (sortDirection ? 1 : 2) : null}
                                    onClick={() => setSort('status')}
                                />
                            </TableHead>

                            <TableBody>
                                {servers !== undefined &&
                                    !error &&
                                    !isValidating &&
                                    length > 0 &&
                                    servers.items.map(server => (
                                        <tr key={server.id} className="group bg-zb-card/30 backdrop-blur-md hover:bg-white/5 transition-all duration-300">
                                            <td className="px-6 py-4 text-sm first:rounded-l-2xl">
                                                <CopyOnClick text={server.identifier}>
                                                    <code className="font-mono bg-black/40 text-zb-accent px-2 py-1 rounded-md border border-white/5 group-hover:border-zb-accent/30 transition-colors">
                                                        {server.identifier}
                                                    </code>
                                                </CopyOnClick>
                                            </td>

                                            <td className="px-6 py-4 text-sm font-medium">
                                                <NavLink
                                                    to={`/admin/servers/${server.id}`}
                                                    className="text-neutral-100 hover:text-zb-accent transition-colors duration-300"
                                                >
                                                    {server.name}
                                                </NavLink>
                                            </td>

                                            <td className="px-6 py-4">
                                                <NavLink to={`/admin/users/${server.relations.user?.id}`} className="group/user block">
                                                    <div className="text-sm text-neutral-200 group-hover/user:text-zb-accent transition-colors">
                                                        {server.relations.user?.email}
                                                    </div>
                                                    <div className="text-[10px] text-neutral-500 uppercase tracking-wider mt-0.5">
                                                        {server.relations.user?.uuid.split('-')[0]}
                                                    </div>
                                                </NavLink>
                                            </td>

                                            <td className="px-6 py-4">
                                                <NavLink to={`/admin/nodes/${server.relations.node?.id}`} className="group/node block">
                                                    <div className="text-sm text-neutral-200 group-hover/node:text-zb-accent transition-colors">
                                                        {server.relations.node?.name}
                                                    </div>
                                                    <div className="text-[10px] text-neutral-500 uppercase tracking-wider mt-0.5">
                                                        {server.relations.node?.fqdn}
                                                    </div>
                                                </NavLink>
                                            </td>

                                            <td className="px-6 py-4 last:rounded-r-2xl">
                                                {server.status === 'installing' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 shadow-[0_0_12px_-3px_rgba(250,204,21,0.3)]">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                                                        Installing
                                                    </span>
                                                ) : server.status === 'transferring' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zb-accent-2/10 text-purple-400 border border-purple-400/20 shadow-[0_0_12px_-3px_rgba(124,58,237,0.3)]">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                                                        Transferring
                                                    </span>
                                                ) : server.status === 'suspended' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zb-danger/10 text-zb-danger border border-zb-danger/20 shadow-[0_0_12px_-3px_rgba(239,68,68,0.3)]">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-zb-danger animate-ping" />
                                                        Suspended
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zb-success/10 text-zb-success border border-zb-success/20 shadow-[0_0_12px_-3px_rgba(16,185,129,0.3)]">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-zb-success" />
                                                        Active
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                            </TableBody>
                        </table>

                        {servers === undefined || (error && isValidating) ? (
                            <Loading />
                        ) : length < 1 ? (
                            <NoItems />
                        ) : null}
                    </div>
                </Pagination>
            </ContentWrapper>
        </AdminTable>
    );
}

export default ({ filters }: Props) => {
    const hooks = useTableHooks<Filters>(filters);

    return (
        <ServersContext.Provider value={hooks}>
            <ServersTable />
        </ServersContext.Provider>
    );
};
