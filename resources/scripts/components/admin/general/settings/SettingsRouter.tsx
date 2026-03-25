import { AdjustmentsIcon, ChipIcon } from '@heroicons/react/outline';
import { Route, Routes } from 'react-router-dom';

import AdminContentBlock from '@/elements/AdminContentBlock';
import FlashMessageRender from '@/elements/FlashMessageRender';
import { SubNavigation, SubNavigationLink } from '@admin/SubNavigation';
import GeneralSettings from '@admin/general/settings/GeneralSettings';
import { useStoreState } from '@/state/hooks';
import ModeSettings from './ModeSettings';

const SettingsRouter = () => {
    const appName = useStoreState(state => state.settings.data!.name);

    return (
        <AdminContentBlock title={'Settings'}>
            <div className="w-full flex flex-row items-center mb-8 gap-4">
                <div className="flex flex-col flex-shrink min-w-0">
                    <h2 className="text-3xl text-neutral-50 font-medium tracking-tight uppercase">Settings</h2>
                    <p className="hidden lg:block text-base text-neutral-400 mt-1 whitespace-nowrap overflow-ellipsis overflow-hidden">
                        Configure and manage global settings for {appName}.
                    </p>
                </div>
                <div className="h-px bg-gradient-to-r from-zb-accent/50 to-transparent flex-grow" />
            </div>

            <FlashMessageRender byKey={'admin:settings'} className="mb-6" />

            <SubNavigation>
                <SubNavigationLink to="/admin/settings" name="Core" base icon={ChipIcon} />
                <SubNavigationLink to="/admin/settings/mode" name="Modes" icon={AdjustmentsIcon} />
            </SubNavigation>

            <div className="mt-8">
                <Routes>
                    <Route path="/" element={<GeneralSettings />} />
                    <Route path="/mode" element={<ModeSettings />} />
                </Routes>
            </div>
        </AdminContentBlock>
    );
};

export default SettingsRouter;
