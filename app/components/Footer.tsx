import { type Dispatch, type SetStateAction } from 'react';
import { Link } from 'react-router'
import { navigationItems, type NavigationItems } from '~/utils/constants'
type FooterProps = {
    activeTab: string;
    setActiveTab: Dispatch<SetStateAction<string>>;
}
export default function Footer({ activeTab, setActiveTab }: FooterProps) {
    return (
        <footer className='flex w-full items-center justify-center bg-background h-12 fixed bottom-0 border-t border-border-clr'>
            {
                Object.values(navigationItems).map(
                    (item) => {
                        const { text, url, icon: Icon } = item;
                        return (
                            <Link
                                key={text}
                                to={url}
                                onClick={() => setActiveTab(text)}
                                className={"cursor-pointer h-full flex-1 flex justify-center items-center "  + (activeTab === text ? ' border-t-2 border-primary ' : ' ')}
                            >
                                <Icon className={"w-6 " + (activeTab === text ? ' fill-primary ' : ' fill-clr-100 opacity-70  ')} />
                            </Link>
                        );
                    }
                )

            }
        </footer>
    )
}
