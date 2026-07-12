import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// In a real app, you would import Resend and send the email here
// import { Resend } from 'resend';
// const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

    // Validate cron secret to prevent unauthorized triggers
    const authHeader = req.headers.get("Authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      // In development, we can bypass this for testing if no CRON_SECRET is set
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    // 1. Fetch all users who have opted into weekly emails
    const { data: users, error: usersError } = await supabase
      .from("profiles")
      .select("id, email, weekly_email")
      .eq("weekly_email", true);

    if (usersError || !users) {
      throw new Error("Failed to fetch users");
    }

    let emailsSent = 0;

    // 2. For each user, generate their personal error digest and send
    for (const user of users) {
      const { data: brief } = await supabase.rpc("get_daily_brief", { target_user_id: user.id });
      
      if (!brief || !brief.error_patterns || brief.error_patterns.length === 0) {
        continue; // Skip if no errors this week
      }

      const topErrors = brief.error_patterns.slice(0, 3);
      
      // Construct email content (Stub for now)
      const htmlContent = `
        <h1>Your IELTS Weekly Digest</h1>
        <p>Here are the top 3 mistakes you made this week. Reviewing these is the fastest way to improve your band score.</p>
        <ul>
          ${topErrors.map((e: any) => `<li><b>${e.skill} - ${e.error_type}</b> (${e.occurrences} times)</li>`).join("")}
        </ul>
        <p>Keep up the great work on your Band 7 Path!</p>
      `;

      // Mock sending email
      console.log(`[Email Stub] Sending digest to user ${user.id}...`);
      // await resend.emails.send({
      //   from: 'IELTS Band 7 Path <learning@ieltsband7path.com>',
      //   to: [user.email],
      //   subject: 'Your Weekly Error Pattern Digest',
      //   html: htmlContent,
      // });
      
      emailsSent++;
    }

    return NextResponse.json({ success: true, emailsSent });
  } catch (error: any) {
    console.error("Weekly digest error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
