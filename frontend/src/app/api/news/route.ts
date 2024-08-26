import { NextRequest, NextResponse } from "next/server";
import api from "@/app/api/apiConfig";

export async function POST(request: NextRequest) {
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
}
