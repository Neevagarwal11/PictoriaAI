import AccountForm from "@/components/account/AccountForm";
import { getUser } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import React from "react";
import SecuritySetting from "@/components/account/SecuritySetting";


async function AccountSettingsPage() {

  const supabase = await createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const user = await getUser(supabase);

  if(!user){
    return redirect('/login');
  }



  return (
    <section className="container mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid gap-8">

      {/* Account Form */}
    <AccountForm user = {user}/>      

      {/* Security Setting Component */}
      <SecuritySetting user={user} />


      </div>


    </section>
  );
}

export default AccountSettingsPage;
