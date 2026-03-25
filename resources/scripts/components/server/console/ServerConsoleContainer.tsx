import { memo } from 'react';
import isEqual from 'react-fast-compare';
import { Alert } from '@/elements/alert';
import Can from '@/elements/Can';
import Spinner from '@/elements/Spinner';
import Console from '@server/console/Console';
import PowerButtons from '@server/console/PowerButtons';
import ServerDetailsBlock from '@server/console/ServerDetailsBlock';
import StatGraphs from '@server/console/StatGraphs';
import Features from '@feature/Features';
import { ServerContext, ServerStatus } from '@/state/server';
import classNames from 'classnames';
import { usePersistedState } from '@/plugins/usePersistedState';
import { useStoreState } from '@/state/hooks';
import Pill from '@/elements/Pill';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faDownload, faSpinner } from '@fortawesome/free-solid-svg-icons';
import EditServerDialog from './EditServerDialog';
import PageContentBlock from '@/elements/PageContentBlock';
import { timeUntil } from '../billing/ServerBillingContainer';

export type PowerAction = 'start' | 'stop' | 'restart' | 'kill';

function statusToColor(status: ServerStatus): string {
    switch (status) {
        case 'running':
            return 'text-zb-success shadow-zb-glow-success';
        case 'offline':
            return 'text-zb-danger shadow-zb-glow-danger';
        default:
            return 'text-zb-warning shadow-zb-glow-warning';
    }
}

function ServerConsoleContainer() {
    const user = useStoreState(state => state.user.data!);
    const server = ServerContext.useStoreState(state => state.server.data!);
    const isInstalling = ServerContext.useStoreState(state => state.server.isInstalling);
    const [expand, setExpand] = usePersistedState<boolean>(`console_expand_${user.uuid}`, false);
    const isTransferring = ServerContext.useStoreState(state => state.server.data!.isTransferring);
    const eggFeatures = ServerContext.useStoreState(state => state.server.data!.eggFeatures, isEqual);
    const isNodeUnderMaintenance = ServerContext.useStoreState(state => state.server.data!.isNodeUnderMaintenance);
    const status = ServerContext.useStoreState(state => state.status.value);
    const settings = useStoreState(state => state.everest.data!.billing);

    const freeGraceDays = settings.renewal?.days || 7;

    const daysUntilRenewal = server.renewalDate
        ? Math.floor((new Date(server.renewalDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : null;

    const showRenewalWarning =
        server.billingProductId &&
        daysUntilRenewal !== null &&
        daysUntilRenewal <= 0 &&
        Math.abs(daysUntilRenewal) <= freeGraceDays;

    return (
        <PageContentBlock title={'Server Console'} showFlashKey={'console:share'}>
            {showRenewalWarning && (
                <Alert type={'warning'} className={'mb-4 shadow-zb-glow-warning/20'}>
                    Your server is {Math.abs(daysUntilRenewal!)} day{Math.abs(daysUntilRenewal!) !== 1 ? 's' : ''}{' '}
                    overdue for renewal. Please renew within {freeGraceDays} days to avoid permanent suspension. Your
                    server files and data will be preserved.
                </Alert>
            )}
            {(isNodeUnderMaintenance || isInstalling || isTransferring) && (
                <Alert type={'warning'} className={'mb-4 shadow-zb-glow-warning/20'}>
                    {isNodeUnderMaintenance
                        ? 'The node of this server is currently under maintenance and all actions are unavailable.'
                        : isInstalling
                        ? 'This server is currently running its installation process and most actions are unavailable.'
                        : 'This server is currently being transferred to another node and all actions are unavailable.'}
                </Alert>
            )}
            <div className={'mb-6 flex flex-col lg:flex-row justify-between gap-6 bg-zb-card/30 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-2xl'}>
                <div className={'flex flex-col gap-y-2'}>
                    <div className={'flex items-center gap-x-4'}>
                        <h1 className={'font-bold text-3xl lg:text-4xl tracking-tight text-zb-text line-clamp-1'}>{server.name}</h1>
                        <Pill type={status === 'running' ? 'success' : status === 'offline' ? 'danger' : 'warn'} size="small">
                            {isInstalling && (
                                <>
                                    <FontAwesomeIcon icon={faDownload} className={'mr-2'} />
                                    Installing
                                </>
                            )}
                            {isTransferring && (
                                <>
                                    <FontAwesomeIcon icon={faSpinner} className={'animate-spin mr-2'} />
                                    Transferring
                                </>
                            )}
                            {!isInstalling && !isTransferring && (
                                <>
                                    <FontAwesomeIcon
                                        icon={faCircle}
                                        className={classNames('mr-2 w-2 text-[8px]', statusToColor(status))}
                                    />
                                    {status}
                                </>
                            )}
                        </Pill>
                        <EditServerDialog />
                    </div>
                    <p className={'text-zb-muted font-medium text-sm flex items-center gap-x-2'}>
                        <code className="bg-white/5 px-2 py-0.5 rounded text-zb-accent-2 font-mono">{server.uuid}</code>
                        {server.renewalDate && (
                            <span className={'text-zb-text-dim'}>&bull; {timeUntil(server.renewalDate!).days} days until renewal</span>
                        )}
                    </p>
                </div>
                <div className={'my-auto'}>
                    <Can action={['control.start', 'control.stop', 'control.restart']} matchAny>
                        <PowerButtons className={' flex space-x-2 sm:justify-center'} />
                    </Can>
                </div>
            </div>
            {!expand && <ServerDetailsBlock className={'order-last col-span-4 lg:order-none lg:col-span-1'} />}
            <div className={'mb-4 grid grid-cols-4 gap-2 sm:gap-4'}>
                <div className={classNames('col-span-4 flex', !expand && 'lg:col-span-3')}>
                    <Spinner.Suspense>
                        <Console expand={expand} setExpand={setExpand} />
                    </Spinner.Suspense>
                </div>
                {!expand && (
                    <div className={'col-span-4 lg:col-span-1 my-auto'}>
                        <div className={'grid grid-cols-1 gap-2'}>
                            <Spinner.Suspense>
                                <StatGraphs />
                            </Spinner.Suspense>
                        </div>
                    </div>
                )}
            </div>
            <Features enabled={eggFeatures} />
        </PageContentBlock>
    );
}

export default memo(ServerConsoleContainer, isEqual);
