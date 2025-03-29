import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { ThemeProvider } from "@/components/theme-provider";
import { Bell, BookOpen, Calendar, GraduationCap, Home, Menu, MessageSquare, Search, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Student Learning Portal",
  description: "Access your courses, watch lectures, and submit assignments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-16 items-center justify-between mx-auto">
                <div className="flex items-center gap-2 md:gap-4">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="icon" className="md:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                      <nav className="flex flex-col gap-4 mt-8">
                        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                          <GraduationCap className="h-5 w-5" />
                          <span>Learning Portal</span>
                        </Link>
                        <div className="flex flex-col gap-2">
                          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                            <Home className="h-4 w-4" />
                            <span>Home</span>
                          </Link>
                          <Link
                            href="/courses"
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                            <BookOpen className="h-4 w-4" />
                            <span>My Courses</span>
                          </Link>
                          <Link
                            href="/calendar"
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                            <Calendar className="h-4 w-4" />
                            <span>Calendar</span>
                          </Link>
                          <Link
                            href="/messages"
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                            <MessageSquare className="h-4 w-4" />
                            <span>Messages</span>
                          </Link>
                          <Link
                            href="/profile"
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                            <User className="h-4 w-4" />
                            <span>Profile</span>
                          </Link>
                          <Link
                            href="/settings"
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                            <Settings className="h-4 w-4" />
                            <span>Settings</span>
                          </Link>
                        </div>
                      </nav>
                    </SheetContent>
                  </Sheet>
                  <Link href="/" className="flex items-center gap-2">
                    <GraduationCap className="h-6 w-6" />
                    <span className="font-bold hidden md:inline-block">Student Learning Portal</span>
                  </Link>
                </div>
                <div className="hidden md:flex items-center gap-6">
                  <nav className="flex items-center gap-4">
                    <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">
                      Home
                    </Link>
                    <Link href="/courses" className="text-sm font-medium hover:underline underline-offset-4">
                      My Courses
                    </Link>
                    <Link href="/calendar" className="text-sm font-medium hover:underline underline-offset-4">
                      Calendar
                    </Link>
                    <Link href="/messages" className="text-sm font-medium hover:underline underline-offset-4">
                      Messages
                    </Link>
                  </nav>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative hidden md:flex items-center">
                    <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search..." className="w-64 rounded-full bg-background pl-8 md:w-80 lg:w-96" />
                  </div>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
                    <span className="sr-only">Notifications</span>
                  </Button>
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" alt="@user" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t py-6">
              <div className="container flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <p className="text-sm text-muted-foreground">
                  &copy; {new Date().getFullYear()} Student Learning Portal. All rights reserved.
                </p>
                <nav className="flex gap-4">
                  <Link href="#" className="text-sm text-muted-foreground hover:underline underline-offset-4">
                    Terms
                  </Link>
                  <Link href="#" className="text-sm text-muted-foreground hover:underline underline-offset-4">
                    Privacy
                  </Link>
                  <Link href="#" className="text-sm text-muted-foreground hover:underline underline-offset-4">
                    Contact
                  </Link>
                  <Link href="#" className="text-sm text-muted-foreground hover:underline underline-offset-4">
                    Help
                  </Link>
                </nav>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
