import { Link, NavLink } from 'react-router-dom';
import AdminContentBlock from '@/elements/AdminContentBlock';
import { Button } from '@/elements/button';
import { RealFilters, useGetUsers, Context as UsersContext } from '@/api/routes/admin/users';
import {
    faIdBadge,
    faLock,
    faLockOpen,
    faPlus,
    faUser,
    faUserCheck,
    faUserGear,
    faUserSlash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext } from 'react';
import AdminTable, {
    ContentWrapper,
    Loading,
    NoItems,
    Pagination,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    useTableHooks,
} from '@/elements/AdminTable';
import Pill from '@/elements/Pill';

function UsersContainer() {
    const { data: users, error, isValidating } = useGetUsers();
    const { setPage, sort, sortDirection, setSort, setFilters } = useContext(UsersContext);

    const length = users?.items?.length || 0;

    const onSearch = (query: string): Promise<void> => {
        return new Promise(resolve => {
            if (query.length < 2) {
                setFilters(null);
            } else {
                setPage(1);
                setFilters({
                    username: query,
                });
            }
            return resolve();
        });
    };

    return (
        <AdminContentBlock title={'User Accounts'}>
            <div className="w-full flex flex-col md:flex-row items-center mb-10 gap-6">
                <div className="flex flex-col flex-grow min-w-0 text-center md:text-left">
                    <h2 className="text-3xl text-neutral-50 font-semibold tracking-tight uppercase tracking-widest">User Governance</h2>
                    <p className="text-sm text-neutral-400 mt-1 opacity-70">
                        Monitor and manage authentication, permissions, and security profiles.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <Link to={'/admin/users/new'}>
                        <Button className="shadow-zb-glow-sm/20 px-8 py-2.5 h-auto font-medium flex items-center gap-2 group">
                            <FontAwesomeIcon icon={faPlus} className="group-hover:rotate-90 transition-transform duration-300" />
                            <span>Create User</span>
                        </Button>
                    </Link>
                </div>
            </div>

            <AdminTable>
                <ContentWrapper onSearch={onSearch}>
                    <Pagination data={users} onPageSelect={setPage}>
                        <div className="overflow-x-auto no-scrollbar">
                            <table className="w-full border-separate border-spacing-y-2">
                                <TableHead>
                                    <TableHeader
                                        name={'ID'}
                                        direction={sort === 'id' ? (sortDirection ? 1 : 2) : null}
                                        onClick={() => setSort('id')}
                                    />
                                    <TableHeader
                                        name={'Identity'}
                                        direction={sort === 'username' ? (sortDirection ? 1 : 2) : null}
                                        onClick={() => setSort('username')}
                                    />
                                    <TableHeader
                                        name={'Email Correspondence'}
                                        direction={sort === 'email' ? (sortDirection ? 1 : 2) : null}
                                        onClick={() => setSort('email')}
                                    />
                                    <TableHeader
                                        name={'Vulnerability Status (2FA)'}
                                        direction={sort === 'use_totp' ? (sortDirection ? 1 : 2) : null}
                                        onClick={() => setSort('use_totp')}
                                    />
                                    <TableHeader
                                        name={'Operational State'}
                                        direction={sort === 'state' ? (sortDirection ? 1 : 2) : null}
                                        onClick={() => setSort('state')}
                                    />
                                    <TableHeader
                                        name={'Access Tier'}
                                        direction={sort === 'root_admin' ? (sortDirection ? 1 : 2) : null}
                                        onClick={() => setSort('root_admin')}
                                    />
                                </TableHead>

                                <TableBody>
                                    {users !== undefined &&
                                        !error &&
                                        !isValidating &&
                                        length > 0 &&
                                        users.items.map(user => (
                                            <TableRow key={user.id} className="group bg-zb-card/30 backdrop-blur-md hover:bg-white/5 transition-all duration-300">
                                                <td className="px-6 py-4 text-sm first:rounded-l-2xl">
                                                    <code className="font-mono bg-black/40 text-zb-accent px-2 py-1 rounded-md border border-white/5 group-hover:border-zb-accent/30 transition-colors uppercase">
                                                        {user.id}
                                                    </code>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium">
                                                    <NavLink
                                                        to={`/admin/users/${user.id}`}
                                                        className="text-neutral-100 hover:text-zb-accent transition-colors duration-300"
                                                    >
                                                        {user.username}
                                                    </NavLink>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-neutral-400">
                                                    {user.email}
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    {user.isUsingTwoFactor ? (
                                                        <Pill type={'success'}>
                                                            <FontAwesomeIcon icon={faLock} className="mr-1.5" />
                                                            Secured
                                                        </Pill>
                                                    ) : (
                                                        <Pill type={'danger'}>
                                                            <FontAwesomeIcon icon={faLockOpen} className="mr-1.5" />
                                                            Vulnerable
                                                        </Pill>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    {user.state === 'suspended' ? (
                                                        <Pill type={'warn'}>
                                                            <FontAwesomeIcon icon={faUserSlash} className="mr-1.5" />
                                                            Suspended
                                                        </Pill>
                                                    ) : (
                                                        <Pill type={'success'}>
                                                            <FontAwesomeIcon icon={faUserCheck} className="mr-1.5" />
                                                            Verified
                                                        </Pill>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 last:rounded-r-2xl text-sm">
                                                    {user.isRootAdmin || user.admin_role_id ? (
                                                        <div className="flex items-center gap-2">
                                                            <Pill type={'info'}>
                                                                <FontAwesomeIcon icon={faUserGear} className="mr-1.5" />
                                                                Administrator
                                                            </Pill>
                                                            {user.admin_role_id && (
                                                                <Pill type={'unknown'}>
                                                                    <FontAwesomeIcon icon={faIdBadge} className="mr-1.5" />
                                                                    {user.roleName}
                                                                </Pill>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <Pill type={'unknown'}>
                                                            <FontAwesomeIcon icon={faUser} className="mr-1.5" />
                                                            Standard
                                                        </Pill>
                                                    )}
                                                </td>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </table>

                            {users === undefined || (error && isValidating) ? (
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
}

export default () => {
    const hooks = useTableHooks<RealFilters>();

    return (
        <UsersContext.Provider value={hooks}>
            <UsersContainer />
        </UsersContext.Provider>
    );
};
