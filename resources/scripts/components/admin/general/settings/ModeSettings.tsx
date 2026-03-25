import useFlash from '@/plugins/useFlash';
import { PanelMode } from '@/state/settings';
import { Button } from '@/elements/button';
import { useStoreActions, useStoreState } from '@/state/hooks';
import PersonalModeSvg from '@/assets/images/themed/PersonalModeSvg';
import StandardModeSvg from '@/assets/images/themed/StandardMoveSvg';
import { faDesktop, faMoon, faTerminal } from '@fortawesome/free-solid-svg-icons';
import ServerSvg from '@/assets/images/themed/ServerSvg';
import { Dialog } from '@/elements/dialog';
import { useState } from 'react';
import { updateModeSettings } from '@/api/routes/admin/settings';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default () => {
    const [warning, setWarning] = useState<boolean>(false);
    const { addFlash, clearFlashes, clearAndAddHttpError } = useFlash();

    const settings = useStoreState(state => state.settings.data!);
    const updateSettings = useStoreActions(actions => actions.settings.updateSettings);

    const updateMode = (mode: PanelMode) => {
        clearFlashes();

        updateModeSettings(mode)
            .then(() => {
                updateSettings({ mode: mode });

                addFlash({
                    key: 'settings:mode',
                    type: 'success',
                    message: 'Panel mode has been updated successfully.',
                });
            })
            .catch(error => clearAndAddHttpError({ key: 'settings:mode', error }));
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Dialog open={warning} onClose={() => setWarning(false)} title={'Debug Mode Configuration'}>
                <div className="space-y-4 text-neutral-300">
                    <p>To enable depth-first debugging for Zero-Bot:</p>
                    <div className="bg-black/40 rounded-xl p-5 border border-white/5 font-mono text-sm space-y-3">
                        <div className="flex gap-3">
                            <span className="text-zb-accent opacity-50">1.</span>
                            <span>SSH into your server terminal.</span>
                        </div>
                        <div className="flex gap-3">
                            <span className="text-zb-accent opacity-50">2.</span>
                            <span>Navigate to the installation directory.</span>
                        </div>
                        <div className="flex gap-3">
                            <span className="text-zb-accent opacity-50">3.</span>
                            <span>Update the <code className="text-zb-accent bg-zb-accent/10 px-1.5 rounded">.env</code> file.</span>
                        </div>
                        <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10 text-xs">
                            <span className="text-zb-danger">APP_ENV</span>=local<br/>
                            <span className="text-zb-danger">APP_DEBUG</span>=true
                        </div>
                    </div>
                    <p className="text-xs italic text-neutral-500 mt-4 leading-relaxed">
                        WARNING: Debug mode exposes sensitive environment data. Never leave enabled on production systems.
                    </p>
                </div>
            </Dialog>

            <div className="grid grid-cols-1 gap-8">
                <div className="group relative bg-zb-card/30 backdrop-blur-xl rounded-3xl border border-white/5 p-8 overflow-hidden transition-all duration-500 hover:border-white/10 hover:shadow-2xl">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="w-full lg:w-1/3 flex justify-center transform group-hover:scale-110 transition-transform duration-700">
                            <div className="relative">
                                <div className="absolute inset-0 bg-zb-accent/10 blur-[60px] rounded-full scale-150 animate-pulse" />
                                <StandardModeSvg color={'#00F0FF'} />
                            </div>
                        </div>
                        <div className="w-full lg:w-2/3 flex flex-col items-center lg:items-start text-center lg:text-left">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-zb-accent/10 rounded-lg flex items-center justify-center w-10 h-10">
                                    <FontAwesomeIcon icon={faDesktop} className="text-zb-accent text-xl" />
                                </div>
                                <h3 className="text-2xl font-semibold text-neutral-100 uppercase tracking-widest">Standard Mode</h3>
                            </div>
                            <p className="text-neutral-400 leading-relaxed mb-8 max-w-2xl">
                                Recommended for hosting providers and large organizations. Enables full access to billing systems, 
                                multi-user registration, advanced support tickets, and exhaustive administrative controls.
                            </p>
                            <Button 
                                disabled={settings.mode === 'standard'} 
                                onClick={() => updateMode('standard')}
                                className={classNames(
                                    "px-10 py-3 shadow-zb-glow-sm/20 transition-all duration-300",
                                    settings.mode === 'standard' && "opacity-50 grayscale"
                                )}
                            >
                                {settings.mode === 'standard' ? 'Currently Running' : 'Activate Standard'}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="group relative bg-zb-card/30 backdrop-blur-xl rounded-3xl border border-white/5 p-8 overflow-hidden transition-all duration-500 hover:border-white/10 hover:shadow-2xl">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="w-full lg:w-1/3 flex justify-center transform group-hover:scale-110 transition-transform duration-700">
                            <div className="relative">
                                <div className="absolute inset-0 bg-zb-accent-2/10 blur-[60px] rounded-full scale-150 animate-pulse" />
                                <PersonalModeSvg color={'#7C3AED'} />
                            </div>
                        </div>
                        <div className="w-full lg:w-2/3 flex flex-col items-center lg:items-start text-center lg:text-left">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-purple-500/10 rounded-lg flex items-center justify-center w-10 h-10">
                                    <FontAwesomeIcon icon={faMoon} className="text-purple-400 text-xl" />
                                </div>
                                <h3 className="text-2xl font-semibold text-neutral-100 uppercase tracking-widest">Personal Mode</h3>
                            </div>
                            <p className="text-neutral-400 leading-relaxed mb-8 max-w-2xl">
                                Designed for private home labs and small communities. Simplifies the interface by hiding 
                                complex provider-specific features, focusing entirely on efficient server management.
                            </p>
                            <Button 
                                disabled={settings.mode === 'personal'} 
                                onClick={() => updateMode('personal')}
                                className={classNames(
                                    "px-10 py-3 shadow-zb-glow-sm-purple/20 transition-all duration-300",
                                    settings.mode === 'personal' && "opacity-50 grayscale"
                                )}
                            >
                                {settings.mode === 'personal' ? 'Currently Running' : 'Activate Personal'}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="group relative bg-zb-card/30 backdrop-blur-xl rounded-3xl border border-white/5 p-8 overflow-hidden transition-all duration-500 hover:border-white/10 hover:shadow-2xl border-dashed">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="w-full lg:w-1/3 flex justify-center transform group-hover:scale-110 transition-transform duration-700 grayscale opacity-50">
                            <div className="relative">
                                <div className="absolute inset-0 bg-red-500/5 blur-[60px] rounded-full scale-150 animate-pulse" />
                                <ServerSvg color={'#EF4444'} />
                            </div>
                        </div>
                        <div className="w-full lg:w-2/3 flex flex-col items-center lg:items-start text-center lg:text-left">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-red-500/10 rounded-lg flex items-center justify-center w-10 h-10">
                                    <FontAwesomeIcon icon={faTerminal} className="text-red-400 text-xl" />
                                </div>
                                <h3 className="text-2xl font-semibold text-neutral-100 uppercase tracking-widest">Debug Mode</h3>
                            </div>
                            <p className="text-neutral-400 leading-relaxed mb-8 max-w-2xl">
                                Specialized environment for developers and system troubleshooting. When enabled, Zero-Bot 
                                provides exhaustive diagnostic data and stack traces. Use with extreme caution.
                            </p>
                            <Button 
                                onClick={() => setWarning(true)} 
                                disabled={settings.debug}
                                className={classNames(
                                    "px-10 py-3 shadow-zb-glow-sm-red/20 transition-all duration-300",
                                    settings.debug && "opacity-50 grayscale"
                                )}
                            >
                                {settings.debug ? 'Active via Environment' : 'Configure Debug'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
