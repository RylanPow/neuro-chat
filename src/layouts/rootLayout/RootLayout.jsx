import { Link, Outlet } from "react-router-dom";
import './rootLayout.css'
import { ClerkProvider, SignedOut, Signin, SignedIn, SignInButton, UserButton } from "@clerk/clerk-react";


const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY //how to import .env variables without exposure

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}


const RootLayout = () => {
    return (
        <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <div className="rootLayout">
            <header>
                <Link to = "/" className="logo">
                    <img src="/logo.png" alt="" />
                    <span>NeuroChat</span>
                </Link>

                <div className = "user">
                    <SignedOut>
                        <SignInButton/>
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
                </header>
            <main>
                <Outlet/>
            </main>
            </div>
        </ClerkProvider>
    );
};

export default RootLayout;