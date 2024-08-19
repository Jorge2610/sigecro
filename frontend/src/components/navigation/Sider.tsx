import SiderOption from "./SiderOption";

export default function Sider({
  isExpanded,
  setExpandedSider,
}: {
  isExpanded: boolean;
  setExpandedSider: any;
}) {
  const options = [
    {
      link: "/administrar-noticias",
      icon: "news",
      text: "Administrar noticias",
    },
    { link: "/roles", icon: "admin_panel_settings", text: "Roles" },
  ];

  const resetExpandedState = () => {
    setExpandedSider(false);
  };

  return (
    <div className="fixed top-[100px] md:top-[60px] z-10">
      <div
        className={
          isExpanded
            ? "absolute flex flex-col h-[100svh] w-[100svh] md:w-[240px]"
            : "absolute h-[100svh] md:flex md:flex-col w-[100svh] md:w-[60px] hidden"
        }
      >
        {options.map((option) => {
          return (
            <SiderOption
              key={option.text}
              link={option.link}
              icon={option.icon}
              text={option.text}
              expanded={isExpanded}
              resetExpanded={resetExpandedState}
            />
          );
        })}
        <div className="grow md:bg-sig-gray2" onClick={(e) => setExpandedSider(!isExpanded)}></div>
      </div>
      <div
        className={
          isExpanded
            ? "absolute md:min-h-[100svh] md:w-[calc(100svw-240px)] ms-[240px] backdrop-blur-[1.5px]"
            : ""
        }
        onClick={(e) => setExpandedSider(!isExpanded)}
      ></div>
    </div>
  );
}
