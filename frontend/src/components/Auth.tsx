import { SigninInput, SignupInput } from "@usmantariq/medium-blog-common";
import axios from "axios";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";

export const Auth = ({type}: {type: 'signup' | 'signin'}) => {
    const navigate = useNavigate();
    const [postInputs, setPostInputs] = useState<SignupInput | SigninInput>({
        email: '',
        password: '',
        name: ''
    })
    const [loading, setLoading] = useState<boolean>(false)

    async function sendRequest () {
        try {
            setLoading(true)
            const res = await axios.post(`${BACKEND_URL}/api/v1/${type}`, postInputs)
            const jwt = res.data.jwt
            localStorage.setItem("token", jwt)
            navigate('/blogs')
            setLoading(false)
        } catch(e) {
            alert('Something went wrong')
        }
    }

    return (
        <div className="h-screen flex flex-col justify-center">
            <div className="flex justify-center">
                <div>
                    <div className="px-12">
                        <div className="text-3xl font-extrabold">
                            Create an account
                        </div>
                        <div className="text-slate-400 mt-2">
                            {type === "signup" ? "Already have an account?" : "Don't have an account?"} 
                            <Link className="pl-2 underline" to={type === "signup" ? '/signin' : '/signup'}>
                                { type === "signup" ? "Sign in" : "Sign up" }
                            </Link>
                        </div>
                    </div>
                    <div className="pt-8">
                        {
                            type === "signup" && <LabeledInput label="Name" placeholder="John Doe" onChange={(e) => setPostInputs(c => ({...c, name: e.target.value}))}/>
                        }
                        <LabeledInput label="Email" placeholder="example@gmail.com" type="email" onChange={(e) => setPostInputs(c => ({...c, email: e.target.value}))}/>
                        <LabeledInput label="Password" placeholder="123456" type="password" onChange={(e) => setPostInputs(c => ({...c, password: e.target.value}))}/>
                        <button type="button" disabled={loading} onClick={sendRequest} className="mt-4 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 capitalize">{type === "signup" ? "Sign up" : "Sign in"}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

interface LabeledInputType {
    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}

export const LabeledInput = ({label, placeholder, onChange, type}: LabeledInputType) => (
    <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 pt-4">{label}</label>
        <input onChange={(e) => onChange(e)} type={type || "text"} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder={placeholder} required />
    </div>
)