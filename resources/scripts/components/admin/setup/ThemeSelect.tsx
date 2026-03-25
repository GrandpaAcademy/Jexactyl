import updateColors from '@/api/routes/admin/theme/updateColors';
import useStatus from '@/plugins/useStatus';
import { useStoreActions, useStoreState } from '@/state/hooks';
import AdminBox from '@/elements/AdminBox';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CheckCircleIcon } from '@heroicons/react/outline';

const colorOptions = [
    { hex: '#16a34a', name: 'Zero-Bot Green' },
    { hex: '#12aaaa', name: 'Microsoft Teal' },
    { hex: '#ff0000', name: 'Brick Red' },
    { hex: '#9D00FF', name: 'Iris Purple' },
    { hex: '#FFA500', name: 'Orange Orange' },
    { hex: '#32559f', name: 'Ptero Blue' },
    { hex: '#ff99c8', name: 'Pretty Pink' },
    { hex: '#5e6472', name: 'Plain Grey' },
];

export default ({ defaultColor }: { defaultColor: string }) => {
    const { status, setStatus } = useStatus();
    const theme = useStoreState(state => state.theme.data!);
    const setTheme = useStoreActions(actions => actions.theme.setTheme);

    const changeColor = (hex: string) => {
        setStatus('loading');

        updateColors('primary', hex).then(() => {
            setStatus('success');
            setTheme({
                ...theme,
                colors: {
                    ...theme.colors,
                    primary: hex,
                },
            });
        });
    };

    return (
        <div className="w-full max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-2">
                <h2 className="text-3xl text-neutral-50 font-black uppercase tracking-widest tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/60">Aesthetic Alignment</h2>
                <p className="text-neutral-400 text-sm opacity-70">
                    Define the primary visual signature of your administrative enclave.
                </p>
            </div>

            <AdminBox 
                status={status} 
                title={'Primary Chromatic Signature'}
                className="bg-zb-card/20 backdrop-blur-xl border border-white/5"
            >
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6 lg:gap-8">
                    {colorOptions.map(option => (
                        <div
                            className="text-center relative group cursor-pointer"
                            key={option.hex}
                            onClick={() => changeColor(option.hex)}
                        >
                            <div className="relative inline-block">
                                <FontAwesomeIcon
                                    icon={faCircle}
                                    style={{ color: option.hex }}
                                    className={`text-5xl transition-all duration-300 transform group-hover:scale-110 ${
                                        defaultColor === option.hex 
                                        ? 'shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                                        : 'opacity-60 group-hover:opacity-100'
                                    }`}
                                />
                                {defaultColor === option.hex && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <CheckCircleIcon className="w-8 h-8 text-white drop-shadow-lg" />
                                    </div>
                                )}
                            </div>
                            <p className={`text-[10px] mt-3 font-bold uppercase tracking-widest transition-colors ${
                                defaultColor === option.hex ? 'text-white' : 'text-neutral-500 group-hover:text-neutral-300'
                            }`}>
                                {option.name}
                            </p>
                            
                            {/* Glow Effect on Hover */}
                            <div 
                                className="absolute inset-0 -z-10 bg-current opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300 rounded-full"
                                style={{ color: option.hex }}
                            />
                        </div>
                    ))}
                </div>
            </AdminBox>
            
            <div className="flex items-center justify-center gap-3 opacity-50">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-neutral-500" />
                <p className="text-neutral-400 text-xs italic">Selection will be synchronized globally in real-time</p>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-neutral-500" />
            </div>
        </div>
    );
};
