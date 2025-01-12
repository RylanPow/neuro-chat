import './signInPage.css'
import { SignIn } from '@clerk/clerk-react'
const SignInPage = () => {
    return (
        <div className="signInPage">
            <SignIn path = "/sign-in" routing="path" />
        </div>
    )
}

export default SignInPage