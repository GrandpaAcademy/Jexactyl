import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import AdminContentBlock from '@/elements/AdminContentBlock';
import FlashMessageRender from '@/elements/FlashMessageRender';
import useFlash from '@/plugins/useFlash';
import {
    faArrowRight,
    faDesktop,
    faHeart,
    faLayerGroup,
    faQuestionCircle,
    faRecycle,
    faServer,
    faTicket,
    faUserPlus,
    IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import AdminBox from '@/elements/AdminBox';
import Spinner from '@/elements/Spinner';
import CopyOnClick from '@/elements/CopyOnClick';
import { useStoreState } from '@/state/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { Alert } from '@/elements/alert';
import getMetrics, { MetricData } from '@/api/routes/admin/getMetrics';
import getVersion, { VersionData } from '@/api/routes/admin/getVersion';

interface SuggestionProps {
    icon: IconDefinition;
    title: string;
    description: string;
    link: string;
    action?: string;
}

const Code = ({ children }: { children: ReactNode }) => {
    return (
        <code className="text-sm font-mono bg-white/5 border border-white/10 rounded-lg py-0.5 px-2 text-zb-accent">
            {children}
        </code>
    );
};

const SuggestionCard = ({ icon, title, description, link, action }: SuggestionProps) => {
    return (
        <div className="group bg-zb-card/20 backdrop-blur-xl p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 shadow-xl flex flex-col h-full">
            <h1 className="text-xl font-semibold mb-3 flex items-center gap-3 text-neutral-100 uppercase tracking-wider text-sm">
                <FontAwesomeIcon icon={icon} className="text-zb-accent shadow-zb-glow-sm/20" /> {title}
            </h1>
            <p className="text-zb-text-dim text-sm leading-relaxed mb-6 flex-grow">
                {description}
            </p>
            <div className="text-right">
                <Link 
                    to={link}
                    className="inline-flex items-center gap-2 text-zb-accent text-sm font-medium hover:brightness-110 transition-all duration-300 group/link"
                >
                    {action ?? 'Manage'} 
                    <FontAwesomeIcon icon={faArrowRight} className="transition-transform duration-300 group-hover/link:translate-x-1" />
                </Link>
            </div>
        </div>
    );
};

export default () => {
    const [loading, setLoading] = useState<boolean>(true);
    const { clearFlashes, clearAndAddHttpError } = useFlash();

    const everest = useStoreState(state => state.everest.data!);
    const settings = useStoreState(state => state.settings.data!);

    const [metricData, setMetricData] = useState<MetricData | undefined>(undefined);
    const [versionData, setVersionData] = useState<VersionData | undefined>(undefined);

    useEffect(() => {
        clearFlashes('overview');

        getVersion()
            .then(versionData => setVersionData(versionData))
            .catch(error => {
                clearAndAddHttpError({ key: 'overview', error });
            })
            .then(() => setLoading(false));

        getMetrics()
            .then(metricData => setMetricData(metricData))
            .catch(error => {
                clearAndAddHttpError({ key: 'overview', error });
            });
    }, []);

    return (
        <AdminContentBlock title={'Overview'}>
            <div className="w-full flex flex-row items-center mb-8 gap-4">
                <div className="flex flex-col flex-shrink min-w-0">
                    <h2 className="text-3xl text-neutral-50 font-medium tracking-tight uppercase">Overview</h2>
                    <p className="hidden md:block text-base text-neutral-400 mt-1">
                        A quick glance at your system state.
                    </p>
                </div>
                <div className="h-px bg-gradient-to-r from-zb-accent/50 to-transparent flex-grow" />
            </div>

            <FlashMessageRender byKey={'overview'} className="mb-8" />

            <div className="grid grid-cols-1 gap-8">
                <AdminBox title={'Version Information'} icon={faDesktop} className="shadow-zb-glow-sm/5">
                    {settings.debug && (
                        <Alert type={'warning'} className={'mb-6'}>
                            Zero-Bot is running in debug mode. This should not be enabled in production environments.
                        </Alert>
                    )}
                    {loading ? (
                        <div className="py-8 flex justify-center">
                            <Spinner size={'large'} />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="text-neutral-200 flex flex-wrap items-center gap-2 leading-relaxed">
                                You are currently running version&nbsp;
                                <CopyOnClick text={versionData?.panel.current}>
                                    <Code>{versionData?.panel.current}</Code>
                                </CopyOnClick>
                                , with the latest release being&nbsp;
                                <CopyOnClick text={versionData?.panel.latest}>
                                    <Code>{versionData?.panel.latest}</Code>
                                </CopyOnClick>
                                .
                            </div>
                            {versionData?.panel.current.startsWith('v4.0.0-') && (
                                <Alert type={'danger'} className={'mt-4'}>
                                    You are running a beta release of Zero-Bot v4. Bugs and data loss are possible. Use with caution.
                                </Alert>
                            )}
                        </div>
                    )}
                </AdminBox>

                <div className="relative">
                    <div className="flex items-center gap-4 mb-6">
                        <FontAwesomeIcon icon={faQuestionCircle} className="text-zb-accent text-xl" />
                        <h3 className="text-xl font-medium text-neutral-100 uppercase tracking-wider">Suggested Actions</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {!settings.auto_update && (
                            <SuggestionCard
                                icon={faRecycle}
                                link={'/admin/settings'}
                                title={'Auto Updates'}
                                description={
                                    'By setting up automatic updates, you can keep Zero-Bot stable and secure in the background.'
                                }
                            />
                        )}
                        {!everest.auth.registration.enabled && (
                            <SuggestionCard
                                icon={faUserPlus}
                                link={'/admin/auth'}
                                title={'Allow User Signup'}
                                description={
                                    'Enabling the Authentication module allows users to signup via the login page.'
                                }
                            />
                        )}
                        {metricData && (
                            <>
                                {metricData.nodes < 1 && (
                                    <SuggestionCard
                                        icon={faLayerGroup}
                                        link={'/admin/nodes/new'}
                                        title={'Add First Node'}
                                        description={"Nodes are physical servers which Zero-Bot's servers run on."}
                                    />
                                )}
                                {metricData.servers < 1 && (
                                    <SuggestionCard
                                        icon={faServer}
                                        link={'/admin/servers/new'}
                                        title={'Create First Server'}
                                        description={'Create a server to host your favourite game or program.'}
                                    />
                                )}
                                {everest.tickets.enabled && metricData.tickets > 0 && (
                                    <SuggestionCard
                                        icon={faTicket}
                                        link={'/admin/tickets'}
                                        title={'Pending Tickets'}
                                        description={`You currently have ${metricData.tickets} pending tickets which require your attention.`}
                                    />
                                )}
                            </>
                        )}
                        <SuggestionCard
                            icon={faHeart}
                            link={'https://donate.stripe.com/6oE02Zftd9cC34IbIS'}
                            title={'Support Zero-Bot'}
                            action={'Donate'}
                            description={
                                'Help sustain the project development by making a donation towards infrastructure costs.'
                            }
                        />
                    </div>
                </div>
            </div>
        </AdminContentBlock>
    );
};
