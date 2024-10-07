import { NextRequest, NextResponse } from "next/server";
import api from "@/app/api/apiConfig";

const GET = async (request: NextRequest) => {
    try {
        const response = await api.get("/news/tags");
        return NextResponse.json(response.data, { status: 200 });
       
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to submit data" },
            { status: 500 }
        );
    }
};
export { GET };
