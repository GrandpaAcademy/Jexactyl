import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import type { ReactNode } from 'react';
import { useFitText } from '@flyyer/use-fit-text';
import CopyOnClick from '@/elements/CopyOnClick';
import Icon from '@/elements/Icon';

interface StatBlockProps {
    title: string;
    copyOnClick?: string;
    color?: string | undefined;
    dark?: boolean | undefined;
    icon?: IconDefinition | undefined;
    children: ReactNode;
    className?: string;
}

function StatBlock({ title, copyOnClick, icon, color, className, children }: StatBlockProps) {
    const { fontSize, ref } = useFitText({ minFontSize: 8, maxFontSize: 500 });

    return (
        <CopyOnClick text={copyOnClick}>
            <div
                className={classNames('relative p-4 rounded-2xl bg-zb-card/30 backdrop-blur-xl border border-white/5 shadow-xl transition-all duration-300 hover:border-zb-accent/30 flex items-center gap-4 group', className)}
            >
                {icon && (
                    <div className={'flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/5 text-xl transition-all duration-300 group-hover:bg-zb-accent/10 group-hover:border-zb-accent/30 group-hover:shadow-zb-glow-sm'}>
                        <Icon icon={icon} style={{ color: color ?? 'var(--zb-accent)' }} />
                    </div>
                )}
                <div className={'flex w-full flex-col justify-center overflow-hidden'}>
                    <p className={'text-[10px] uppercase tracking-widest font-bold text-zb-muted leading-tight'}>{title}</p>
                    <div
                        ref={ref}
                        className={'h-[1.75rem] w-full truncate font-bold text-zb-text-dim mt-0.5'}
                        style={{ fontSize }}
                    >
                        {children}
                    </div>
                </div>
            </div>
        </CopyOnClick>
    );
}

export default StatBlock;
