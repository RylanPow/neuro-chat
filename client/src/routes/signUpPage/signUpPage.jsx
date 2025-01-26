import './signUpPage.css'
import { SignUp } from '@clerk/clerk-react'

const SignUpPage = () => {
    return (
        <div className="signUpPage">
            <SignUp path ="/sign-up" signInUrl = '/sign-in' forcedRedirectUrl = '/dashboard' />
        </div>
    );
};
export default SignUpPage;