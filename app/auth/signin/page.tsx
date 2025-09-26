

'use client';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading,setisLoading] = useState(false);
  const [error,setError] = useState('');

  const router = useRouter()

  const onSubmit =async(e:any)=>{
    e.preventDefault();
    setisLoading(true);
    setError('');
    try {
      const result = await signIn('credentials', {
          username,
          password,
          redirect: false,
      });

      if (result?.error) {
          setError(result.error === 'CredentialsSignin' ? 'Invalid credentials' : result.error);
          setisLoading(false);
      } else {
          router.push('/dashboard');
          router.refresh();
      }
  } catch (error) {
      setError('An unexpected error occurred');
      setisLoading(false);
  }
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-sm sm:max-w-md rounded-2xl p-6 sm:p-8 space-y-6 sm:space-y-8">

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-white">
          <span className="text-2xl md:text-2xl font-semibold text-white">
  E
  <span className="text-2xl md:text-4xl relative top-1 bg-gradient-to-r from-purple-500 to-[#111111] bg-clip-text text-transparent">
    X
  </span>
  amEase
</span>
          </h1>
          <h2 className="text-xl sm:text-2xl text-gray-300">Welcome</h2>
          <p className="text-sm sm:text-base text-gray-400">Log in to ExamEase to continue.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5 sm:space-y-6">
        <div className="space-y-2">
  <label className="block text-sm font-medium text-gray-300">
    Moodle Id
  </label>
  <Input
    type="text"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    placeholder="Enter your Moodle Id"
    required
    className="w-full px-4 py-6 rounded-lg border border-gray-300
               focus:ring-2 focus:ring-purple-500 focus:border-transparent
               outline-none transition text-sm sm:text-base text-white
               placeholder-gray-400"
  />
</div>

<div className="space-y-2">
  <label className="block text-sm font-medium text-gray-300">
    Password
  </label>
  <div className="relative">
    <Input
      type={showPassword ? 'text' : 'password'}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Enter your password"
      required
      className="w-full pr-12 px-4 py-6 rounded-lg border border-gray-300
                 focus:ring-2 focus:ring-purple-500 focus:border-transparent
                 outline-none transition text-sm sm:text-base text-white
                 placeholder-gray-400"
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
    >
      {showPassword ? <IoEyeOffOutline className="w-5 h-5" /> : <IoEyeOutline className="w-5 h-5" />}
    </button>
  </div>
</div>

<Button
  type="submit"
  className="w-full mt-4 py-6 px-5 bg-purple-500 hover:bg-purple-700 text-white rounded-lg transition duration-200 text-sm sm:text-base flex items-center justify-center"
>
  <span className={isLoading ? '' : 'hidden'}>
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  </span>
  <span>
    {isLoading ? 'Signing in...' : 'Continue'}
  </span>
</Button>
        </form>
      </div>
    </main>
  );
}