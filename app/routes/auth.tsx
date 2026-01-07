import React from "react";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { handleLogin } from "~/auth/auth";
import { useLoginStore } from "../zustand/loginStore"
import Cookies from "js-cookie";
import { base64Decode } from "../utils/scripting";
import { Spinner } from "../components";

type FormInputs = {
    username: string,
    password: string
}
type FormProps = {
    method: string;
    className: string;
    children: React.ReactNode;
    loginInputs: FormInputs;
};

function Form({ method, className, children, loginInputs }: FormProps) {
    const setLoginInfo = useLoginStore(state => state.setLoginInfo)
    const handleSubmit = async (event: React.FormEvent) => {
            event.preventDefault();
            const request = await handleLogin(loginInputs, setLoginInfo);
    };

    return (
        <form method={method} className={className} onSubmit={handleSubmit}>
            {children}
        </form>
    );
}


export default function LoginPage() {
    const [formInputs, setFormInputs] = useState({
        username: "",
        password: "",
    });
    const loginInfo = useLoginStore(state => state.loginInfo)
    const setLoginInfo = useLoginStore(state => state.setLoginInfo)
    const navigate = useNavigate();

    // when Cookie exist and is allowed then go to homepage
    useEffect(() => {
        const CookieLogStatus = Cookies.get("t000") ? JSON.parse(base64Decode(Cookies.get("t000"))).status : false;
        if (CookieLogStatus == '200') {
            navigate('/');
            setLoginInfo((prev: any) => {return {...prev, status:'200', statusMessage: 'signed in'}})
}
    }, [])
    // when login status changes it will check if true go to home page
    useEffect(() => {
        if (loginInfo.status === '200') {
            setLoginInfo((prev: any) => {return {...prev, status:'200', statusMessage: 'signed in'}})
            navigate('/');
        }
    }, [loginInfo.status])



    return (
        <section className="flex justify-between items-center flex-col h-screen bg-splash-screen font-sans">
            <div className="flex justify-center items-center flex-col flex-1 gap-2">
                <h1 className={'text-small-initial ff-montserrat ml-2 text-clr-200/80'}><span className='text-big-initial  font-bold text-primary tracking-tight'>AR</span><span className='tracking-tighter'>TAILORS</span></h1>
                <div className="bg-clr-100 p-8 md:px-10 shadow-md text-center w-dvw md:w-full">
                    <h1 className="text-heading-100 ff-montserrat text-clr-300 font-bold uppercase mb-4">{loginInfo.statusMessage != "" ? loginInfo.statusMessage : "Login"}</h1>
                    <Form method="post" className="flex flex-col items-center gap-4" loginInputs={formInputs}>
                        <div className="text-left">
                            <label htmlFor="username" className="block text-sm text-clr-300/80">
                                username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formInputs.username}
                                onChange={(e) =>
                                    setFormInputs({ ...formInputs, username: e.target.value })
                                }
                                required
                                className="w-full max-w-67 p-3  border border-border-clr rounded-md text-clr-300 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div className="text-left">
                            <label htmlFor="password" className="block text-sm text-clr-300/80">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formInputs.password}
                                onChange={(e) => {
                                    setFormInputs({ ...formInputs, password: e.target.value })
                                }}
                                required
                                className="w-full max-w-67 p-3  border border-border-clr rounded-md text-clr-300 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <button
                            disabled={loginInfo.status != "102" ? false : true}
                            type="submit"
                            className={"w-full max-w-67 p-3 bg-primary text-clr-100 rounded-md hover:bg-primary transition cursor-pointer " + (loginInfo.status === "102" ? ' opacity-85 ' : '')}
                        >
                            {loginInfo.status == "102" ? <div className="w-full flex justify-center"><Spinner spin={true} css="fill-clr-100" width="24px"/> </div>: "login"}
                        </button>
                    </Form>

                </div>
            </div>
            <p className="text-clr-100 text-text-200 text-center max-w-[30ch] mb-8 px-1">contact admin <a className="text-primary" target="_blank" href="mailto:arbazyousaf.dev@gmail.com">@arbazyousaf.dev</a> to gain access</p>
        </section>
    );
}
