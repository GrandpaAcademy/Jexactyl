import { useContext, useEffect, useState } from 'react';
import { ServerContext } from '@/state/server';
import { Form, Formik, FormikHelpers } from 'formik';
import Field from '@/elements/Field';
import { join } from 'pathe';
import { object, string } from 'yup';
import { createDirectory } from '@/api/routes/server/directories';
import { Button } from '@/elements/button/index';
import { useFlashKey } from '@/plugins/useFlash';
import useFileManagerSwr from '@/plugins/useFileManagerSwr';
import FlashMessageRender from '@/elements/FlashMessageRender';
import { Dialog, DialogWrapperContext } from '@/elements/dialog';
import Code from '@/elements/Code';
import asDialog from '@/hoc/asDialog';
import { FileObject } from '@definitions/server';

interface Values {
    directoryName: string;
}

const schema = object().shape({
    directoryName: string().required('A valid directory name must be provided.'),
});

const generateDirectoryData = (name: string): FileObject => ({
    key: `dir_${name.split('/', 1)[0] ?? name}`,
    name: name.replace(/^(\/*)/, '').split('/', 1)[0] ?? name,
    mode: 'drwxr-xr-x',
    modeBits: '0755',
    size: 0,
    isFile: false,
    isSymlink: false,
    mimetype: '',
    createdAt: new Date(),
    modifiedAt: new Date(),
    isArchiveType: () => false,
    isEditable: () => false,
});

const NewDirectoryDialog = asDialog({
    title: 'Create Directory',
})(() => {
    const uuid = ServerContext.useStoreState(state => state.server.data!.uuid);
    const directory = ServerContext.useStoreState(state => state.files.directory);

    const { mutate } = useFileManagerSwr();
    const { close } = useContext(DialogWrapperContext);
    const { clearAndAddHttpError } = useFlashKey('files:directory-modal');

    useEffect(() => {
        return () => {
            clearAndAddHttpError();
        };
    }, []);

    const submit = ({ directoryName }: Values, { setSubmitting }: FormikHelpers<Values>) => {
        createDirectory(uuid, directory, directoryName)
            .then(() => mutate(data => [...data!, generateDirectoryData(directoryName)], false))
            .then(() => close())
            .catch(error => {
                setSubmitting(false);
                clearAndAddHttpError(error);
            });
    };

    return (
        <Formik onSubmit={submit} validationSchema={schema} initialValues={{ directoryName: '' }}>
            {({ submitForm, values }) => (
                <>
                    <FlashMessageRender key={'files:directory-modal'} />
                    <Form className={'m-0'}>
                        <Field autoFocus id={'directoryName'} name={'directoryName'} label={'Name'} />
                        <p className={'mt-4 text-sm break-all font-medium text-zb-muted'}>
                            This directory will be created as&nbsp;
                            <span className="font-mono text-zb-accent bg-zb-accent/5 px-2 py-0.5 rounded border border-zb-accent/20">
                                /home/container/
                                {join(directory, values.directoryName).replace(/^(\.\.\/|\/)+/, '')}
                            </span>
                        </p>
                    </Form>
                    <Dialog.Footer>
                        <Button onClick={close} className="bg-white/5 border-white/10 hover:bg-white/10 text-zb-text-dim">
                            Cancel
                        </Button>
                        <Button onClick={submitForm}>
                            Create Directory
                        </Button>
                    </Dialog.Footer>
                </>
            )}
        </Formik>
    );
});

export default ({ className }: { className?: string }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <NewDirectoryDialog open={open} onClose={setOpen.bind(this, false)} />
            <Button onClick={setOpen.bind(this, true)} className={classNames('bg-white/5 border-white/10 hover:bg-white/10 text-zb-text-dim', className)}>
                New Directory
            </Button>
        </>
    );
};
