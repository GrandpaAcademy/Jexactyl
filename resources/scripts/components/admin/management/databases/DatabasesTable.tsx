import getDatabases from '@/api/routes/admin/databases/getDatabases';
import AdminTable, {
    ContentWrapper,
    Pagination,
    TableHead,
    TableHeader,
    TableBody,
    TableRow,
    Loading,
    NoItems,
} from '@/elements/AdminTable';
import CopyOnClick from '@/elements/CopyOnClick';
import useFlash from '@/plugins/useFlash';
import { useContext, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Context as DatabasesContext } from '@/api/routes/admin/databases/getDatabases';
import DatabaseStatus from './DatabaseStatus';

export default () => {
    const { setPage, setFilters, sort, setSort, sortDirection } = useContext(DatabasesContext);
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const { data: databases, error, isValidating } = getDatabases();

    useEffect(() => {
        if (!error) {
            clearFlashes('databases');
            return;
        }

        clearAndAddHttpError({ key: 'databases', error });
    }, [error]);

    const length = databases?.items?.length || 0;

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
        <AdminTable>
            <ContentWrapper onSearch={onSearch}>
                <Pagination data={databases} onPageSelect={setPage}>
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
                                <TableHeader name={'Remote Address'} />
                                <TableHeader name={'Administrative User'} />
                                <TableHeader name={'Connectivity Status'} />
                            </TableHead>

                            <TableBody>
                                {databases !== undefined &&
                                    !error &&
                                    !isValidating &&
                                    length > 0 &&
                                    databases.items.map(database => (
                                        <TableRow key={database.id} className="group bg-zb-card/30 backdrop-blur-md hover:bg-white/5 transition-all duration-300">
                                            <td className="px-6 py-4 text-sm first:rounded-l-2xl">
                                                <CopyOnClick text={database.id.toString()}>
                                                    <code className="font-mono bg-black/40 text-zb-accent px-2 py-1 rounded-md border border-white/5 group-hover:border-zb-accent/30 transition-colors uppercase">
                                                        {database.id}
                                                    </code>
                                                </CopyOnClick>
                                            </td>

                                            <td className="px-6 py-4 text-sm font-medium">
                                                <NavLink
                                                    to={`/admin/databases/${database.id}`}
                                                    className="text-neutral-100 hover:text-zb-accent transition-colors duration-300"
                                                >
                                                    {database.name}
                                                </NavLink>
                                            </td>

                                            <td className="px-6 py-4 text-sm">
                                                <CopyOnClick text={database.getAddress()}>
                                                    <code className="font-mono bg-black/40 text-neutral-400 group-hover:text-zb-accent px-2 py-1 rounded-md border border-white/5 transition-colors">
                                                        {database.getAddress()}
                                                    </code>
                                                </CopyOnClick>
                                            </td>

                                            <td className="px-6 py-4 text-sm text-neutral-400">
                                                {database.username}
                                            </td>
                                            <td className="px-6 py-4 last:rounded-r-2xl">
                                                <DatabaseStatus database={database.getAddress()} />
                                            </td>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </table>

                        {databases === undefined || (error && isValidating) ? (
                            <Loading />
                        ) : length < 1 ? (
                            <NoItems />
                        ) : null}
                    </div>
                </Pagination>
            </ContentWrapper>
        </AdminTable>
    );
};
