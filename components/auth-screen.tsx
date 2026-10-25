"use client"

import { useState, type FormEvent } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"

type Mode = "sign-in" | "sign-up"

export function AuthScreen({
  onSignedIn,
}: {
  onSignedIn: (token: string, email: string) => void
}) {
  const [mode, setMode] = useState<Mode>("sign-in")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    if (mode === "sign-up" && password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    setPending(true)
    try {
      const response = await fetch(
        `${api}/auth/${mode === "sign-in" ? "login" : "register"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      )
      const data = (await response.json()) as {
        token?: string
        user?: { email: string }
        error?: string
      }
      if (!response.ok || !data.token || !data.user) {
        setError(data.error ?? "Something went wrong.")
        return
      }
      onSignedIn(data.token, data.user.email)
    } catch {
      setError("Cannot reach the server.")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="relative flex min-h-svh items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-heading text-2xl">RAG Lab</CardTitle>
          <CardDescription>
            {mode === "sign-in"
              ? "Sign in to your chats."
              : "Create an account to start a chat."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={submit}>
            <label className="flex flex-col gap-1.5 text-sm">
              Email
              <Input
                type="email"
                autoComplete="email"
                value={email}
                required
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              Password
              <Input
                type="password"
                autoComplete={
                  mode === "sign-in" ? "current-password" : "new-password"
                }
                value={password}
                required
                minLength={8}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
            {mode === "sign-up" ? (
              <label className="flex flex-col gap-1.5 text-sm">
                Confirm password
                <Input
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  required
                  minLength={8}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
              </label>
            ) : null}
            {error ? (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            ) : null}
            <Button type="submit" disabled={pending}>
              {pending
                ? "Please wait…"
                : mode === "sign-in"
                  ? "Sign in"
                  : "Create account"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setMode(mode === "sign-in" ? "sign-up" : "sign-in")
                setConfirmPassword("")
                setError("")
              }}
            >
              {mode === "sign-in"
                ? "Need an account? Sign up"
                : "Already have an account? Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
