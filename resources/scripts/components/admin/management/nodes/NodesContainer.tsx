import { useContext, useEffect, useState } from 'react';
import type { Filters } from '@/api/routes/admin/servers/getServers';
import getNodes, { Context as NodesContext } from '@/api/routes/admin/nodes/getNodes';
import FlashMessageRender from '@/elements/FlashMessageRender';
import useFlash from '@/plugins/useFlash';
import { NavLink } from 'react-router-dom';
import AdminContentBlock from '@/elements/AdminContentBlock';
import AdminTable, {
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    Pagination,
    Loading,
    NoItems,
    ContentWrapper,
    useTableHooks,
} from '@/elements/AdminTable';
import { Button } from '@/elements/button';
import CopyOnClick from '@/elements/CopyOnClick';
import { bytesToString, mbToBytes } from '@/lib/formatters';
import { Dialog } from '@/elements/dialog';
import NewNodeContainer from './NewNodeContainer';

const NodesContainer = () => {
    const { setPage, setFilters, sort, setSort, sortDirection } = useContext(NodesContext);
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const { data: nodes, error, isValidating } = getNodes();
    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        if (!error) {
            clearFlashes('nodes');
            return;
        }

        clearAndAddHttpError({ key: 'nodes', error });
    }, [error]);

    const length = nodes?.items?.length || 0;

    const onSearch = (query: string): Promise<void> => {
        return new Promise(resolve => {
            if (query.length < 2) {
                setFilters(null);
            } else {
                setFilters({ name: query });
            }
            return resolve();
        });
    };

    return (
        <AdminContentBlock title={'Nodes'}>
            <Dialog title={'Provision New Infrastructure'} open={open} onClose={() => setOpen(false)} size={'xl'}>
                <NewNodeContainer />
            </Dialog>

            <div className="w-full flex flex-col md:flex-row items-center mb-10 gap-6">
                <div className="flex flex-col flex-grow min-w-0 text-center md:text-left">
                    <h2 className="text-3xl text-neutral-50 font-semibold tracking-tight uppercase">Nodes</h2>
                    <p className="text-sm text-neutral-400 mt-1 opacity-70">
                        Manage and scale your computing resources across global regions.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <Button 
                        type={'button'} 
                        className="shadow-zb-glow-sm/20 px-8 py-2.5 h-auto font-medium" 
                        onClick={() => setOpen(true)}
                    >
                        Provision Node
                    </Button>
                </div>
            </div>

            <FlashMessageRender byKey={'nodes'} className="mb-6" />

            <AdminTable>
                <ContentWrapper onSearch={onSearch}>
                    <Pagination data={nodes} onPageSelect={setPage}>
                        <div className="overflow-x-auto no-scrollbar">
                            <table className="w-full border-separate border-spacing-y-2">
                                <TableHead>
                                    <TableHeader
                                        name={'ID'}
                                        direction={sort === 'id' ? (sortDirection ? 1 : 2) : null}
                                        onClick={() => setSort('id')}
                                    />
                                    <TableHeader
                                        name={'Name'}
                                        direction={sort === 'name' ? (sortDirection ? 1 : 2) : null}
                                        onClick={() => setSort('name')}
                                    />
                                    <TableHeader
                                        name={'FQDN'}
                                        direction={sort === 'fqdn' ? (sortDirection ? 1 : 2) : null}
                                        onClick={() => setSort('fqdn')}
                                    />
                                    <TableHeader
                                        name={'Memory Capability'}
                                        direction={sort === 'memory' ? (sortDirection ? 1 : 2) : null}
                                        onClick={() => setSort('memory')}
                                    />
                                    <TableHeader
                                        name={'Disk Capability'}
                                        direction={sort === 'disk' ? (sortDirection ? 1 : 2) : null}
                                        onClick={() => setSort('disk')}
                                    />
                                    <TableHeader />
                                </TableHead>

                                <TableBody>
                                    {nodes !== undefined &&
                                        !error &&
                                        !isValidating &&
                                        length > 0 &&
                                        nodes.items.map(node => (
                                            <TableRow key={node.id} className="group bg-zb-card/30 backdrop-blur-md hover:bg-white/5 transition-all duration-300">
                                                <td className="px-6 py-4 text-sm first:rounded-l-2xl">
                                                    <CopyOnClick text={node.id.toString()}>
                                                        <code className="font-mono bg-black/40 text-zb-accent px-2 py-1 rounded-md border border-white/5 group-hover:border-zb-accent/30 transition-colors">
                                                            {node.id}
                                                        </code>
                                                    </CopyOnClick>
                                                </td>

                                                <td className="px-6 py-4 text-sm font-medium">
                                                    <NavLink
                                                        to={`/admin/nodes/${node.id}`}
                                                        className="text-neutral-100 hover:text-zb-accent transition-colors duration-300"
                                                    >
                                                        {node.name}
                                                    </NavLink>
                                                </td>

                                                <td className="px-6 py-4 text-sm">
                                                    <CopyOnClick text={node.fqdn}>
                                                        <span className="text-neutral-400 group-hover:text-neutral-200 transition-colors">
                                                            {node.fqdn}
                                                        </span>
                                                    </CopyOnClick>
                                                </td>

                                                <td className="px-6 py-4 text-sm text-neutral-300 tabular-nums uppercase tracking-tighter">
                                                    {bytesToString(mbToBytes(node.memory))}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-neutral-300 tabular-nums uppercase tracking-tighter">
                                                    {bytesToString(mbToBytes(node.disk))}
                                                </td>

                                                <td className="px-6 py-4 last:rounded-r-2xl text-right">
                                                    {node.scheme === 'https' ? (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zb-success/10 text-zb-success border border-zb-success/20 shadow-[0_0_12px_-3px_rgba(16,185,129,0.3)]">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-zb-success" />
                                                            Secure Connection
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zb-danger/10 text-zb-danger border border-zb-danger/20 shadow-[0_0_12px_-3px_rgba(239,68,68,0.3)]">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-zb-danger animate-pulse" />
                                                            Unencrypted
                                                        </span>
                                                    )}
                                                </td>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </table>

                            {nodes === undefined || (error && isValidating) ? (
                                <Loading />
                            ) : length < 1 ? (
                                <NoItems />
                            ) : null}
                        </div>
                    </Pagination>
                </ContentWrapper>
            </AdminTable>
        </AdminContentBlock>
    );
};

export default () => {
    const hooks = useTableHooks<Filters>();

    return (
        <NodesContext.Provider value={hooks}>
            <NodesContainer />
        </NodesContext.Provider>
    );
};
