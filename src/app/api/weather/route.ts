import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const address = searchParams.get("address");
        const latitude = searchParams.get("lat");
        const longitude = searchParams.get("lon");

        let url = "";
        if (address) {
            url = `https://api.openweathermap.org/data/2.5/weather?q=${address}&appid=e017201a221852f784daf248eae3f92e`;
        } else if (latitude && longitude) {
            url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=e017201a221852f784daf248eae3f92e`;
        } else {
            throw new Error("Invalid request parameters. Please provide either 'address' or 'lat' and 'lon'.");
        }

        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Failed to fetch weather data. Status: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        return NextResponse.json({ data });
    } catch (error:any) {
        console.log(
            error.message
        )
    }
}
