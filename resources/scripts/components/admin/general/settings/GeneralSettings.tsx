import { Form, Formik } from 'formik';

import AdminBox from '@/elements/AdminBox';
import Field from '@/elements/Field';
import { Button } from '@/elements/button';
import { GeneralSettings, updateGeneralSettings } from '@/api/routes/admin/settings';
import { useStoreActions, useStoreState } from '@/state/hooks';
import { faPaintBrush, faPlusCircle, faRecycle, faShapes, faImage, faEye } from '@fortawesome/free-solid-svg-icons';
import useFlash from '@/plugins/useFlash';
import { useEffect } from 'react';
import FlashMessageRender from '@/elements/FlashMessageRender';
import Label from '@/elements/Label';

export default () => {
    const { addFlash, clearFlashes, clearAndAddHttpError } = useFlash();

    const settings = useStoreState(state => state.settings.data!);
    const updateSettings = useStoreActions(actions => actions.settings.updateSettings);

    const submit = (values: GeneralSettings) => {
        clearFlashes();

        updateGeneralSettings(values)
            .then(() => {
                updateSettings(values);

                addFlash({
                    type: 'success',
                    key: 'settings:general',
                    message: 'Settings have been updated successfully.',
                });
            })
            .catch(error => {
                clearAndAddHttpError({
                    key: 'settings:general',
                    error: error,
                });
            });
    };

    useEffect(() => {
        clearFlashes();
    }, []);

    return (
        <Formik
            onSubmit={submit}
            initialValues={{
                name: settings.name,
                logo: settings.logo,
                indicators: settings.indicators,
                auto_update: settings.auto_update,
                speed_dial: settings.speed_dial,
                activity: {
                    enabled: {
                        account: settings.activity.enabled.account,
                        server: settings.activity.enabled.server,
                        admin: settings.activity.enabled.admin,
                    },
                },
            }}
        >
            <Form>
                <FlashMessageRender byKey={'settings:general'} className="mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AdminBox title="Application Name" icon={faPaintBrush}>
                        <Field id="name" name="name" type="text" />
                        <p className="text-zb-text-dim text-[11px] mt-3 leading-relaxed">
                            Configure the name of this Panel to suit your needs.
                        </p>
                    </AdminBox>

                    <AdminBox title="Application Logo" icon={faImage}>
                        <Field id="logo" name="logo" type="url" />
                        <p className="text-zb-text-dim text-[11px] mt-3 leading-relaxed">
                            Configure the logo of this Panel to suit your needs.
                        </p>
                    </AdminBox>

                    <AdminBox title="Automatic Updates" icon={faRecycle}>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Label className="mb-0 text-sm">Allow Automatic Updates?</Label>
                                <Field
                                    id="auto_update"
                                    name="auto_update"
                                    type="checkbox"
                                    defaultChecked={settings.auto_update}
                                />
                            </div>
                            <p className="text-zb-text-dim text-[11px] leading-relaxed">
                                If enabled, Zero-Bot will automatically update in order to keep your system secure and
                                introduce new features.
                            </p>
                        </div>
                    </AdminBox>

                    <AdminBox title="Admin Indicators" icon={faShapes}>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Label className="mb-0 text-sm">Show admin indicators?</Label>
                                <Field
                                    id="indicators"
                                    name="indicators"
                                    type="checkbox"
                                    defaultChecked={settings.indicators}
                                />
                            </div>
                            <p className="text-zb-text-dim text-[11px] leading-relaxed">
                                If enabled, small boxes will appear in the top-right of the UI indicating module status. Only visible on workstations.
                            </p>
                        </div>
                    </AdminBox>

                    <AdminBox title="Speed Dial" icon={faPlusCircle}>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Label className="mb-0 text-sm">Show speed dial?</Label>
                                <Field
                                    id="speed_dial"
                                    name="speed_dial"
                                    type="checkbox"
                                    defaultChecked={settings.speed_dial}
                                />
                            </div>
                            <p className="text-zb-text-dim text-[11px] leading-relaxed">
                                If enabled, a component will show to admins in the client-side UI for quick actions like creating servers.
                            </p>
                        </div>
                    </AdminBox>

                    <AdminBox title="Activity Logging" icon={faEye}>
                        <div className="space-y-4">
                            <div className="bg-white/5 border border-white/5 rounded-xl p-4 grid grid-cols-3 gap-2">
                                <div className="flex flex-col items-center gap-2">
                                    <Label className="mb-0 text-[10px] uppercase opacity-50">Account</Label>
                                    <Field
                                        id="activity.enabled.account"
                                        name="activity.enabled.account"
                                        type="checkbox"
                                        defaultChecked={settings.activity.enabled.account}
                                    />
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <Label className="mb-0 text-[10px] uppercase opacity-50">Server</Label>
                                    <Field
                                        id="activity.enabled.server"
                                        name="activity.enabled.server"
                                        type="checkbox"
                                        defaultChecked={settings.activity.enabled.server}
                                    />
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <Label className="mb-0 text-[10px] uppercase opacity-50">Admin</Label>
                                    <Field
                                        id="activity.enabled.admin"
                                        name="activity.enabled.admin"
                                        type="checkbox"
                                        defaultChecked={settings.activity.enabled.admin}
                                    />
                                </div>
                            </div>
                            <p className="text-zb-text-dim text-[11px] leading-relaxed">
                                Select the areas where activity logging should be enabled. Recommended to keep all active.
                            </p>
                        </div>
                    </AdminBox>
                </div>
                <div className="w-full flex flex-col md:flex-row items-center mt-12 gap-6 bg-white/5 border border-white/5 p-6 rounded-2xl backdrop-blur-sm">
                    <p className="text-neutral-500 text-xs italic flex-grow">
                        * Note: Some changes may require a page refresh to take full effect.
                    </p>
                    <Button type="submit" className="w-full md:w-auto shadow-zb-glow-sm/20 px-10">
                        Save Configuration
                    </Button>
                </div>
            </Form>
        </Formik>
    );
};
