import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { UsePaginationResult } from '@/plugins/usePagination';
import { Button } from './button';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Header = ({ children }: { children: ReactNode }) => {
    return (
        <thead className={'text-[11px] uppercase text-zb-muted bg-white/5 tracking-widest'}>
            <tr>{children}</tr>
        </thead>
    );
};

const HeaderItem = ({ children }: { children: ReactNode }) => <th className={'px-6 py-4 font-bold border-b border-white/5'}>{children}</th>;

const Body = ({ children }: { children: ReactNode }) => <tbody className="bg-white/[0.02]">{children}</tbody>;

const BodyItem = ({ item, to, children }: { item: string; to?: string; children: ReactNode }) => {
    return (
        <tr className={'border-b border-white/5 hover:bg-white/5 transition-all duration-200 group'}>
            <th
                className={'px-6 py-4 font-bold text-zb-accent whitespace-nowrap group-hover:brightness-125 transition-all duration-250'}
            >
                {to ? <Link to={to} className="hover:underline">{item}</Link> : item}
            </th>
            {children}
        </tr>
    );
};

const PaginatedFooter = ({
    pagination,
    noBackground,
}: {
    pagination: UsePaginationResult<any>;
    noBackground?: boolean;
}) => {
    return (
        <div
            className={classNames('py-4 px-6 border-t border-white/5 flex items-center justify-between', !noBackground && 'bg-zb-accent/5 rounded-b-2xl')}
        >
            <p className={'text-xs font-bold text-zb-muted uppercase tracking-wider'}>
                Showing <span className={'text-zb-text'}>{pagination.startIndex + 1}</span> to{' '}
                <span className={'text-zb-text'}>{pagination.endIndex}</span> of{' '}
                <span className={'text-zb-text'}>{pagination.totalItems}</span> results
            </p>
            <div className={'flex items-center gap-x-4'}>
                <p className={'text-xs font-bold text-zb-muted uppercase tracking-wider'}>
                    Page <span className={'text-zb-accent'}>{pagination.currentPage}</span> of{' '}
                    <span className={'text-zb-text'}>{pagination.totalPages}</span>
                </p>
                <div className={'flex gap-x-2'}>
                    <Button.Text
                        disabled={pagination.currentPage === 1}
                        size={Button.Sizes.Small}
                        onClick={pagination.goToPreviousPage}
                        className="!p-2 rounded-lg"
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </Button.Text>
                    <Button.Text
                        disabled={pagination.currentPage === pagination.totalPages}
                        size={Button.Sizes.Small}
                        onClick={pagination.goToNextPage}
                        className="!p-2 rounded-lg"
                    >
                        <FontAwesomeIcon icon={faChevronRight} />
                    </Button.Text>
                </div>
            </div>
        </div>
    );
};

const Table = ({ children }: { children: ReactNode[] }) => {
    return (
        <div className={'relative overflow-hidden rounded-2xl border border-white/5 bg-zb-card/30 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:shadow-zb-glow/20'}>
            <div className={'py-1 bg-zb-gradient-horizontal opacity-50'}></div>
            <table className={'w-full text-sm text-left text-zb-text-dim'}>{children}</table>
        </div>
    );
};

export { Table, Header, HeaderItem, Body, BodyItem, PaginatedFooter };
