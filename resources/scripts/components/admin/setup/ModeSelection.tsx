import PersonalModeSvg from '@/assets/images/themed/PersonalModeSvg';
import StandardMoveSvg from '@/assets/images/themed/StandardMoveSvg';
import { useStoreActions, useStoreState } from '@/state/hooks';
import { Button } from '@/elements/button';
import { PanelMode } from '@/state/settings';
import { updateModeSettings } from '@/api/routes/admin/settings';

export default () => {
    const { mode } = useStoreState(state => state.settings.data!);
    const { primary } = useStoreState(state => state.theme.data!.colors);

    const updateSettings = useStoreActions(actions => actions.settings.updateSettings);

    const updateMode = (mode: PanelMode) => {
        updateModeSettings(mode)
            .then(() => updateSettings({ mode: mode }))
            .catch(e => console.error(e));
    };

    return (
        <div className="w-full max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-2">
                <h2 className="text-3xl text-neutral-50 font-black uppercase tracking-widest tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/60">Choose Your Trajectory</h2>
                <p className="text-neutral-400 text-sm opacity-70">
                    Select the operational mode that best aligns with your infrastructure goals.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div 
                    className={`relative p-8 rounded-[2.5rem] border transition-all duration-500 overflow-hidden flex flex-col h-full bg-zb-card/20 backdrop-blur-xl ${
                        mode === 'personal' 
                        ? 'border-zb-accent shadow-[0_0_30px_rgba(0,242,255,0.15)] ring-1 ring-zb-accent/30' 
                        : 'border-white/5 hover:border-white/10 group'
                    }`}
                >
                    {/* Status Indicator */}
                    {mode === 'personal' && (
                        <div className="absolute top-6 right-8 flex items-center gap-2 px-3 py-1 rounded-full bg-zb-accent/10 border border-zb-accent/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-zb-accent animate-pulse" />
                            <span className="text-[10px] font-bold text-zb-accent uppercase tracking-wider">Active Mode</span>
                        </div>
                    )}

                    <div className="mb-8 opacity-80 group-hover:opacity-100 transition-opacity">
                        <PersonalModeSvg color={primary} />
                    </div>

                    <div className="space-y-4 flex-grow">
                        <h3 className="text-3xl font-black text-white tracking-tight">Personal <span className="text-zb-accent/80 font-light">Core</span></h3>
                        <p className="text-neutral-400 text-sm leading-relaxed opacity-80">
                            Engineered for individual creators and small groups. Focuses on pure performance and essential management tools, eliminating complexity for a streamlined experience.
                        </p>
                        <ul className="space-y-2 text-xs text-neutral-500">
                            <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-zb-accent/40" /> Optimized Resource Allocation</li>
                            <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-zb-accent/40" /> Zero-Clutter Interface</li>
                            <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-zb-accent/40" /> Rapid Instance Deployment</li>
                        </ul>
                    </div>

                    <div className="mt-10">
                        <Button
                            disabled={mode === 'personal'}
                            onClick={() => updateMode('personal')}
                            className={`w-full py-4 rounded-xl font-bold transition-all h-auto ${
                                mode === 'personal'
                                ? 'bg-white/5 text-white/40 border border-white/5 cursor-not-allowed'
                                : 'shadow-zb-glow-sm/20 hover:shadow-zb-glow-md/30'
                            }`}
                        >
                            {mode === 'personal' ? 'Currently Active' : 'Select Personal Mode'}
                        </Button>
                    </div>
                </div>

                <div 
                    className={`relative p-8 rounded-[2.5rem] border transition-all duration-500 overflow-hidden flex flex-col h-full bg-zb-card/20 backdrop-blur-xl ${
                        mode === 'standard' 
                        ? 'border-zb-success shadow-[0_0_30px_rgba(16,185,129,0.15)] ring-1 ring-zb-success/30' 
                        : 'border-white/5 hover:border-white/10 group'
                    }`}
                >
                    {/* Status Indicator */}
                    {mode === 'standard' && (
                        <div className="absolute top-6 right-8 flex items-center gap-2 px-3 py-1 rounded-full bg-zb-success/10 border border-zb-success/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-zb-success animate-pulse" />
                            <span className="text-[10px] font-bold text-zb-success uppercase tracking-wider">Active Mode</span>
                        </div>
                    )}

                    <div className="mb-8 opacity-80 group-hover:opacity-100 transition-opacity">
                        <StandardMoveSvg color={primary} />
                    </div>

                    <div className="space-y-4 flex-grow">
                        <h3 className="text-3xl font-black text-white tracking-tight">Enterprise <span className="text-zb-success/80 font-light">Stack</span></h3>
                        <p className="text-neutral-400 text-sm leading-relaxed opacity-80">
                            The ultimate control suite for business and large-scale networks. Unlocks the full Zero-Bot ecosystem, including advanced billing, ticketing systems, and granular auditing.
                        </p>
                        <ul className="space-y-2 text-xs text-neutral-500">
                            <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-zb-success/40" /> Advanced Billing Ecosystem</li>
                            <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-zb-success/40" /> Comprehensive API Coverage</li>
                            <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-zb-success/40" /> Mission-Critical Support Tools</li>
                        </ul>
                    </div>

                    <div className="mt-10">
                        <Button
                            disabled={mode === 'standard'}
                            onClick={() => updateMode('standard')}
                            className={`w-full py-4 rounded-xl font-bold transition-all h-auto ${
                                mode === 'standard'
                                ? 'bg-white/5 text-white/40 border border-white/5 cursor-not-allowed'
                                : 'shadow-[0_0_20px_rgba(16,185,129,0.2)] bg-zb-success hover:bg-zb-success/90'
                            }`}
                        >
                            {mode === 'standard' ? 'Currently Active' : 'Select Enterprise Stack'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
