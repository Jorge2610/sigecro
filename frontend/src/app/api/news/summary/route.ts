import { NextRequest, NextResponse } from "next/server";
import api from "../../../../services/apiConfig";

const GET = async (request: NextRequest): Promise<NextResponse> => {
    const { searchParams } = new URL(request.url);
    const texto = searchParams.get('text');
    try {
        const response = await api.get("/ollama/summary",{
            params:{text:texto}
        });
        console.log(response.data.summary);
        return NextResponse.json(response.data.summary, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Falied response data" },
            { status: 500 }
        );
    }
};
export  {GET};