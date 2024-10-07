import { NextRequest, NextResponse } from "next/server";
import api from "@/app/api/apiConfig";

const GET = async (request: NextRequest) => {
    console.log("Holas b" + request.nextUrl.searchParams.get("sort"));
    try {
        const filters = request.nextUrl.searchParams.get("filters");

        if (
            request.nextUrl.searchParams.get("filters") != null &&
            filters != "[]"
        ) {
            const res = await api.get("/news/advancedSearch", {
                params: {
                    filters: request.nextUrl.searchParams.get("filters"),
                    page: request.nextUrl.searchParams.get("page"),
                    limit: request.nextUrl.searchParams.get("limit"),
                    sort_order: request.nextUrl.searchParams.get("sort"),
                    categories:
                        request.nextUrl.searchParams.get("filterCategories"),
                    start_date:
                        request.nextUrl.searchParams.get("filterDateStart"),
                    end_date: request.nextUrl.searchParams.get("filterDateEnd"),
                    sources: request.nextUrl.searchParams.get("filterSources"),
                    filter_tags: request.nextUrl.searchParams.get("filterTags"),
                },
            });

            return NextResponse.json({
                status: res.status,
                data: res.data,
            });
        }

        const res = await api.get("/news/search", {
            params: {
                search: request.nextUrl.searchParams.get("search"),
                page: request.nextUrl.searchParams.get("page"),
                limit: request.nextUrl.searchParams.get("limit"),
                sort_order: request.nextUrl.searchParams.get("sort"),
                categories:
                    request.nextUrl.searchParams.get("filterCategories"),
                start_date: request.nextUrl.searchParams.get("filterDateStart"),
                end_date: request.nextUrl.searchParams.get("filterDateEnd"),
                sources: request.nextUrl.searchParams.get("filterSources"),
                filter_tags: request.nextUrl.searchParams.get("filterTags"),
            },
        });

        return NextResponse.json({
            status: res.status,
            data: res.data,
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to submit data" },
            { status: 500 }
        );
    }
};

export { GET };
