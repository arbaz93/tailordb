import { HomeIcon, SearchIcon, UserIcon } from "~/icons/nav/NavigationIcons";
type CategoryBtn = {
    text: string;
    css: string;
    active: boolean;
};

const categorieBtns: CategoryBtn[] = [
    {
        text: 'All',
        css: '',
        active: true
    },
    {
        text: 'Male',
        css: '',
        active: false
    },
    {
        text: 'Female',
        css: '',
        active: false
    },
];

type NavigationItem = {
    text: string;
    url: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    active: boolean;
};
type NavigationItems = Record<string, NavigationItem>;

const navigationItems: NavigationItems = {
    search: {
        text: 'search',
        url: '/search',
        icon: SearchIcon,
        active: true,
    },
    home: {
        text: 'home',
        url: '/',
        icon: HomeIcon,
        active: true,
    },
    about: {
        text: 'about',
        url: '/about',
        icon: UserIcon,
        active: true,
    },
  };
 
const AUTH_COOKIE = 'auth_session'


export type { NavigationItems, CategoryBtn }
export { navigationItems, categorieBtns, AUTH_COOKIE }