import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(_request: Request, { params }: { params: Promise<{ assetId: string }> }) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return Response.json({ error: "Course database is not configured." }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Authentication required." }, { status: 401 });
  const { assetId } = await params;
  const { data: asset, error } = await supabase.from("course_assets").select("storage_path").eq("id", assetId).eq("asset_type", "audio").single();
  if (error || !asset) return Response.json({ error: "Audio not found." }, { status: 404 });
  const { data: signed, error: signedError } = await supabase.storage.from("course-media").createSignedUrl(asset.storage_path, 60 * 10);
  if (signedError || !signed?.signedUrl) return Response.json({ error: "Audio is temporarily unavailable." }, { status: 502 });
  return Response.redirect(signed.signedUrl, 307);
}
