import RegisterCard from "@/components/noticias/RegisterCard";
import registerCardData from "@/data/registerCards";

const RegisterCardList = () => {
    return registerCardData.map((type, i) => {
        return (
            <RegisterCard
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

export default RegisterCardList;
