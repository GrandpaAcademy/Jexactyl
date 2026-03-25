import { useEffect, useRef, useState } from 'react';
import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFloppyDisk,
    faInfoCircle,
    faMemory,
    faMicrochip,
    faPlus,
    faPowerOff,
    faTrash,
    faXmarkCircle,
    IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { ServerPowerState, ServerStats, type Server } from '@definitions/server';
import { getServerResourceUsage } from '@/api/routes/server';
import { useStoreState } from '@/state/hooks';
import classNames from 'classnames';
import { removeServerFromGroup } from '@/api/routes/server/groups';
import { type ServerGroup } from '@definitions/server';
import Pill from '@/elements/Pill';
import { VisibleDialog } from './groups/ServerGroupDialog';
import useFlash from '@/plugins/useFlash';
import { timeUntil } from '../server/billing/ServerBillingContainer';

export function statusToColor(state?: ServerPowerState): string {
    switch (state) {
        case 'running':
            return 'text-zb-success shadow-zb-glow-success';
        case 'starting':
        case 'stopping':
            return 'text-zb-warning shadow-zb-glow-warning';
        default:
            return 'text-zb-danger shadow-zb-glow-danger';
    }
}

const UtilBox = ({
    utilised,
    icon,
    rounded,
    server,
}: {
    utilised: number;
    icon: IconDefinition;
    rounded?: string;
    server?: Server;
}) => {
    return (
        <div
            className={classNames(
                'col-span-2 lg:col-span-1 w-full h-full bg-white/5 lg:shadow-inner m-auto px-4 py-2 border border-white/5',
                rounded === 'left' && 'lg:rounded-l-xl',
                rounded === 'right' && 'lg:rounded-r-xl',
                rounded === 'full' && 'lg:rounded-xl lg:col-span-3',
            )}
        >
            <div className={'text-zb-text-dim font-bold text-center'}>
                <div className={'inline-flex items-center gap-x-2 text-xs'}>
                    <FontAwesomeIcon icon={icon} className={'text-zb-accent/60'} size={'xs'} />
                    <span>
                        {utilised > -1
                            ? `${utilised === Infinity ? 0 : utilised}%`
                            : `Server is ${server?.isTransferring ? 'transferring' : server?.status ?? 'offline'}`}
                    </span>
                </div>
            </div>
        </div>
    );
};

type Timer = ReturnType<typeof setInterval>;

export default ({
    server,
    group,
    setOpen,
}: {
    server: Server;
    group?: ServerGroup;
    setOpen: React.Dispatch<React.SetStateAction<VisibleDialog>>;
}) => {
    const { clearFlashes, addFlash, clearAndAddHttpError } = useFlash();
    const [stats, setStats] = useState<ServerStats>();
    const interval = useRef<Timer>(null) as React.MutableRefObject<Timer>;
    const [isSuspended, setIsSuspended] = useState(server.status === 'suspended');
    const [removed, setRemoved] = useState(false);

    const onDelete = () => {
        clearFlashes();

        removeServerFromGroup(group!.id, server.uuid)
            .then(() => {
                addFlash({ type: 'success', key: 'dashboard:groups', message: 'Server group removed successfully.' });
                setOpen({ open: 'none', serverId: undefined });
                setRemoved(true);
            })
            .catch(error => clearAndAddHttpError({ key: 'dashboard:groups', error }));
    };

    const getStats = () =>
        getServerResourceUsage(server.uuid)
            .then(data => setStats(data))
            .catch(error => console.error(error));

    useEffect(() => {
        setIsSuspended(stats?.isSuspended || server.status === 'suspended');
    }, [stats?.isSuspended, server.status]);

    useEffect(() => {
        if (isSuspended) return;

        getStats().then(() => {
            interval.current = setInterval(() => getStats(), 30000);
        });

        return () => {
            interval.current && clearInterval(interval.current);
        };
    }, [isSuspended]);

    const cpuUsed =
        server.limits.cpu === 0 ? stats?.cpuUsagePercent : (stats?.cpuUsagePercent ?? 0) / (server.limits.cpu / 100);
    const diskUsed = ((stats?.diskUsageInBytes ?? 0) / 1024 / 1024 / server.limits.disk) * 100;
    const memoryUsed = ((stats?.memoryUsageInBytes ?? 0) / 1024 / 1024 / server.limits.memory) * 100;

    return (
        <>
            <div
                className={'w-full p-5 rounded-2xl grid grid-cols-2 lg:grid-cols-12 mb-4 bg-zb-card/30 backdrop-blur-lg border border-white/5 hover:border-zb-accent/30 shadow-2xl transition-all duration-300 group hover:shadow-zb-glow/10'}
            >
                <div className="my-auto col-span-1 flex justify-center lg:justify-start lg:pl-4">
                    <FontAwesomeIcon
                        className={classNames(statusToColor(stats?.status ?? 'offline'), 'transition-all duration-500')}
                        icon={server.status === 'suspended' ? faXmarkCircle : faPowerOff}
                        size={'lg'}
                    />
                </div>
                <Link
                    to={`/server/${server.id}`}
                    className="whitespace-nowrap text-zb-text col-span-1 lg:col-span-6 mb-4 lg:mb-0 transition duration-300"
                >
                    <span className="text-lg font-bold tracking-tight group-hover:text-zb-accent transition-colors">
                        {server.name}
                    </span>
                    <div className={'text-zb-muted text-[11px] font-mono mt-1 flex items-center gap-x-2'}>
                        <span className="bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                            {server.allocations[0]?.ip.toString()}:{server.allocations[0]?.port.toString()}
                        </span>
                        {server.renewalDate && (
                            <span className="text-zb-accent-2/80">
                                &bull; {timeUntil(server.renewalDate).days}d {timeUntil(server.renewalDate).hours}h left
                            </span>
                        )}
                    </div>
                </Link>
                <div className={'col-span-1 lg:col-span-2 my-auto mr-2'}>
                    {group && group.id === server.groupId && !removed ? (
                        <Pill size={'small'} type={'unknown'}>
                            <span style={{ color: group?.color }} className={'cursor-default flex items-center gap-x-2'}>
                                {group.name}
                                <div
                                    onClick={onDelete}
                                    className={'opacity-0 group-hover:opacity-100 transition duration-200 inline-flex cursor-pointer hover:scale-110 active:scale-95'}
                                >
                                    <FontAwesomeIcon icon={faTrash} size={'xs'} className={'text-zb-danger'} />
                                </div>
                            </span>
                        </Pill>
                    ) : (
                        <div
                            onClick={() => setOpen({ open: 'add', serverId: server.uuid })}
                            className={
                                'hidden xl:inline-flex leading-none font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 text-zb-muted rounded-full border border-white/10 border-dashed cursor-pointer hover:bg-zb-accent/10 hover:text-zb-accent hover:border-zb-accent/30 transition-all duration-300'
                            }
                        >
                            <FontAwesomeIcon icon={faPlus} className={'mr-2'} />
                            Add Group
                        </div>
                    )}
                </div>
                <div className="col-span-2 lg:col-span-3 flex items-center">
                    {server.status || stats?.status === 'offline' ? (
                        <UtilBox rounded={'full'} utilised={-1} icon={faInfoCircle} server={server} />
                    ) : (
                        <div className="grid grid-cols-3 w-full">
                            <UtilBox rounded={'left'} utilised={Number(cpuUsed?.toFixed(0))} icon={faMicrochip} />
                            <UtilBox utilised={Number(memoryUsed.toFixed(0))} icon={faMemory} />
                            <UtilBox rounded={'right'} utilised={Number(diskUsed.toFixed(0))} icon={faFloppyDisk} />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
