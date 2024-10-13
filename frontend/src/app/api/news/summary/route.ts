import { NextRequest, NextResponse } from "next/server";
import api from "../../../../services/apiConfig";

const POST = async (request: NextRequest): Promise<NextResponse> => {
    const data = await request.json();
    try {
        const response = await api.post("/ollama/summary", {
            content: data.content,
        });
        return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Falied response data" },
            { status: 500 }
        );
    }
};
export { POST };
