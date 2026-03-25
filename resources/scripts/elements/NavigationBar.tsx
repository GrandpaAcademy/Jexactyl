import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faHeart, faIdBadge } from '@fortawesome/free-solid-svg-icons';
import { useStoreState } from '@/state/hooks';
import SearchContainer from '@account/search/SearchContainer';
import tw from 'twin.macro';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/outline';
import { useActivityLogs } from '@/api/routes/account/activity';
import Spinner from '@/elements/Spinner';
import { formatDistanceToNow } from 'date-fns';

const RightNavigation = styled.div`
    & > a,
    & > button,
    & > div,
    & > .navigation-link {
        ${tw`flex items-center h-full no-underline text-zb-text-dim px-6 cursor-pointer transition-all duration-300 gap-x-2`};
        ${tw`font-medium hover:text-white hover:bg-white/5`};

        &:active,
        &:hover,
        &.active {
            box-shadow: inset 0 -2px var(--zb-accent);
            ${tw`text-zb-accent shadow-zb-glow`};
        }
    }
`;

const NavigationBar = () => {
    const [width, setWidth] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    const location = useLocation();
    const user = useStoreState(state => state.user.data!);
    const activityEnabled = useStoreState(state => state.settings.data!.activity.enabled.account);
    const { data } = useActivityLogs({ page: 1 }, { revalidateOnMount: true, revalidateOnFocus: false });

    const pathnames = location.pathname.split('/').filter(Boolean);

    useEffect(() => {
        const interval = setInterval(() => {
            setWidth(prev => {
                if (prev >= 80) {
                    setCurrentPage(p => (p + 1) % 3);
                    return 0;
                }
                return prev + 1;
            });
        }, 75);
        return () => clearInterval(interval);
    }, []);

    const renderBreadcrumbs = () => (
        <ol className="w-1/3 text-zb-text-dim text-sm inline-flex space-x-2 items-center">
            <Link to={'/'}>
                <HomeIcon className="w-4 h-4 my-auto text-zb-accent brightness-125 hover:brightness-150 transition-all" />
            </Link>
            {pathnames.map((segment, index) => {
                const href = `/${pathnames.slice(0, index + 1).join('/')}`;
                return (
                    <li key={index} className="inline-flex items-center">
                        <ChevronRightIcon className="mx-2 w-3 h-3 my-auto opacity-50" />
                        {index === pathnames.length - 1 ? (
                            <span className="capitalize text-zb-text font-medium">{segment}</span>
                        ) : (
                            <Link to={href} className="capitalize hover:text-zb-accent transition-all">
                                {segment}
                            </Link>
                        )}
                    </li>
                );
            })}
        </ol>
    );

    const renderPageContent = () => {
        switch (currentPage) {
            case 0:
                return (
                    <div className="flex items-center gap-x-2 text-sm">
                        <FontAwesomeIcon icon={faEye} className="text-zb-accent" />
                        {!data || !activityEnabled ? (
                            <Spinner size="small" centered />
                        ) : (
                            <>
                                <span className="font-bold text-zb-text">{data.items[0]?.event}</span>
                                <span className="text-zb-muted text-xs">
                                    {formatDistanceToNow(data.items[0]?.timestamp ?? new Date(), {
                                        includeSeconds: true,
                                        addSuffix: true,
                                    })}
                                </span>
                            </>
                        )}
                    </div>
                );
            case 1:
                return (
                    <div className="flex items-center gap-x-2 text-sm">
                        <FontAwesomeIcon icon={faHeart} className={user.useTotp ? 'text-zb-success' : 'text-zb-danger'} />
                        <span className="text-zb-text">2FA is {user.useTotp ? 'Enabled' : 'Disabled'}</span>
                    </div>
                );
            case 2:
                return (
                    <div className="flex items-center gap-x-2 text-sm">
                        <FontAwesomeIcon icon={faIdBadge} className="text-zb-accent-2" />
                        <span className="text-zb-text">User ID: <span className="font-mono text-zb-accent">{user.uuid.slice(0, 8)}</span></span>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="w-full overflow-x-auto bg-zb-bg/60 backdrop-blur-xl border-b border-white/5 mb-8 sticky top-0 z-40">
            <div className="px-8 flex h-[3.5rem] w-full items-center">
                {renderBreadcrumbs()}
                <RightNavigation className="flex h-full items-center justify-center ml-auto">
                    <div className="relative h-full flex items-center px-4">
                        <div
                            className="absolute bottom-0 left-0 h-[2px] bg-zb-accent shadow-zb-glow transition-all duration-[250ms] ease-in-out"
                            style={{
                                width: `${width}%`,
                            }}
                        />
                        <div className={'hidden lg:block'}>{renderPageContent()}</div>
                    </div>
                    <SearchContainer />
                </RightNavigation>
            </div>
        </div>
    );
};

export default NavigationBar;
