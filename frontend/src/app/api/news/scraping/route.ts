import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const res = await axios.post(process.env.API_HOST + "/news/scraping", {
            url: data.url,
        });
        return NextResponse.json(res.data, { status: res.status });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to submit data" },
            { status: 500 }
        );
    }
}
