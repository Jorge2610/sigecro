import { NextRequest, NextResponse } from "next/server";
import api from "@/app/api/apiConfig";

const POST = async (request: NextRequest) => {
    try {
        const formData = await request.formData();
        const res = await api.post("/news", formData);
        return NextResponse.json(
            { message: res.data.message },
            { status: res.status }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to submit data" },
            { status: 500 }
        );
    }
};

const GET = async (request: NextRequest) => {
    try {
        const res = await api.get("/news");
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

export { POST, GET };
