// returns student details for all students in the batch with that subject

import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function GET(request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { batch_id } = await request.json();

        const students = await prisma.batch.findUnique({
            where: {
                id: batch_id,
            },
            include: {
                students: {
                    include: {
                        attendance: true,
                    },
                },
            },
        });

        return NextResponse.json(students, { status: 200 });
    } catch (error) {
        console.error("Error fetching student details:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}