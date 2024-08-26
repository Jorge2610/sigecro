import { NextRequest, NextResponse } from "next/server";
import api from "@/app/api/apiConfig";

const GET = async (request: NextRequest): Promise<NextResponse> => {
    try {
        const response = await api.get("/categories");
        console.log(response.data.rows);
        return NextResponse.json(response.data.rows, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to submit data" },
            { status: 500 }
        );
    }
};

export { GET };
