"use client";
import React from "react";
import { useState } from "react";
import LoginForm from "./LoginForm";
import { Button } from "../ui/button";
import SignupForm from "./SignupForm";
import { Link } from "lucide-react";
import ResetForm from "./ResetForm";

function authForm({state} : {state:string}) {
  const [mode, setMode] = useState("login");

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {mode === "reset"
            ? "Reset Password"
            : mode === "login"
            ? "Login"
            : "Sign Up"}
        </h1>

        <p className="text-sm text-muted-foreground">
          {mode === "reset"
            ? "Enter Your Email Below to Reset Password"
            : mode === "login"
            ? "Enter Your Email Below to Login Your Account"
            : "Enter Your Information Below to Create Your Account"}
        </p>
      </div>

      {mode === "login" && (
        <>
          <LoginForm />
          <div className="text-center flex justify-between">
            <Button
              variant={"link"}
              className="p-0"
              onClick={() => setMode("signup")}
            >
              Need an Account? SignUp
            </Button>
            <Button
              variant={"link"}
              className="p-0"
              onClick={() => setMode("reset")}
            >
              Forgot Password?
            </Button>
          </div>
        </>
      )}

      {mode === "signup" && (
        <>
          <SignupForm></SignupForm>
          <div className="text-center ">
            <Button
              variant={"link"}
              className="p-0"
              onClick={() => setMode("login")}
            >
              Already Have An Account? Login
            </Button>
          </div>

          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking Sign Up, you agree to our <br />{" "}
            <a
              href="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms & Conditions
            </a>{" "}
            and our{" "}
            <a
              href="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </a>
          </p>
        </>
      )}

      {mode === "reset" && (
        <>
          <ResetForm />
          <div className="text-center ">
            <Button
              variant={"link"}
              className="p-0"
              onClick={() => setMode("login")}
            >
              Back to Login
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default authForm;
