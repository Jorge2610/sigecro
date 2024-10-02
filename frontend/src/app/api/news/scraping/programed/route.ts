import { NextRequest, NextResponse } from "next/server";
import api from "@/app/api/apiConfig";

const POST = async (request: NextRequest) => {
    try {
        const data = await request.json();
        const res = await api.post("/news/scraping/programed", {
            data: data,
        });
        return NextResponse.json({ status: res.status });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to submit data" },
            { status: 500 }
        );
    }
};

export { POST };