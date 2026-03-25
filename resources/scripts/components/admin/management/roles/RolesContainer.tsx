import { useContext, useEffect } from 'react';
import { getRoles, Context as RolesContext, Filters } from '@/api/routes/admin/roles';
import { AdminContext } from '@/state/admin';
import NewRoleButton from '@/components/admin/management/roles/NewRoleButton';
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
import CopyOnClick from '@/elements/CopyOnClick';

const RolesContainer = () => {
    const { setPage, setFilters, sort, setSort, sortDirection } = useContext(RolesContext);
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const { data: roles, error, isValidating } = getRoles();

    useEffect(() => {
        if (!error) {
            clearFlashes('roles');
            return;
        }

        clearAndAddHttpError({ key: 'roles', error });
    }, [error]);

    const length = roles?.items?.length || 0;

    const setSelectedRoles = AdminContext.useStoreActions(actions => actions.roles.setSelectedRoles);

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

    useEffect(() => {
        setSelectedRoles([]);
    }, [roles?.pagination.currentPage]);

    return (
        <AdminContentBlock title={'Roles'}>
            <div className="w-full flex flex-col md:flex-row items-center mb-10 gap-6">
                <div className="flex flex-col flex-grow min-w-0 text-center md:text-left">
                    <h2 className="text-3xl text-neutral-50 font-semibold tracking-tight uppercase tracking-widest">Administrator Roles</h2>
                    <p className="text-sm text-neutral-400 mt-1 opacity-70">
                        Define administrative permission tiers for governance and security control.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <NewRoleButton />
                </div>
            </div>

            <FlashMessageRender byKey={'roles'} className="mb-6 rounded-2xl overflow-hidden shadow-lg border border-white/5" />

            <AdminTable>
                <ContentWrapper onSearch={onSearch}>
                    <Pagination data={roles} onPageSelect={setPage}>
                        <div className="overflow-x-auto no-scrollbar">
                            <table className="w-full border-separate border-spacing-y-2">
                                <TableHead>
                                    <TableHeader
                                        name={'ID'}
                                        direction={sort === 'id' ? (sortDirection ? 1 : 2) : null}
                                        onClick={() => setSort('id')}
                                    />
                                    <TableHeader
                                        name={'Permission Tier'}
                                        direction={sort === 'name' ? (sortDirection ? 1 : 2) : null}
                                        onClick={() => setSort('name')}
                                    />
                                    <TableHeader name={'Description'} />
                                    <TableHeader name={'Entitlements'} />
                                </TableHead>

                                <TableBody>
                                    {roles !== undefined &&
                                        !error &&
                                        !isValidating &&
                                        length > 0 &&
                                        roles.items.map(role => (
                                            <TableRow key={role.id} className="group bg-zb-card/30 backdrop-blur-md hover:bg-white/5 transition-all duration-300">
                                                <td className="px-6 py-4 text-sm first:rounded-l-2xl">
                                                    <CopyOnClick text={role.id.toString()}>
                                                        <code className="font-mono bg-black/40 text-zb-accent px-2 py-1 rounded-md border border-white/5 group-hover:border-zb-accent/30 transition-colors uppercase">
                                                            {role.id}
                                                        </code>
                                                    </CopyOnClick>
                                                </td>

                                                <td className="px-6 py-4 text-sm font-medium">
                                                    <NavLink
                                                        to={`${window.location.pathname}/${role.id}`}
                                                        style={{ color: role.color ?? '#00f2ff' }}
                                                        className="hover:brightness-125 transition-all duration-300 flex items-center gap-2"
                                                    >
                                                        <div 
                                                            className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,242,255,0.5)]" 
                                                            style={{ backgroundColor: role.color ?? '#00f2ff', boxShadow: `0 0 10px ${role.color ?? '#00f2ff'}40` }}
                                                        />
                                                        {role.name}
                                                    </NavLink>
                                                </td>

                                                <td className="px-6 py-4 text-sm text-neutral-400">
                                                    {role.description}
                                                </td>
                                                <td className="px-6 py-4 last:rounded-r-2xl text-sm">
                                                    <code className="font-mono bg-white/5 text-neutral-300 px-2 py-1 rounded-md border border-white/5">
                                                        {role.permissions.length} nodes
                                                    </code>
                                                </td>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </table>

                            {roles === undefined || (error && isValidating) ? (
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
        <RolesContext.Provider value={hooks}>
            <RolesContainer />
        </RolesContext.Provider>
    );
};
