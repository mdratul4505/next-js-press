" use client";

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import React from 'react'
import { loginAction } from '../_actions/authActions';

const LoginForm = () => {
  return (
    <form action={loginAction} className = "space-y-5">
        <Card className = "p-5 space-y-4">
            <Input name="email" type="email" placeholder="Enter your Email" required />
            <Input name="password" type="password" placeholder="Enter your Password" required />
            <Button type="submit">Login</Button>
        </Card>
    </form>
  )
}

export default LoginForm