import classNames from 'classnames';
import type { ComponentType, ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

export const SubNavigation = ({ children }: { children: ReactNode }) => {
    return (
        <div className="flex flex-row items-center gap-2 mb-8 border-b border-white/5 overflow-x-auto no-scrollbar pb-1">
            {children}
        </div>
    );
};

interface Props {
    to: string;
    name: string;
    base?: boolean;
    disabled?: boolean;
}

interface PropsWithIcon extends Props {
    icon: ComponentType;
    children?: never;
}

interface PropsWithoutIcon extends Props {
    icon?: never;
    children: ReactNode;
}

export const SubNavigationLink = ({
    base,
    to,
    name,
    icon: IconComponent,
    children,
    disabled,
}: PropsWithIcon | PropsWithoutIcon) => (
    <NavLink 
        to={to} 
        end={base} 
        className={({ isActive }) => classNames(
            'flex items-center gap-2 px-5 py-2.5 rounded-t-xl transition-all duration-300 border-b-2 whitespace-nowrap text-sm font-medium tracking-wide uppercase',
            disabled ? 'opacity-50 pointer-events-none' : 'hover:bg-white/5',
            isActive 
                ? 'text-zb-accent border-zb-accent bg-zb-accent/5 shadow-[0_4px_12px_-4px_rgba(0,240,255,0.2)]' 
                : 'text-neutral-400 border-transparent hover:text-neutral-200'
        )}
    >
        {IconComponent ? <div className="w-5 h-5"><IconComponent /></div> : children}
        {name}
    </NavLink>
);
