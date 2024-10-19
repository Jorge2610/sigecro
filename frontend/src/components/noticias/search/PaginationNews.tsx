import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { usePaginationNews } from "@/hooks/news/useNewsPage";

interface PaginationNewsProps {
    totalPages: number;
    setPage: (value: number) => void;
    page: number;
}
const PaginationNews = ({ totalPages, setPage, page }: PaginationNewsProps) => {
    const { handlePageChange } = usePaginationNews(setPage);

    const renderPaginationItems = (): React.JSX.Element[] => {
        let items = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            onClick={() => handlePageChange(i)}
                            isActive={page === i}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        } else {
            const leftBound = Math.max(
                1,
                page - Math.floor(maxVisiblePages / 2)
            );
            const rightBound = Math.min(
                totalPages,
                leftBound + maxVisiblePages - 1
            );

            if (leftBound > 1) {
                items.push(
                    <PaginationItem key={1}>
                        <PaginationLink onClick={() => handlePageChange(1)}>
                            1
                        </PaginationLink>
                    </PaginationItem>
                );
                if (leftBound > 2) {
                    items.push(<PaginationEllipsis key="leftEllipsis" />);
                }
            }

            for (let i = leftBound; i <= rightBound; i++) {
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            onClick={() => handlePageChange(i)}
                            isActive={page === i}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }

            if (rightBound < totalPages) {
                if (rightBound < totalPages - 1) {
                    items.push(<PaginationEllipsis key="rightEllipsis" />);
                }
                items.push(
                    <PaginationItem key={totalPages}>
                        <PaginationLink
                            onClick={() => handlePageChange(totalPages)}
                        >
                            {totalPages}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        }

        return items;
    };

    return (
        <Pagination>
            <PaginationContent>
                {page > 1 && (
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() =>
                                handlePageChange(Math.max(1, page - 1))
                            }
                        />
                    </PaginationItem>
                )}
                {renderPaginationItems()}
                {page < totalPages && (
                    <PaginationItem>
                        <PaginationNext
                            onClick={() =>
                                handlePageChange(Math.min(totalPages, page + 1))
                            }
                        />
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    );
};

export { PaginationNews };
