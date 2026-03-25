import { ReactNode } from 'react';
import classNames from 'classnames';

export type PillSize = 'normal' | 'large' | 'small' | 'xsmall';
export type PillStatus = 'success' | 'info' | 'warn' | 'danger' | 'unknown';

function getColor(type?: PillStatus): string {
    let value = 'bg-white/10 text-zb-text border border-white/10';

    switch (type) {
        case 'success':
            value = 'bg-zb-success/20 text-zb-success border border-zb-success/30 shadow-zb-glow-success';
            break;
        case 'info':
            value = 'bg-zb-accent/20 text-zb-accent border border-zb-accent/30 shadow-zb-glow';
            break;
        case 'warn':
            value = 'bg-zb-warning/20 text-zb-warning border border-zb-warning/30';
            break;
        case 'danger':
            value = 'bg-zb-danger/20 text-zb-danger border border-zb-danger/30 shadow-zb-glow-danger';
            break;
        case 'unknown':
            value = 'bg-white/5 text-zb-muted border border-white/5';
            break;
        default:
            break;
    }

    return value;
}

export default ({ type, size, children }: { type?: PillStatus; size?: PillSize; children: ReactNode }) => (
    <span
        className={classNames(
            getColor(type),
            !size && 'text-[10px] px-2.5 py-0.5 rounded-full',
            size === 'large' && 'px-6 py-4 rounded-xl w-full text-base',
            size === 'small' && 'text-[11px] px-3 py-1 rounded-full',
            size === 'xsmall' && 'text-[9px] px-1.5 py-0.5 rounded-md',
            'relative mx-1 inline-flex leading-none font-bold uppercase tracking-wider transition-all duration-250',
        )}
    >
        {children}
    </span>
);
