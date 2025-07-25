import {
    Input,
    Checkbox,
    Button,
    Typography,
} from "@material-tailwind/react";
import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import {login} from "@/api/authApi.js";

export function SignIn() {

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        try {
            const response = await login(email, password);
            const { token, user } = response.data;
            localStorage.setItem("accessToken", token);
            localStorage.setItem("user", JSON.stringify(user));
            if(user.role === "ADMIN"){
                navigate("/dashboard/users/learner");
            }else if(user.role === "LEARNER"){
                localStorage.removeItem("accessToken");
                localStorage.removeItem("user");
                navigate("/dashboard/auth/sign-in");
            }
            console.log("Login successfully!");
        } catch (error) {
            console.error("Đăng nhập thất bại:", error.response?.data || error.message);
            alert("Email or password is incorrect!");
        }
    };


    return (
        <section className="min-h-screen flex items-center justify-center bg-blue-50 p-8">
            <div className="w-full max-w-4xl flex flex-col items-center justify-center lg:w-3/5">
                <div className="text-center">
                    <Typography variant="h2" className="font-bold mb-4 text-blue-700">Sign In</Typography>
                    <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">
                        Enter your email and password to Sign In.
                    </Typography>
                </div>

                <form className="mt-8 mb-2 w-80 max-w-screen-lg lg:w-1/2">
                    <div className="mb-1 flex flex-col gap-6">
                        <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                            Your email
                        </Typography>
                        <Input
                            onChange={(e) => setEmail(e.target.value)}
                            size="lg"
                            placeholder="name@mail.com"
                            className="!border-t-blue-300 focus:!border-t-blue-600"
                            labelProps={{ className: "before:content-none after:content-none" }}
                        />

                        <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                            Password
                        </Typography>
                        <Input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            size="lg"
                            placeholder="********"
                            className="!border-t-blue-300 focus:!border-t-blue-600"
                            labelProps={{ className: "before:content-none after:content-none" }}
                        />
                    </div>

                    <Checkbox
                        label={
                            <Typography
                                variant="small"
                                color="gray"
                                className="flex items-center justify-start font-medium"
                            >
                                I agree to the&nbsp;
                                <a
                                    href="#"
                                    className="font-normal text-blue-600 transition-colors hover:text-blue-800 underline"
                                >
                                    Terms and Conditions
                                </a>
                            </Typography>
                        }
                        containerProps={{ className: "-ml-2.5" }}
                    />

                    <Button
                        onClick={() => handleSubmit()}
                        className="mt-6 bg-blue-600 hover:bg-blue-700"
                        fullWidth
                    >
                        Sign In
                    </Button>
                </form>
            </div>
        </section>
    );
}

export default SignIn;
