import CardRegister from "@/components/noticias/CardRegister";
import registerCardData from "@/data/registerCards";

const ListCardRegister = () => {
    return registerCardData.map((type, i) => {
        return (
            <CardRegister
                key={i}
                icon={type.icon}
                title={type.title}
                description={type.description}
                href={type.href}
                buttonText={type.buttonText}
                secondHref={type.secondHref}
                secondButtonText={type.secondButtonText}
            />
        );
    });
};

export default ListCardRegister;
