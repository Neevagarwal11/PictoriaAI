import AccountForm from "@/components/account/AccountForm";
import React from "react";

function AccountSettingsPage() {
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
    <AccountForm />      

      {/* Security Setting Component */}
      </div>


    </section>
  );
}

export default AccountSettingsPage;
