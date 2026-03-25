import { useEffect, useRef } from 'react';
import { ServerContext } from '@/state/server';
import { SocketEvent } from '@server/events';
import useWebsocketEvent from '@/plugins/useWebsocketEvent';
import { Line } from 'react-chartjs-2';
import { useChart, useChartTickLabel } from '@server/console/chart';
import { hexToRgba } from '@/lib/helpers';
import { bytesToString } from '@/lib/formatters';
import { CloudDownloadIcon, CloudUploadIcon } from '@heroicons/react/solid';
import ChartBlock from '@server/console/ChartBlock';
import Tooltip from '@/elements/tooltip/Tooltip';

export default () => {
    const status = ServerContext.useStoreState(state => state.status.value);
    const limits = ServerContext.useStoreState(state => state.server.data!.limits);
    const previous = useRef<Record<'tx' | 'rx', number>>({ tx: -1, rx: -1 });

    const cpu = useChartTickLabel('CPU', limits.cpu, '%', 0);
    const memory = useChartTickLabel('Memory', limits.memory, 'MiB');
    const network = useChart('Network', {
        sets: 2,
        options: {
            scales: {
                y: {
                    ticks: {
                        callback(value) {
                            return bytesToString(typeof value === 'string' ? parseInt(value, 10) : value);
                        },
                    },
                },
            },
        },
        callback(opts, index) {
            return {
                ...opts,
                label: !index ? 'Network In' : 'Network Out',
                borderColor: !index ? 'rgba(0, 240, 255, 0.8)' : 'rgba(124, 58, 237, 0.8)',
                backgroundColor: hexToRgba(!index ? '#00F0FF' : '#7C3AED', 0.15),
                fill: true,
                tension: 0.4,
                pointRadius: 0,
            };
        },
    });

    useEffect(() => {
        if (status === 'offline') {
            cpu.clear();
            memory.clear();
            network.clear();
        }
    }, [status]);

    useWebsocketEvent(SocketEvent.STATS, (data: string) => {
        let values: any = {};
        try {
            values = JSON.parse(data);
        } catch (e) {
            return;
        }
        cpu.push(values.cpu_absolute);
        memory.push(Math.floor(values.memory_bytes / 1024 / 1024));
        network.push([
            previous.current.tx < 0 ? 0 : Math.max(0, values.network.tx_bytes - previous.current.tx),
            previous.current.rx < 0 ? 0 : Math.max(0, values.network.rx_bytes - previous.current.rx),
        ]);

        previous.current = { tx: values.network.tx_bytes, rx: values.network.rx_bytes };
    });

    return (
        <div className="space-y-4">
            <ChartBlock title={'CPU Usage'}>
                <Line {...cpu.props} />
            </ChartBlock>
            <ChartBlock title={'Memory Usage'}>
                <Line {...memory.props} />
            </ChartBlock>
            <ChartBlock
                title={'Network Activity'}
                legend={
                    <div className="flex items-center gap-x-4">
                        <Tooltip arrow content={'Inbound'}>
                            <div className="flex items-center gap-x-2">
                                <CloudDownloadIcon className={'h-4 w-4 text-zb-accent'} />
                                <span className="text-[10px] uppercase font-bold tracking-wider">Inbound</span>
                            </div>
                        </Tooltip>
                        <Tooltip arrow content={'Outbound'}>
                            <div className="flex items-center gap-x-2">
                                <CloudUploadIcon className={'h-4 w-4 text-zb-accent-2'} />
                                <span className="text-[10px] uppercase font-bold tracking-wider">Outbound</span>
                            </div>
                        </Tooltip>
                    </div>
                }
            >
                <Line {...network.props} />
            </ChartBlock>
        </div>
    );
};
