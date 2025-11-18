import { NextResponse } from "next/server";
import axios, { Method } from "axios";

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_PLIA_BACKEND_BASE_URL!;

export async function POST(request: Request) {
  try {
    const { endpoint, method = "POST", body } = await request.json();

    const url = `${BACKEND_BASE_URL}${endpoint}`;

    const response = await axios.request({
      url,
      method: method as Method,
      data: body,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.PLIA_BACKEND_APIKEY!,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    console.error(
      "🔴 Error en proxy:",
      axios.isAxiosError(error) ? error.response?.data || error.message : error
    );

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      {
        status: axios.isAxiosError(error) ? error.response?.status || 500 : 500,
      }
    );
  }
}
