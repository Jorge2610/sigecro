"use client";

import { Search } from "@/components/ui/search";
import AdvancedSearch from "@/components/noticias/search/AdvancedSearch";
import ListNews from "@/components/ui/list-news";
import Filters from "@/components/noticias/search/Filters";
import SearchContainer from "@/components/noticias/search/SearchContainer";
import FilterAndSortControl from "@/components/noticias/search/FilterAndSortControl";
import { useNewsPage } from "@/hooks/news/useNewsPage";
import { PaginationNews } from "@/components/noticias/search/PaginationNews";
import { H4 } from "@/components/ui/headings";

const NewsPage = () => {
    const {
        totalPages,
        handlePageChange,
        page,
        setIsAdvacedSearch,
        isAdvancedSearch,
        advancedSearch,
        handleAdvancedSearch,
        handleSearch,
        viewList,
        isFilter,
        setIsFilter,
        handleFilter,
        handleSort,
        changeView,
        handleLimit,
        search,
        foundNews,
        news,
    } = useNewsPage();

    return (
        <>
            <SearchContainer
                setIsAdvanced={setIsAdvacedSearch}
                isAdvanced={isAdvancedSearch}
            >
                {isAdvancedSearch ? (
                    <AdvancedSearch
                        filters={advancedSearch}
                        onSearch={handleAdvancedSearch}
                    />
                ) : (
                    <Search
                        setSearch={handleSearch}
                        placeholder="Buscar noticias..."
                    />
                )}
            </SearchContainer>
            <FilterAndSortControl
                viewList={viewList}
                isFilters={isFilter}
                setFilters={setIsFilter}
                onAmountSubmit={handleLimit}
                onSortSubmit={handleSort}
                setViewList={changeView}
            />

            <div className="lg:flex lg:flex-col lg:gap-4 lg:w-full">
                <div className="lg:flex lg:flex-row lg:gap-4">
                    <Filters
                        isAdvanced={isAdvancedSearch}
                        setIsVisible={setIsFilter}
                        isVisible={isFilter}
                        onFilterSubmit={handleFilter}
                    />
                    <div className="flex flex-col gap-4 w-full">
                        {(search != "" || advancedSearch.length > 0) && (
                            <H4>Noticias encontradas: {" " + foundNews()}</H4>
                        )}
                        <ListNews news={news} viewList={viewList} />
                    </div>
                </div>
                <PaginationNews
                    totalPages={totalPages}
                    setPage={handlePageChange}
                    page={page}
                />
            </div>
        </>
    );
};

export default NewsPage;
