import { NextRequest, NextResponse } from "next/server";
import api from "@/services/apiConfig";

const POST = async (request: NextRequest) => {
    try {
        const data = await request.json();
        const res = await api.post("/news/scraping/batch", {
            urls: data.urls,
            user_id: data.user_id,
            category_id: data.category_id,
        });
        return NextResponse.json(res.data, { status: res.status });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to submit data" },
            { status: 500 }
        );
    }
};

const DELETE = async (request: NextRequest) => {
    try {
        const data = await request.json();
        const res = await api.delete("/news/scraping/batch", {
            data: { ids: data.ids },
        });
        return NextResponse.json({ status: res.status });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to submit data" },
            { status: 500 }
        );
    }
};

export { POST, DELETE };
