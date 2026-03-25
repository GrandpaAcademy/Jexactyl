import * as React from 'react';
import classNames from 'classnames';

interface ChartBlockProps {
    title: string;
    legend?: React.ReactNode;
    children: React.ReactNode;
}

export default ({ title, legend, children }: ChartBlockProps) => {
    return (
        <div className={classNames('bg-zb-card/30 backdrop-blur-xl border border-white/5 rounded-2xl shadow-xl overflow-hidden group transition-all duration-300 hover:border-zb-accent/20')}>
            <div className={'flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5'}>
                <h3 className={'font-bold text-zb-text tracking-tight transition-colors duration-300'}>{title}</h3>
                {legend && <div className={'flex items-center text-zb-muted text-xs'}>{legend}</div>}
            </div>
            <div className={'p-4'}>{children}</div>
        </div>
    );
};
