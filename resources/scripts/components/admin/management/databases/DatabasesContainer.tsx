import type { Filters } from '@/api/routes/admin/databases/getDatabases';
import { Context as DatabasesContext } from '@/api/routes/admin/databases/getDatabases';
import { useTableHooks } from '@/elements/AdminTable';
import DatabasesTable from './DatabasesTable';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/elements/button';
import { PlusIcon } from '@heroicons/react/outline';
import AdminContentBlock from '@/elements/AdminContentBlock';
import { Dialog } from '@/elements/dialog';
import { useState } from 'react';
import createDatabase from '@/api/routes/admin/databases/createDatabase';
import { useStoreActions } from '@/state/hooks';
import { InformationContainer, Values } from '@admin/management/databases/DatabaseEditContainer';
import { FormikHelpers } from 'formik';

interface Props {
    filters?: Filters;
}

export default ({ filters }: Props) => {
    const navigate = useNavigate();
    const hooks = useTableHooks<Filters>(filters);

    const [open, setOpen] = useState<boolean>(false);
    const { clearFlashes, clearAndAddHttpError } = useStoreActions(actions => actions.flashes);

    const submit = ({ name, host, port, username, password }: Values, { setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes('admin:databases');

        createDatabase(name, host, port, username, password)
            .then(database => navigate(`/admin/databases/${database.id}`))
            .catch(error => clearAndAddHttpError({ key: 'admin:databases', error }))
            .finally(() => setSubmitting(false));
    };

    return (
        <AdminContentBlock title={'Database Hosts'}>
            <Dialog title={'Provision New Database Infrastructure'} open={open} onClose={() => setOpen(false)} size={'lg'}>
                <InformationContainer title={'Information'} onSubmit={submit} />
            </Dialog>

            <div className="w-full flex flex-col md:flex-row items-center mb-10 gap-6">
                <div className="flex flex-col flex-grow min-w-0 text-center md:text-left">
                    <h2 className="text-3xl text-neutral-50 font-semibold tracking-tight uppercase tracking-widest">Database Hosts</h2>
                    <p className="text-sm text-neutral-400 mt-1 opacity-70">
                        Configure and manage remote database environments linked to your infrastructure.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        onClick={() => setOpen(true)}
                        className="shadow-zb-glow-sm/20 px-8 py-2.5 h-auto font-medium flex items-center gap-2 group"
                    >
                        <PlusIcon className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                        <span>Provision Host</span>
                    </Button>
                </div>
            </div>

            <DatabasesContext.Provider value={hooks}>
                <DatabasesTable />
            </DatabasesContext.Provider>
        </AdminContentBlock>
    );
};
