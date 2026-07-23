"use client";

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import React, { useActionState, useEffect } from 'react'
import { loginAction } from '../_actions/authActions';
import { toast } from 'sonner';
// import { useRouter } from 'next/navigation';

const LoginForm = () => {
  const [state, action , pending] = useActionState(loginAction , false)
  // const router = useRouter()

  useEffect(()=> {
    if(!state) return;
    if(state.success){
     toast.success(state.message || "login successfull")
    //  router.push("/dashboard")
    }

    if(!state.success){
      toast.error(state.message || "login failed")
    }
  } , [state])
  return (
    <form action={action} className = "space-y-5">
        <Card className = "p-5 space-y-4">
            <Input name="email" type="email" placeholder="Enter your Email" required />
            <Input name="password" type="password" placeholder="Enter your Password" required />
            <Button type="submit">
              {
                pending ? "submitting...." :"Login"
              }
            </Button>
        </Card>
    </form>
  )
}

export default LoginForm