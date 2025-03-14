import Link from "next/link";

import {
  Globe,
  RefreshCw,
  Shield,
  MousePointer,
  Download,
  UserPlus,
  Compass,
  Clock,
  Lock,
  Sparkles,
} from "lucide-react";
import Logo from "components/Logo";
import NetworkGraph from "components/network-graph/NetworkGraph";
import { EXTENSION_PAGE } from "../utils/constants";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0 m-auto px-4">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <Logo className="bg-primary" />
              <span className="inline-block font-bold">TabSync</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-1">
              <Link
                href="#features"
                className="hidden md:block text-sm font-medium transition-colors hover:text-primary"
              >
                Features
              </Link>
              <Link
                href="#get-started"
                className="hidden md:block text-sm font-medium transition-colors hover:text-primary ml-4"
              >
                Get Started
              </Link>
              <Link
                href="#why"
                className="hidden md:block text-sm font-medium transition-colors hover:text-primary ml-4"
              >
                Why TabSync
              </Link>
              <button className="btn btn-soft ml-2">
                <Link href="/sign-in">Go to app</Link>
              </button>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 md:m-auto relative">
        {/* Hero Section */}
        <section
          className="w-full py-12 md:py-24 lg:py-32 xl:py-48 z-10"
          id="cta"
        >
          <div className="container px-4 md:px-6">
            {/* lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px] */}
            <div className="flex flex-col lg:flex-row gap-6 ">
              <div className="flex flex-col justify-center space-y-4 z-20">
                <div className="space-y-2">
                  <div className="badge w-fit mb-4 bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-foreground">
                    New Version 2.0 Released
                  </div>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none max-w-full z-20">
                    TabSync: Your Tabs, Everywhere
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Seamlessly synchronize your browser tabs across all your
                    devices in real-time. Never lose track of your browsing
                    sessions again.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <button className="btn btn-primary">
                    <Link href={EXTENSION_PAGE} target="_blank">
                      Get TabSync Now
                    </Link>
                  </button>
                  <button className="btn btn-outline">
                    <Link href="#features">Learn More</Link>
                  </button>
                </div>
              </div>
              <div className="z-10 w-1/2 md:w-screen">
                <NetworkGraph />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted/50 z-20"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Key Features
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Discover what makes TabSync the ultimate tab management
                  solution
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-2 py-12 md:grid-cols-2 lg:grid-cols-4">
              <div className="card bg-base-100">
                <div className="card-body">
                  <div className="rounded-full bg-primary/10 w-12 h-12 m-auto">
                    <Globe className="h-16 w-16 text-primary p-2" />
                  </div>
                  <div className="card-title min-h-20 justify-center py-2 text-center">
                    Works on (Almost) Any Browser
                  </div>
                  <p className="text-center text-neutral-600">
                    Compatible with Chromium, Chrome, Vivaldi, Opera, and
                    Firefox (coming soon).
                  </p>
                </div>
              </div>
              <div className="card bg-base-100">
                <div className="card-body">
                  <div className="rounded-full bg-primary/10 w-12 h-12 m-auto">
                    <RefreshCw className="h-16 w-16 text-primary p-2" />
                  </div>
                  <div className="card-title min-h-20 justify-center py-2 text-center">Updates in Real Time</div>
                  <p className="text-center text-neutral-600">
                    Instantly sync your tabs across all your devices with
                    real-time updates.
                  </p>
                </div>
              </div>
              <div className="card bg-base-100">
                <div className="card-body">
                  <div className="rounded-full bg-primary/10 w-12 h-12 m-auto">
                    <Shield className="h-16 w-16 text-primary p-2" />
                  </div>
                  <div className="card-title min-h-20 justify-center py-2 text-center">Safe and Sound</div>
                  <p className="text-center text-neutral-600">
                    Secure cloud storage with end-to-end encryption and strong
                    privacy protections.
                  </p>
                </div>
              </div>
              <div className="card bg-base-100">
                <div className="card-body">
                  <div className="rounded-full bg-primary/10 w-12 h-12 m-auto">
                    <MousePointer className="h-16 w-16 text-primary p-2" />
                  </div>
                  <div className="card-title min-h-20 justify-center py-2 text-center">Easy to Use</div>
                  <p className="text-center text-neutral-600">
                    Intuitive interface that makes tab management simple and
                    effortless.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How to Get Started Section */}
        <section id="get-started" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  How to Get Started
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Follow these simple steps to start syncing your tabs across
                  all your devices
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-4">
                <div className="rounded-full bg-primary/10 p-6">
                  <Download className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold">
                  1. Get the TabSync Extension
                </h3>
                <p className="text-center text-muted-foreground">
                  Download and install the TabSync extension from your browser's
                  extension store.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="rounded-full bg-primary/10 p-6">
                  <UserPlus className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold">2. Sign Up</h3>
                <p className="text-center text-muted-foreground">
                  Create a TabSync account to securely store and sync your tabs
                  across devices.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="rounded-full bg-primary/10 p-6">
                  <Compass className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold">3. Browse</h3>
                <p className="text-center text-muted-foreground">
                  Start browsing as usual. TabSync will automatically sync your
                  tabs in real-time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why TabSync Rocks Section */}
        <section
          id="why"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted/50"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Why TabSync Rocks
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Here's why users love TabSync for their browsing experience
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-4">
                <div className="rounded-full bg-primary/10 p-6">
                  <Clock className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Save Time</h3>
                <p className="text-center text-muted-foreground">
                  No more manually reopening tabs or sending links to yourself.
                  TabSync streamlines your browsing experience.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="rounded-full bg-primary/10 p-6">
                  <Lock className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Your Privacy, Your Rules</h3>
                <p className="text-center text-muted-foreground">
                  We prioritize your privacy with strong encryption and
                  transparent data practices.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="rounded-full bg-primary/10 p-6">
                  <Sparkles className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Always Getting Better</h3>
                <p className="text-center text-muted-foreground">
                  Regular updates with new features and improvements based on
                  user feedback.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* CTA Section */}
      <section
        id="cta"
        className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden transition-opacity duration-1000"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-600 opacity-80 dark:opacity-80 min-w-screen"></div>
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=1200')] bg-cover bg-center opacity-10 mix-blend-overlay min-w-screen"></div>

        <div className="container px-4 md:px-6 relative z-10 m-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2 max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">
                Ready to Sync Your Tabs?
              </h2>
              <p className="max-w-[600px] text-white/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join tens of users who have streamlined their browsing
                experience with TabSync.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row pt-6">
              <button className="btn btn-outline bg-transparent text-white border-white hover:shadow-xl">
                <Link href={EXTENSION_PAGE} target="_blank">
                  Get TabSync Now
                </Link>
              </button>
              <button className="btn btn-outline bg-transparent text-white border-white hover:bg-white/10">
                <Link href="#cta">Learn More</Link>
              </button>
            </div>
            <div className="flex items-center space-x-4 mt-12 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
              <div className="flex -space-x-2">
                {["M", "O", "S"].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary text-xs border-2 border-primary"
                  >
                    {i}
                  </div>
                ))}
              </div>
              <div className="text-sm text-white">
                <span className="font-medium">Sync your tabs!</span> Join me,
                myselft and... well, someone else. (It's a start, right?)
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="w-full border-t py-6 md:py-0 px-4 md:px-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <Logo className="bg-primary" />
            <p className="text-sm text-muted-foreground">
              © 2025 TabSync. All rights reserved.
            </p>
          </div>
          <nav className="flex gap-4 sm:gap-6">
            <Link
              href="#"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
