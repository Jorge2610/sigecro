import { NextRequest, NextResponse } from "next/server";
import api from "../../apiConfig";

const GET = async (request: NextRequest): Promise<NextResponse> => {
    const { searchParams } = new URL(request.url);
    const texto = searchParams.get('text');
    try {
        const response = await api.get("/ollama/summary",{
            params:{text:texto}
        });
        return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Falied response data" },
            { status: 500 }
        );
    }
};
export  {GET};