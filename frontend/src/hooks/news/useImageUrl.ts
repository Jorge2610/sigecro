const useImageUrl = (
    setImageUrl: (url: string) => void,
    getImage: () => any
) => {
    const handleUpdateUrl = (): void => {
        const image = getImage();
        if (image !== undefined) {
            setImageUrl(URL.createObjectURL(image));
        } else {
            setImageUrl("");
        }
    };

    return { handleUpdateUrl };
};

export { useImageUrl };
