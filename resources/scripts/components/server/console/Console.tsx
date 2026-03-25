import { ChevronDoubleRightIcon } from '@heroicons/react/solid';
import classNames from 'classnames';
import { debounce } from 'debounce';
import type { Dispatch, KeyboardEvent as ReactKeyboardEvent, SetStateAction } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ITerminalInitOnlyOptions, ITerminalOptions, ITheme } from 'xterm';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { SearchAddon } from 'xterm-addon-search';
import { SearchBarAddon } from 'xterm-addon-search-bar';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { theme as th } from 'twin.macro';

import SpinnerOverlay from '@/elements/SpinnerOverlay';
import { SocketEvent, SocketRequest } from '@server/events';
import { ScrollDownHelperAddon } from '@/plugins/XtermScrollDownHelperAddon';
import useEventListener from '@/plugins/useEventListener';
import { usePermissions } from '@/plugins/usePermissions';
import { usePersistedState } from '@/plugins/usePersistedState';
import { ServerContext } from '@/state/server';

import 'xterm/css/xterm.css';
import styles from './style.module.css';
import { useStoreState } from '@/state/hooks';
import { ArrowsExpandIcon } from '@heroicons/react/outline';
import IntelligenceButton from './IntelligenceButton';

const theme: ITheme = {
    background: '#0A0E17',
    cursor: '#00F0FF',
    black: '#0A0E17',
    red: '#EF4444',
    green: '#10B981',
    yellow: '#F59E0B',
    blue: '#3B82F6',
    magenta: '#7C3AED',
    cyan: '#00F0FF',
    white: '#D1D5DB',
    brightBlack: '#4B5563',
    brightRed: '#F87171',
    brightGreen: '#34D399',
    brightYellow: '#FBBF24',
    brightBlue: '#60A5FA',
    brightMagenta: '#A78BFA',
    brightCyan: '#22D3EE',
    brightWhite: '#F9FAFB',
    selectionBackground: 'rgba(0, 240, 255, 0.3)',
};

const terminalProps: ITerminalOptions = {
    disableStdin: true,
    cursorStyle: 'block',
    cursorBlink: true,
    allowTransparency: true,
    fontSize: 13,
    fontFamily: '"JetBrains Mono", "Roboto Mono", monospace',
    theme: theme,
    allowProposedApi: true,
};

interface Props {
    expand: boolean;
    setExpand: Dispatch<SetStateAction<boolean>>;
}

export default ({ expand, setExpand }: Props) => {
    const terminalInitOnlyProps: ITerminalInitOnlyOptions = {
        rows: expand ? 45 : 25,
    };

    const TERMINAL_PRELUDE = '\n\u001b[1m\u001b[36mZero-Bot \u001b[37m» \u001b[0m';
    const ref = useRef<HTMLDivElement>(null);
    const terminal = useMemo(() => new Terminal({ ...terminalProps, ...terminalInitOnlyProps }), []);
    const fitAddon = new FitAddon();
    const searchAddon = new SearchAddon();
    const searchBar = new SearchBarAddon({ searchAddon });
    const webLinksAddon = new WebLinksAddon();
    const scrollDownHelperAddon = new ScrollDownHelperAddon();
    const { connected, instance } = ServerContext.useStoreState(state => state.socket);
    const [canSendCommands] = usePermissions(['control.console']);
    const serverId = ServerContext.useStoreState(state => state.server.data!.id);
    const isTransferring = ServerContext.useStoreState(state => state.server.data!.isTransferring);
    const [history, setHistory] = usePersistedState<string[]>(`${serverId}:command_history`, []);
    const [historyIndex, setHistoryIndex] = useState(-1);

    const zIndex = `
    .xterm-search-bar__addon {
        z-index: 10;
        background: rgba(26, 31, 46, 0.8) !important;
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        color: #fff !important;
    }`;

    const handleConsoleOutput = (line: string, prelude = false) =>
        terminal.writeln((prelude ? TERMINAL_PRELUDE : '') + line.replace(/(?:\r\n|\r|\n)$/im, '') + '\u001b[0m');

    const handleTransferStatus = (status: string) => {
        switch (status) {
            case 'failure':
                terminal.writeln(TERMINAL_PRELUDE + '\u001b[31mTransfer has failed.\u001b[0m\n');
                return;
        }
    };

    const handleDaemonErrorOutput = (line: string) =>
        terminal.writeln(
            TERMINAL_PRELUDE + '\u001b[1m\u001b[31m' + line.replace(/(?:\r\n|\r|\n)$/im, '') + '\u001b[0m\n',
        );

    const handlePowerChangeEvent = (state: string) =>
        terminal.writeln(TERMINAL_PRELUDE + 'Server marked as \u001b[33m' + state + '\u001b[0m...\n');

    const handleCommandKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowUp') {
            const newIndex = Math.min(historyIndex + 1, history!.length - 1);

            setHistoryIndex(newIndex);
            e.currentTarget.value = history![newIndex] || '';
            e.preventDefault();
        }

        if (e.key === 'ArrowDown') {
            const newIndex = Math.max(historyIndex - 1, -1);

            setHistoryIndex(newIndex);
            e.currentTarget.value = history![newIndex] || '';
        }

        const command = e.currentTarget.value;
        if (e.key === 'Enter' && command.length > 0) {
            setHistory(prevHistory => [command, ...prevHistory!].slice(0, 32));
            setHistoryIndex(-1);

            instance && instance.send('send command', command);
            e.currentTarget.value = '';
        }
    };

    useEffect(() => {
        if (connected && ref.current && !terminal.element) {
            terminal.loadAddon(fitAddon);
            terminal.loadAddon(searchAddon);
            terminal.loadAddon(searchBar);
            terminal.loadAddon(webLinksAddon);
            terminal.loadAddon(scrollDownHelperAddon);

            terminal.open(ref.current);
            fitAddon.fit();
            searchBar.addNewStyle(zIndex);

            terminal.attachCustomKeyEventHandler((e: KeyboardEvent) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
                    document.execCommand('copy');
                    return false;
                } else if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                    e.preventDefault();
                    searchBar.show();
                    return false;
                } else if (e.key === 'Escape') {
                    searchBar.hidden();
                }
                return true;
            });
        }
    }, [terminal, connected]);

    useEventListener(
        'resize',
        debounce(() => {
            if (terminal.element) {
                fitAddon.fit();
            }
        }, 100),
    );

    useEffect(() => {
        const listeners: Record<string, (s: string) => void> = {
            [SocketEvent.STATUS]: handlePowerChangeEvent,
            [SocketEvent.CONSOLE_OUTPUT]: handleConsoleOutput,
            [SocketEvent.INSTALL_OUTPUT]: handleConsoleOutput,
            [SocketEvent.TRANSFER_LOGS]: handleConsoleOutput,
            [SocketEvent.TRANSFER_STATUS]: handleTransferStatus,
            [SocketEvent.DAEMON_MESSAGE]: line => handleConsoleOutput(line, true),
            [SocketEvent.DAEMON_ERROR]: handleDaemonErrorOutput,
        };

        if (connected && instance) {
            if (!isTransferring) {
                terminal.clear();
            }

            Object.keys(listeners).forEach((key: string) => {
                const listener = listeners[key];
                if (listener === undefined) {
                    return;
                }

                instance.addListener(key, listener);
            });
            instance.send(SocketRequest.SEND_LOGS);
        }

        return () => {
            if (instance) {
                Object.keys(listeners).forEach((key: string) => {
                    const listener = listeners[key];
                    if (listener === undefined) {
                        return;
                    }

                    instance.removeListener(key, listener);
                });
            }
        };
    }, [connected, instance]);

    return (
        <div
            className={classNames(
                'relative w-full rounded-2xl bg-zb-card/30 backdrop-blur-xl border border-white/5 shadow-2xl overflow-hidden transition-all duration-500',
                expand ? 'min-h-[48rem]' : 'min-h-[20rem]',
            )}
        >
            <SpinnerOverlay visible={!connected} size={'large'} />
            <div
                className={classNames(styles.container, styles.overflows_container, { 'rounded-b': !canSendCommands }, 'p-4')}
            >
                <div className={'h-full static'}>
                    <div className={'absolute top-0 right-0 p-6 z-10'}>
                        <IntelligenceButton />
                    </div>
                    <div id={styles.terminal} ref={ref} className="rounded-xl overflow-hidden" />
                </div>
            </div>
            {canSendCommands && (
                <div className={'relative bg-white/5 border-t border-white/5 font-mono'}>
                    <input
                        className={'w-full bg-transparent border-none text-zb-text-dim px-12 py-4 focus:ring-0 placeholder:text-zb-muted/50 text-sm transition-all duration-300 focus:text-zb-text'}
                        type={'text'}
                        placeholder={'Enter command...'}
                        aria-label={'Console command input.'}
                        disabled={!instance || !connected}
                        onKeyDown={handleCommandKeyDown}
                        autoCorrect={'off'}
                        autoCapitalize={'none'}
                    />
                    <div
                        className={'absolute left-4 top-1/2 -translate-y-1/2 text-zb-accent/60'}
                    >
                        <ChevronDoubleRightIcon className={'h-4 w-4'} />
                    </div>
                    <div className={'absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-x-4'}>
                        <ArrowsExpandIcon
                            className={'text-zb-muted hover:text-zb-accent w-4 h-4 cursor-pointer transition-colors duration-300'}
                            onClick={() => setExpand(s => !s)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
