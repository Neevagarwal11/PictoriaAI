import React from "react";
import AuthImg from "@/public/Abstract Curves and Colors.jpeg";
import Image from "next/image";
import Logo from "@/components/Logo";
import AuthForm from "@/components/authentication/authForm";


interface searchParams{
  state? : string
}

async function AuthenticationPage({searchParams} : {searchParams : Promise<searchParams>}) {

  const {state} = await searchParams
  // console.log(state)  OK


  return (
    <main className="h-screen grid grid-cols-1  lg:grid lg:grid-cols-2  absolute" >

      <div className="relative w-full  flex flex-col order-2 lg:order-1 md:order-1 bg-muted text-primary-foreground">
        <div className="w-full h-[30%] bg-gradient-to-t from-transparent to-black/50 absolute top-0 left-0 z-20"/>
        <div className="w-full h-[40%] bg-gradient-to-b from-transparent to-black/50 absolute bottom-0 left-0 z-20"/>

        <Image
          src={AuthImg}
          alt="login img"
          className="w-full h-full object-cover"
        />

        <div className="absolute z-20 p-10 flex items-center">
          <Logo />
        </div>

        <div className="absolute p-10 w-[95%] bottom-2 text-md  z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg ">
              &ldquo; Pictoria AI is a game changer for me. I have been able to
              generate high quality professional headshots within minutes. It
              has saved me countless hours of work and cost as well. &rdquo;
            </p>
            <footer className="text-sm">David S</footer>
          </blockquote>
        </div>

      </div>

      <div className="relative flex flex-col w-full items-center order-1 lg:order-2 justify-center p-8 h-full">
        <div className="w-[350px] max-w-xl mx-auto">
        <AuthForm state={state?? "login"}/>

        </div>
      </div>
    </main>
  );
}

export default AuthenticationPage;
