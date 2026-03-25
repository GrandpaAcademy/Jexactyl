import { NavLink } from 'react-router-dom';
import FlashMessageRender from '@/elements/FlashMessageRender';
import AdminContentBlock from '@/elements/AdminContentBlock';
import ServersTable from '@admin/management/servers/ServersTable';
import { Button } from '@/elements/button';
import { AdjustmentsIcon, TerminalIcon } from '@heroicons/react/outline';
import { SubNavigation, SubNavigationLink } from '@admin/SubNavigation';
import PresetCreationDialog from './PresetCreationDialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default () => (
    <AdminContentBlock title={'Servers'}>
        <div className="w-full flex flex-col md:flex-row items-center mb-10 gap-6">
            <div className="flex flex-col flex-grow min-w-0 text-center md:text-left">
                <h2 className="text-3xl text-neutral-50 font-semibold tracking-tight uppercase">Servers</h2>
                <p className="text-sm text-neutral-400 mt-1 opacity-70">
                    Monitor and manage all gaming environments across your infrastructure.
                </p>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
                <NavLink to={`/admin/servers/new`} className="flex-shrink-0">
                    <Button type="button" className="shadow-zb-glow-sm/20 px-6 py-2 h-auto flex items-center gap-2">
                        <FontAwesomeIcon icon={faPlus} className="text-xs" />
                        <span>Create Server</span>
                    </Button>
                </NavLink>
                <div className="flex-shrink-0">
                    <PresetCreationDialog />
                </div>
            </div>
        </div>

        <FlashMessageRender byKey={'servers'} className="mb-6" />

        <div className="bg-zb-card/20 backdrop-blur-md rounded-2xl border border-white/5 p-1 mb-8">
            <SubNavigation>
                <SubNavigationLink to="/admin/servers" name="All Servers" base>
                    <TerminalIcon className="w-4 h-4" />
                </SubNavigationLink>
                <SubNavigationLink to="/admin/servers/presets" name="Presets">
                    <AdjustmentsIcon className="w-4 h-4" />
                </SubNavigationLink>
            </SubNavigation>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <ServersTable />
        </div>
    </AdminContentBlock>
);
