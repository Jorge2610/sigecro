import SiderOption from "./SiderOption";

export default function Sider({
  isExpanded,
  setExpandedSider,
}: {
  isExpanded: boolean;
  setExpandedSider: any;
}) {
  const options = [{ link: "/", icon: "news", text: "Noticias" }];

  return (
    <div className="fixed top-[60px] z-10">
      <div
        className={
          isExpanded
            ? "flex absolute w-full md:min-h-[100svh] flex-col bg-sig-gray2 md:block md:w-[240px]"
            : "flex absolute w-full md:min-h-[100svh] flex-col bg-sig-gray2 md:block md:w-[60px] hidden"
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
            />
          );
        })}
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
