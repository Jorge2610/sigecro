import { NextRequest, NextResponse } from "next/server";
import api from "@/app/api/apiConfig";

const GET = async (request: NextRequest) => {
    try {
        console.log(request);
        const filters = request.nextUrl.searchParams.get("filters");
        console.log("filters  ; " + filters);

        if (
            request.nextUrl.searchParams.get("filters") != null &&
            filters != "[]"
        ) {
            const res = await api.get("/news/advancedSearch", {
                params: {
                    filters: request.nextUrl.searchParams.get("filters"),
                    page: request.nextUrl.searchParams.get("page"),
                    limit: request.nextUrl.searchParams.get("limit"),
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
            },
        });
        console.log(res.data);
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
