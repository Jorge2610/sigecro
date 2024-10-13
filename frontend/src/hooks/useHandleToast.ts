import { useToast } from "@/components/ui/use-toast";
import { toastMessages } from "@/data/newsMessages";

const useHandleToast = () => {
    const { toast } = useToast();

    /**
     * Displays a toast notification with a success or error message.
     *
     * @param {boolean} success - Indicates whether the toast is for a successful operation (true) or an error (false).
     * @param {string} [description] - (Optional) Custom description for the toast. If not provided, a default message will be used based on the success flag.
     * @returns {void}
     */
    const showToast = (success: boolean, description?: string): void => {
        let message = description;
        if (!message) {
            message = success
                ? toastMessages.successDesc
                : toastMessages.errorDesc;
        }
        toast({
            title: success
                ? toastMessages.successTitle
                : toastMessages.errorTitle,
            description: message,
            variant: success ? "default" : "destructive",
        });
    };

    return { showToast };
};

export { useHandleToast };
