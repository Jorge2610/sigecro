import { NextRequest, NextResponse } from "next/server";
import api from "@/app/api/apiConfig";

const GET = async (request: NextRequest) => {
    try {
        const res = await api.get("/news/all_sources");
        console.log(res.data)
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
