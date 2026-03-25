import { Form, Formik, FormikHelpers } from 'formik';
import { useState } from 'react';
import { object, string } from 'yup';
import { getRoles, createRole } from '@/api/routes/admin/roles';
import FlashMessageRender from '@/elements/FlashMessageRender';
import { Button } from '@/elements/button';
import Field from '@/elements/Field';
import useFlash from '@/plugins/useFlash';
import { Dialog } from '@/elements/dialog';
import SpinnerOverlay from '@/elements/SpinnerOverlay';

interface Values {
    name: string;
    description: string;
    color: string;
}

const schema = object().shape({
    name: string().required('A role name must be provided.').max(32, 'Role name must not exceed 32 characters.'),
    description: string().max(255, 'Role description must not exceed 255 characters.'),
    color: string().nullable(),
});

export default () => {
    const [visible, setVisible] = useState(false);
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const { mutate } = getRoles();

    const submit = ({ name, description, color }: Values, { setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes('role:create');
        setSubmitting(true);

        createRole(name, description, color)
            .then(async role => {
                await mutate(data => ({ ...data!, items: data!.items.concat(role) }), false);
                setVisible(false);
            })
            .catch(error => {
                clearAndAddHttpError({ key: 'role:create', error });
                setSubmitting(false);
            });
    };

    return (
        <>
            <Formik
                onSubmit={submit}
                initialValues={{ name: '', description: '', color: '' }}
                validationSchema={schema}
            >
                {({ isSubmitting, resetForm }) => (
                    <Dialog
                        open={visible}
                        preventExternalClose={isSubmitting}
                        onClose={() => {
                            resetForm();
                            setVisible(false);
                        }}
                    >
                        <SpinnerOverlay visible={isSubmitting} />
                        <FlashMessageRender byKey={'role:create'} className="mb-6 rounded-xl overflow-hidden shadow-lg border border-white/5" />
                        
                        <div className="flex flex-col gap-2 mb-8">
                            <h2 className="text-3xl text-neutral-100 font-semibold tracking-tight uppercase tracking-widest">Create New Tier</h2>
                            <p className="text-sm text-neutral-400 opacity-70">
                                Provision a new administrative tier with unique permission sets.
                            </p>
                        </div>

                        <Form className="m-0 space-y-6">
                            <Field
                                type={'text'}
                                id={'name'}
                                name={'name'}
                                label={'Tier Name'}
                                description={'A unique identifier for this administrative rank.'}
                                autoFocus
                            />

                            <Field
                                type={'text'}
                                id={'description'}
                                name={'description'}
                                label={'Description'}
                                description={'Define the operational scope of this tier.'}
                            />

                            <Field
                                type={'color'}
                                id={'color'}
                                name={'color'}
                                label={'Tier Identity Color'}
                                description={'Visual indicator for this rank in management tables.'}
                            />

                            <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mt-10 p-4 bg-white/5 rounded-xl border border-white/5">
                                <Button
                                    type="button"
                                    variant={Button.Variants.Secondary}
                                    className="w-full sm:w-auto"
                                    onClick={() => setVisible(false)}
                                >
                                    Abort
                                </Button>
                                <Button className="w-full sm:w-auto shadow-zb-glow-sm/20 px-8" type="submit">
                                    Initialize Tier
                                </Button>
                            </div>
                        </Form>
                    </Dialog>
                )}
            </Formik>

            <Button
                type={'button'}
                size={Button.Sizes.Large}
                className="shadow-zb-glow-sm/20 px-6 py-2.5 h-auto font-medium"
                onClick={() => setVisible(true)}
            >
                Create Rank
            </Button>
        </>
    );
};
