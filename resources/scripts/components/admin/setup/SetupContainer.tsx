import { Button } from '@/elements/button';
import { useStoreState } from '@/state/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faCheckCircle, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import ThemeSelect from './ThemeSelect';
import MigrationChecker from './MigrationChecker';
import ModeSelection from './ModeSelection';
import { finishSetup } from '@/api/setup';

export default () => {
    const [stage, setStage] = useState<number>(1);
    const { primary } = useStoreState(s => s.theme.data!.colors);
    const [fadeIn, setFadeIn] = useState(false);

    useEffect(() => {
        setFadeIn(true);
    }, []);

    const doFinish = () => {
        finishSetup().then(() => {
            window.location.reload();
        });
    };

    return (
        <div className="min-h-screen bg-zb-bg flex items-center justify-center p-6 lg:p-12 overflow-hidden relative">
            {/* Background Decor */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-zb-accent/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zb-success/10 blur-[120px] rounded-full pointer-events-none" />

            <div
                className={`w-full max-w-6xl transition-all duration-1000 transform ${
                    fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
            >
                <div className="bg-zb-card/30 backdrop-blur-2xl border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.3)] rounded-[2.5rem] p-8 lg:p-16 relative overflow-hidden">
                    {/* Inner Decor */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-zb-accent to-transparent opacity-30" />
                    
                    <div className="flex flex-col items-center text-center">
                        {stage === 1 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <div className="flex flex-col items-center gap-y-4 mb-4">
                                    <img src={'https://xxxxxcdn.zero-bot.net/logo-icon.svg'} className={'w-24 h-24 drop-shadow-zb-glow'} alt={'Zero-Bot Logo'} />
                                    <div className="inline-block px-4 py-1.5 rounded-full bg-zb-accent/10 border border-zb-accent/20 text-zb-accent text-xs font-bold uppercase tracking-[0.2em]">
                                        System Initialization
                                    </div>
                                </div>
                                <h1 className="text-6xl lg:text-8xl font-black tracking-tighter text-white leading-tight">
                                    Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-br from-zb-accent to-zb-success drop-shadow-[0_0_15px_rgba(0,242,255,0.3)]">Zero-Bot</span>
                                </h1>
                                <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed font-light">
                                    Experience the future of game server management. Let&apos;s configure your high-performance instance.
                                </p>
                            </div>
                        )}
                        
                        {stage === 2 && <MigrationChecker />}
                        {stage === 3 && <ThemeSelect defaultColor={primary} />}
                        {stage === 4 && <ModeSelection />}
                        
                        {stage === 5 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <div className="inline-block px-4 py-1.5 rounded-full bg-zb-success/10 border border-zb-success/20 text-zb-success text-xs font-bold uppercase tracking-[0.2em] mb-4">
                                    Setup Complete
                                </div>
                                <h1 className="text-6xl lg:text-8xl font-black tracking-tighter text-white leading-tight">
                                    Ready for <span className="text-transparent bg-clip-text bg-gradient-to-br from-zb-success to-zb-accent drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">Liftoff</span>
                                </h1>
                                <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed font-light">
                                    Your Zero-Bot instance is fully optimized and ready to serve. Welcome to the elite tier of hosting.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
                        {stage > 1 ? (
                            <Button.Text 
                                onClick={() => setStage(stage - 1)} 
                                variant={Button.Variants.Secondary}
                                className="group px-8 py-3 rounded-xl border border-white/5 hover:bg-white/5 transition-all w-full sm:w-auto"
                            >
                                <FontAwesomeIcon icon={faArrowLeft} className="mr-3 text-neutral-500 group-hover:text-white transition-colors" />
                                Go Back
                            </Button.Text>
                        ) : (
                            <Button.Text 
                                onClick={doFinish} 
                                variant={Button.Variants.Secondary}
                                className="group px-8 py-3 rounded-xl border border-white/5 hover:bg-white/5 transition-all w-full sm:w-auto"
                            >
                                <FontAwesomeIcon icon={faXmark} className="mr-3 text-neutral-500 group-hover:text-white transition-colors" />
                                Skip Setup
                            </Button.Text>
                        )}
                        
                        {stage < 5 ? (
                            <Button 
                                onClick={() => setStage(stage + 1)}
                                className="group px-12 py-3 rounded-xl shadow-zb-glow-sm/20 hover:shadow-zb-glow-md/30 transition-all font-bold w-full sm:w-auto h-auto text-lg"
                            >
                                Continue
                                <FontAwesomeIcon icon={faArrowRight} className="ml-3 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        ) : (
                            <Button 
                                onClick={doFinish}
                                className="group px-12 py-3 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] bg-zb-success hover:bg-zb-success/90 transition-all font-bold w-full sm:w-auto h-auto text-lg"
                            >
                                Finish Setup
                                <FontAwesomeIcon icon={faCheckCircle} className="ml-3 group-hover:scale-110 transition-transform" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
