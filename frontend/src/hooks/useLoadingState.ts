import { useState } from "react";

const useLoadignState = (request: () => Promise<void>) => {
    const [loading, setLoading] = useState(false);

    const handleLoagindState = async () => {
        setLoading(true);
        await request();
        setLoading(false);
    };

    return { loading, handleLoagindState };
};

export { useLoadignState };
