import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { jobposition, jobdescription, duration, useremail, questionlist } = body;

        if (!jobposition || !jobdescription || !duration || !useremail || !questionlist) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const interview_id = crypto.randomUUID(); // Generate UUID

        const interview = await db?.interview.create({
            data: {
                interview_id,
                jobposition,
                jobdescription,
                duration,
                useremail,
                questionlist,
            },
        });

        return NextResponse.json({
            message: 'Interview created successfully',
            interview_id, // Include UUID in the response
            interview,
        });

    } catch (error: any) {
        console.error('Create interview error:', error);
        return NextResponse.json(
            { error: `Failed to create interview: ${error.message || 'Unknown error'}` },
            { status: 500 }
        );
    }
}
