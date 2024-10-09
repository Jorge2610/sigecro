import { NextRequest, NextResponse } from "next/server";
import api from "@/services/apiConfig";

const GET = async (request: NextRequest) => {
    try {
        const res = await api.get("/news/all_sources");  
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
