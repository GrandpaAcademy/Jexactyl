import { action, Action, Actions, createContextStore, useStoreActions } from 'easy-peasy';
import { Form, Formik, FormikHelpers } from 'formik';
import { useEffect, useState } from 'react';
import { object, string } from 'yup';
import { getRole, updateRole } from '@/api/routes/admin/roles';
import FlashMessageRender from '@/elements/FlashMessageRender';
import AdminBox from '@/elements/AdminBox';
import AdminContentBlock from '@/elements/AdminContentBlock';
import RoleDeleteButton from '@/components/admin/management/roles/RoleDeleteButton';
import { Button } from '@/elements/button';
import Field from '@/elements/Field';
import Spinner from '@/elements/Spinner';
import SpinnerOverlay from '@/elements/SpinnerOverlay';
import { ApplicationStore } from '@/state';
import { UserRole } from '@definitions/admin';
import { useNavigate, useParams } from 'react-router-dom';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import PermissionsTable from './PermissionsTable';

interface ctx {
    role: UserRole | undefined;
    setRole: Action<ctx, UserRole | undefined>;
}

export const Context = createContextStore<ctx>({
    role: undefined,

    setRole: action((state, payload) => {
        state.role = payload;
    }),
});

interface Values {
    name: string;
    description: string;
    color: string;
}

const EditInformationContainer = () => {
    const navigate = useNavigate();

    const { clearFlashes, clearAndAddHttpError } = useStoreActions(
        (actions: Actions<ApplicationStore>) => actions.flashes,
    );

    const role = Context.useStoreState(state => state.role);
    const setRole = Context.useStoreActions(actions => actions.setRole);

    if (role === undefined) {
        return <></>;
    }

    const submit = ({ name, description, color }: Values, { setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes('role');

        updateRole(role.id, name, description, color)
            .then(() => setRole({ ...role, name, description, color }))
            .catch(error => {
                console.error(error);
                clearAndAddHttpError({ key: 'role', error });
            })
            .then(() => setSubmitting(false));
    };

    return (
        <Formik
            onSubmit={submit}
            initialValues={{
                name: role.name,
                description: role.description || '',
                color: role.color || '',
            }}
            validationSchema={object().shape({
                name: string().required().min(1),
                description: string().max(255, ''),
                color: string().nullable(),
            })}
        >
            {({ isSubmitting, isValid }) => (
                <div className="relative mb-6">
                    <AdminBox title={'Edit Role'} className="bg-zb-card/30 backdrop-blur-md border-white/5 shadow-xl rounded-2xl" icon={faPencil}>
                        <SpinnerOverlay visible={isSubmitting} />

                        <Form className="m-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Field id={'name'} name={'name'} label={'Name'} type={'text'} />
                                <Field id={'color'} type={'color'} name={'color'} label={'Identity Color'} />
                            </div>

                            <div className="mt-6">
                                <Field id={'description'} name={'description'} label={'Description'} type={'text'} />
                            </div>

                            <div className="w-full flex flex-row items-center mt-10 p-4 bg-white/5 rounded-xl border border-white/5">
                                <div className="flex">
                                    <RoleDeleteButton roleId={role.id} onDeleted={() => navigate('/admin/roles')} />
                                </div>

                                <div className="ml-auto">
                                    <Button type={'submit'} disabled={isSubmitting || !isValid} className="shadow-zb-glow-sm/20 px-8">
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    </AdminBox>
                </div>
            )}
        </Formik>
    );
};

const RoleEditContainer = () => {
    const params = useParams<'id'>();

    const { clearFlashes, clearAndAddHttpError } = useStoreActions(
        (actions: Actions<ApplicationStore>) => actions.flashes,
    );
    const [loading, setLoading] = useState(true);

    const role = Context.useStoreState(state => state.role);
    const setRole = Context.useStoreActions(actions => actions.setRole);

    useEffect(() => {
        clearFlashes('role');

        getRole(Number(params?.id))
            .then(role => setRole(role))
            .catch(error => {
                console.error(error);
                clearAndAddHttpError({ key: 'role', error });
            })
            .then(() => setLoading(false));
    }, []);

    if (loading || role === undefined) {
        return (
            <AdminContentBlock>
                <FlashMessageRender byKey={'role'} className="mb-4" />

                <div className="w-full flex flex-col items-center justify-center h-96">
                    <Spinner size={'base'} />
                </div>
            </AdminContentBlock>
        );
    }

    return (
        <AdminContentBlock title={'Role - ' + role.name}>
            <div className="w-full flex flex-col md:flex-row items-center mb-10 gap-6">
                <div className="flex flex-col flex-grow min-w-0 text-center md:text-left">
                    <div className="flex items-center gap-3 justify-center md:justify-start">
                        <div 
                            className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,242,255,0.5)]" 
                            style={{ backgroundColor: role.color ?? '#00f2ff', boxShadow: `0 0 15px ${role.color ?? '#00f2ff'}60` }}
                        />
                        <h2
                            className="text-4xl text-neutral-50 font-semibold tracking-tight uppercase tracking-widest"
                            style={{ color: role.color ?? 'white' }}
                        >
                            {role.name}
                        </h2>
                    </div>
                    {+(role.description || '').length < 1 ? (
                        <p className="text-sm text-neutral-400 mt-1 italic opacity-50">
                            No description provided for this tier.
                        </p>
                    ) : (
                        <p className="text-sm text-neutral-400 mt-1 opacity-70 max-w-2xl">
                            {role.description}
                        </p>
                    )}
                </div>
            </div>

            <FlashMessageRender byKey={'role'} className="mb-6 rounded-2xl overflow-hidden shadow-lg border border-white/5" />
            
            <EditInformationContainer />

            <div className="w-full flex flex-col md:flex-row items-center my-10 gap-6">
                <div className="flex flex-col flex-grow min-w-0 text-center md:text-left border-l-2 border-zb-accent pl-6">
                    <h2 className="text-2xl text-neutral-50 font-semibold tracking-tight uppercase tracking-widest">Role Permissions</h2>
                    <p className="text-sm text-neutral-400 mt-1 opacity-70">
                        Manage granular access controls and entitlement nodes for this administrative tier.
                    </p>
                </div>
            </div>

            <PermissionsTable role={role} />
        </AdminContentBlock>
    );
};

export default () => {
    return (
        <Context.Provider>
            <RoleEditContainer />
        </Context.Provider>
    );
};
