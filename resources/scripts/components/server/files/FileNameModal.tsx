import type { FormikHelpers } from 'formik';
import { Form, Formik } from 'formik';
import { join } from 'pathe';
import { object, string } from 'yup';

import { Button } from '@/elements/button';
import Field from '@/elements/Field';
import type { RequiredModalProps } from '@/elements/Modal';
import Modal from '@/elements/Modal';
import { ServerContext } from '@/state/server';

type Props = RequiredModalProps & {
    onFileNamed: (name: string) => void;
};

interface Values {
    fileName: string;
}

export default ({ onFileNamed, onDismissed, ...props }: Props) => {
    const directory = ServerContext.useStoreState(state => state.files.directory);

    const submit = (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
        onFileNamed(join(directory, values.fileName).replace(/^\//, ''));
        setSubmitting(false);
    };

    return (
        <Formik
            onSubmit={submit}
            initialValues={{ fileName: '' }}
            validationSchema={object().shape({
                fileName: string().required().min(1),
            })}
        >
            {({ resetForm }) => (
                <Modal
                    onDismissed={() => {
                        resetForm();
                        onDismissed();
                    }}
                    {...props}
                >
                    <Form>
                        <Field
                            id={'fileName'}
                            name={'fileName'}
                            label={'File Name'}
                            description={'Enter the name that this file should be saved as.'}
                            autoFocus
                        />
                        <div className="mt-8 flex justify-end">
                            <Button className="shadow-zb-glow-sm/20 px-8">Confirm</Button>
                        </div>
                    </Form>
                </Modal>
            )}
        </Formik>
    );
};
