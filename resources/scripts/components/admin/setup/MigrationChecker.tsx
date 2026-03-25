import Spinner from '@/elements/Spinner';
import AdminBox from '@/elements/AdminBox';
import { useEffect, useState } from 'react';
import { faLayerGroup, faPuzzlePiece, faServer, faUser } from '@fortawesome/free-solid-svg-icons';
import { ExistingData, getExistingData } from '@/api/setup';

export default () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<ExistingData>({ nodes: 0, servers: 0, eggs: 0, users: 0 });

    useEffect(() => {
        setLoading(true);

        getExistingData()
            .then(setData)
            .catch(e => console.error(e))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="w-full max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-2">
                <h2 className="text-3xl text-neutral-50 font-black uppercase tracking-widest tracking-tighter">Scanning for Artifacts</h2>
                <p className="text-neutral-400 text-sm opacity-70">
                    We&apos;re indexing your database to identify legacy configurations and data structures.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <AdminBox 
                    title="User Directory" 
                    icon={faUser}
                    className="bg-zb-card/20 backdrop-blur-md border border-white/5 hover:border-zb-accent/20 transition-all duration-300 group"
                >
                    <div className="flex items-center justify-between">
                        <div className="text-5xl font-black text-white group-hover:text-zb-accent transition-colors">
                            {loading ? <Spinner size="base" /> : data.users}
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold uppercase tracking-wider text-zb-accent opacity-50">Identities</p>
                            <p className="text-xs text-neutral-500">Ready for Migration</p>
                        </div>
                    </div>
                </AdminBox>

                <AdminBox 
                    title="Infrastructure Nodes" 
                    icon={faLayerGroup}
                    className="bg-zb-card/20 backdrop-blur-md border border-white/5 hover:border-zb-success/20 transition-all duration-300 group"
                >
                    <div className="flex items-center justify-between">
                        <div className="text-5xl font-black text-white group-hover:text-zb-success transition-colors">
                            {loading ? <Spinner size="base" /> : data.nodes}
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold uppercase tracking-wider text-zb-success opacity-50">Endpoints</p>
                            <p className="text-xs text-neutral-500">Ready for Migration</p>
                        </div>
                    </div>
                </AdminBox>

                <AdminBox 
                    title="Active Instances" 
                    icon={faServer}
                    className="bg-zb-card/20 backdrop-blur-md border border-white/5 hover:border-zb-accent/20 transition-all duration-300 group"
                >
                    <div className="flex items-center justify-between">
                        <div className="text-5xl font-black text-white group-hover:text-zb-accent transition-colors">
                            {loading ? <Spinner size="base" /> : data.servers}
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold uppercase tracking-wider text-zb-accent opacity-50">Deployments</p>
                            <p className="text-xs text-neutral-500">Ready for Migration</p>
                        </div>
                    </div>
                </AdminBox>

                <AdminBox 
                    title="Global Templates" 
                    icon={faPuzzlePiece}
                    className="bg-zb-card/20 backdrop-blur-md border border-white/5 hover:border-zb-success/20 transition-all duration-300 group"
                >
                    <div className="flex items-center justify-between">
                        <div className="text-5xl font-black text-white group-hover:text-zb-success transition-colors">
                            {loading ? <Spinner size="base" /> : data.eggs}
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold uppercase tracking-wider text-zb-success opacity-50">Configuration</p>
                            <p className="text-xs text-neutral-500">Ready for Migration</p>
                        </div>
                    </div>
                </AdminBox>
            </div>

            {!loading && data.users === 1 && (
                <div className="p-6 bg-zb-warning/10 border border-zb-warning/20 rounded-[1.5rem] backdrop-blur-md shadow-lg animate-pulse">
                    <p className="text-zb-warning text-sm font-medium text-center italic">
                        Expecting to see data from an old installation? Join our elite support enclave on Discord.
                    </p>
                </div>
            )}
        </div>
    );
};
