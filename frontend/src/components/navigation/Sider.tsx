import SiderOption from "./SiderOption";

export default function Sider({ isExpanded, setExpandedSider }: { isExpanded: boolean, setExpandedSider: any }) {

    const options = [
        { link: '/', icon: 'news', text: 'Noticias' },
    ];

    return (
        <div>
            <div className={isExpanded ?
                'flex flex-col z-10 absolute w-full md:h-[calc(100svh-60px)] flex-col bg-sig-gray2 md:block md:w-[240px]' :
                'flex flex-col z-10 absolute w-full md:h-[calc(100svh-60px)] flex-col bg-sig-gray2 md:block md:w-[60px] hidden'}>
                {options.map(option => {
                    return (
                        <SiderOption key={option.text} link={option.link} icon={option.icon} text={option.text} expanded={isExpanded} />
                    );
                })}
            </div>
            <div className={isExpanded ? 'z-10 absolute md:h-[calc(100svh-60px)] md:w-[calc(100svw-240px)] ms-[240px] backdrop-blur-[2px]' : ''}
                onClick={e => setExpandedSider(!isExpanded)}></div>
        </div>
    );
}