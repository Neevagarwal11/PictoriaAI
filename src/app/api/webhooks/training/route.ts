import { NextResponse } from "next/server";
import Replicate from "replicate";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/email-templates/emailTemplate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  console.log("Webhook is working", req);

  try {
    const body = await req.json();
    console.log("Webhook is working", body);
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId") ?? "";
    const modelName = url.searchParams.get("modelName") ?? "";
    const fileName = url.searchParams.get("fileName") ?? "";

    const id = req.headers.get("webhook-id") ?? "";
    const timestamp = req.headers.get("webhook-timestamp") ?? "";
    const webhookSignature = req.headers.get("webhook-signature") ?? "";

    const signedContent = `${id}.${timestamp}.${JSON.stringify(body)}`;

    const secret = await replicate.webhooks.default.secret.get();

    const secretBytes = Buffer.from(secret.key.split("_")[1], "base64");
    const signature = crypto
      .createHmac("sha256", secretBytes)
      .update(signedContent)
      .digest("base64");
    console.log(signature);

    const expectedSignatures = webhookSignature
      .split(" ")
      .map((sig) => sig.split(",")[1]);
    const isValid = expectedSignatures.some(
      (expectedSignature) => expectedSignature === signature
    );
    // console.log(isValid); OK

    if (!isValid) {
      return new NextResponse("Invalid Signature", { status: 401 });
    }

    // get user Data

    const { data: userData, error: userError } =
      await supabaseAdmin.auth.admin.getUserById(userId);

    if (userError || !userData) {
      return new NextResponse("User Not Found", { status: 401 });
    }

    const userEmail = userData.user.email ?? "";
    const userName = userData.user.user_metadata.full_name ?? "";

    if (body.status === "succeeded") {
      //send a successful status email
      await resend.emails.send({
        from: "Pictoria Ai <onboarding@resend.dev>",
        to: [userEmail],
        subject: "Model Training Completed",
        react: EmailTemplate({
          userName,
          message: "Your Model Training has been completed.",
        }),
      });

      //Update supabase models tables
      await supabaseAdmin
        .from("models")
        .update({
          training_status: body.status,
          training_time: body.metrics?.total_time ?? null,
          version: body.output?.version.split(":")[1] ?? null,
        })
        .eq("user_id", userId)
        .eq("model_name", modelName);

        

    } else {
      // handel the failed and the cancelled status
       await resend.emails.send({
        from: "Pictoria Ai <onboarding@resend.dev>",
        to: [userEmail],
        subject: `Model Training ${body.status}`,
        react: EmailTemplate({
          userName,
          message: `Your model has been ${body.status}`,
        }),
      });

      //Update supabase models tables
      await supabaseAdmin
        .from("models")
        .update({
          training_status: body.status,
          version: body.version ?? null,
        })
        .eq("user_id", userId)
        .eq("model_name", modelName);
    }

    //Getting Old credits
      const {data:oldCredits , error} = await supabaseAdmin.from('credits').select('model_training_count').eq('user_id' , userId).single();
      if(error){
      throw new Error("Error getting user credits!")
      }

      //Updating credits
    await supabaseAdmin.from('credits').update({model_training_count : oldCredits?.model_training_count+1}).eq('user_id', userId).single()


    //delete the training data from supabase storage
    await supabaseAdmin.storage.from("training-data").remove([`${fileName}`]);

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.log("Webhook Processing Error", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
