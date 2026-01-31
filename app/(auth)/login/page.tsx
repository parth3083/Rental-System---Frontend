"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
    return (
        <Card className="w-full shadow-lg">
            <CardHeader className="space-y-1 text-center">
                <div className="flex justify-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        {/* Logo Placeholder */}
                        <span className="font-bold text-primary">R</span>
                    </div>
                </div>
                <CardTitle className="text-2xl">Sign In</CardTitle>
                <CardDescription>
                    Enter your credentials to access your account
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="login-id">Login ID</Label>
                    <Input id="login-id" type="text" placeholder="user@example.com" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" />
                </div>
                <div className="flex items-center justify-center">
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline font-medium">
                        Forgot Password?
                    </Link>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button className="w-full">Sign In</Button>
                <div className="text-center text-sm text-muted-foreground">
                    Do not have an account?{" "}
                    <Link href="/register" className="text-primary hover:underline font-medium">
                        Register here
                    </Link>
                </div>
            </CardFooter>
        </Card>
    )
}
