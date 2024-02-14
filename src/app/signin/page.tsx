'use client'
import Image from 'next/image'
import google from '../../../public/Google.png'
import Link from 'next/link'
import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword,signInWithPopup, GoogleAuthProvider  } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { app } from '@/config/firebase';

export default function () {

    const auth = getAuth(app);
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          router.push('/');
        } catch (error) {
          console.error("Error signing in:", error);
        }
      };
      
      const handleGoogleSignIn = async () => {
        try {
          const auth = getAuth(app);
          const provider = new GoogleAuthProvider();
          const result = await signInWithPopup(auth, provider);
          const user = result.user;
          router.push('/')
        } catch (error) {
          console.error('Error signing in with Google:', error);
        }
      };

    return (
        <div className="w-full h-screen flex justify-center items-center">

            <div className="bg-gradient-to-b shadow-2xl w-60 shadow-gray-800 from-[#6472f1] flex flex-col items-center  to-[#8295db]  rounded-lg h-64">
                <div className="w-full h-10 flex justify-end items-start">
                    <Link href='/signup'><div className="bg-white w-18 px-3 py-[5px] text-sm rounded-tr-md rounded-bl-md">SignUp</div></Link>
                </div>
                <form className="flex justify-center w-full p-4 pt-0" onSubmit={handleSubmit}>
                    <div className="w-full flex flex-col justify-center items-center">
                        <h1 className="text-center">SignIn</h1>
                        <div className="w-full justify-center items-center flex flex-col">
                            <div className="w-[85%] h-32 flex flex-col gap-y-6 justify-center items-center">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-md px-2 text-sm h-7 focus:outline-none"
                                    placeholder="Email"
                                />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-md px-2 text-sm h-7 focus:outline-none"
                                    placeholder="Password"
                                />
                            </div>
                            <div className="w-full flex justify-center items-center gap-5">
                                <button type="submit" className="bg-white rounded-full p-1 px-2 text-sm">SignIn</button>
                                <button onClick={handleGoogleSignIn} className="bg-white rounded-full p-1 px-3"><Image src={google} width={19} alt={'hello'} /></button>
                            </div>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    )
}