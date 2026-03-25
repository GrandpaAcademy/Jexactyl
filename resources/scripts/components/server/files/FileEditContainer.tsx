import type { LanguageDescription } from '@codemirror/language';
import { languages } from '@codemirror/language-data';
import { dirname } from 'pathe';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { httpErrorToHuman } from '@/api/http';
import { getFileContents, saveFileContents } from '@/api/routes/server/files';
import FlashMessageRender from '@/elements/FlashMessageRender';
import { Button } from '@/elements/button';
import Can from '@/elements/Can';
import Select from '@/elements/Select';
import PageContentBlock from '@/elements/PageContentBlock';
import { ServerError } from '@/elements/ScreenBlock';
import SpinnerOverlay from '@/elements/SpinnerOverlay';
import FileManagerBreadcrumbs from '@server/files/FileManagerBreadcrumbs';
import FileNameModal from '@server/files/FileNameModal';
import ErrorBoundary from '@/elements/ErrorBoundary';
import { Editor } from '@/elements/editor';
import useFlash from '@/plugins/useFlash';
import { ServerContext } from '@/state/server';
import { encodePathSegments } from '@/lib/helpers';

export default () => {
    const [error, setError] = useState('');
    const { action, '*': rawFilename } = useParams<{ action: 'edit' | 'new'; '*': string }>();
    const [loading, setLoading] = useState(action === 'edit');
    const [content, setContent] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [language, setLanguage] = useState<LanguageDescription>();

    const [filename, setFilename] = useState<string>('');

    useEffect(() => {
        setFilename(decodeURIComponent(rawFilename ?? ''));
    }, [rawFilename]);

    const navigate = useNavigate();

    const id = ServerContext.useStoreState(state => state.server.data!.id);
    const uuid = ServerContext.useStoreState(state => state.server.data!.uuid);
    const setDirectory = ServerContext.useStoreActions(actions => actions.files.setDirectory);
    const { addError, clearFlashes } = useFlash();

    let fetchFileContent: null | (() => Promise<string>) = null;

    useEffect(() => {
        if (action === 'new') {
            return;
        }

        if (filename === '') {
            return;
        }

        setError('');
        setLoading(true);
        setDirectory(dirname(filename));
        getFileContents(uuid, filename)
            .then(setContent)
            .catch(error => {
                console.error(error);
                setError(httpErrorToHuman(error));
            })
            .then(() => setLoading(false));
    }, [action, uuid, filename]);

    const save = (name?: string) => {
        if (!fetchFileContent) {
            return;
        }

        setLoading(true);
        clearFlashes('files:view');
        fetchFileContent()
            .then(content => saveFileContents(uuid, name ?? filename, content))
            .then(() => {
                if (name) {
                    navigate(`/server/${id}/files/edit/${encodePathSegments(name)}`);
                    return;
                }

                return Promise.resolve();
            })
            .catch(error => {
                console.error(error);
                addError({ message: httpErrorToHuman(error), key: 'files:view' });
            })
            .then(() => setLoading(false));
    };

    if (error) {
        // TODO: onBack
        return <ServerError message={error} />;
    }

    return (
        <PageContentBlock>
            <FlashMessageRender byKey={'files:view'} className="mb-4" />

            <ErrorBoundary>
                <div className="mb-4">
                    <FileManagerBreadcrumbs withinFileEditor isNewFile={action !== 'edit'} />
                </div>
            </ErrorBoundary>

            {filename === '.pteroignore' ? (
                <div className="mb-4 p-4 border-l-4 bg-zb-card/40 backdrop-blur-xl rounded-xl border-zb-accent shadow-zb-glow-sm/20">
                    <p className="text-zb-text-dim text-sm leading-relaxed">
                        You&apos;re editing a <code className="font-mono bg-white/5 border border-white/10 rounded-lg py-1 px-2 text-zb-accent">.pteroignore</code>{' '}
                        file. Any files or directories listed in here will be excluded from backups. Wildcards are
                        supported by using an asterisk (<code className="font-mono bg-white/5 border border-white/10 rounded-lg py-1 px-2 text-zb-accent">*</code>).
                        You can negate a prior rule by prepending an exclamation point (
                        <code className="font-mono bg-white/5 border border-white/10 rounded-lg py-1 px-2 text-zb-accent">!</code>).
                    </p>
                </div>
            ) : null}

            <FileNameModal
                visible={modalVisible}
                onDismissed={() => setModalVisible(false)}
                onFileNamed={name => {
                    setModalVisible(false);
                    save(name);
                }}
            />

            <div className="relative group">
                <SpinnerOverlay visible={loading} />
                <div className="bg-zb-card/30 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden transition-all duration-300 group-hover:border-white/10 shadow-2xl">
                    <Editor
                        style={{ height: 'calc(100vh - 22rem)' }}
                        childClassName="h-full"
                        filename={filename}
                        initialContent={content}
                        language={language}
                        onLanguageChanged={l => {
                            setLanguage(l);
                        }}
                        fetchContent={value => {
                            fetchFileContent = value;
                        }}
                        onContentSaved={() => {
                            if (action !== 'edit') {
                                setModalVisible(true);
                            } else {
                                save();
                            }
                        }}
                    />
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end items-center mt-6 gap-4">
                <div className="w-full sm:w-auto rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300">
                    <Select
                        className="bg-transparent border-none text-zb-text-dim py-2.5 px-4"
                        value={language?.name ?? ''}
                        onChange={e => {
                            setLanguage(languages.find(l => l.name === e.target.value));
                        }}
                    >
                        {languages.map(language => (
                            <option key={language.name} value={language.name}>
                                {language.name}
                            </option>
                        ))}
                    </Select>
                </div>

                <div className="flex w-full sm:w-auto gap-4">
                    {action === 'edit' ? (
                        <Can action={'file.update'}>
                            <Button className="flex-1 sm:flex-none shadow-zb-glow-sm/20" onClick={() => save()}>
                                Save Changes
                            </Button>
                        </Can>
                    ) : (
                        <Can action={'file.create'}>
                            <Button className="flex-1 sm:flex-none shadow-zb-glow-sm/20" onClick={() => setModalVisible(true)}>
                                Create File
                            </Button>
                        </Can>
                    )}
                </div>
            </div>
        </PageContentBlock>
    );
};
