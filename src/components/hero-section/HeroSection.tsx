import React, { useEffect, useRef } from "react";
import {
  Sparkles,
  Zap,
  Star,
  Globe,
  ChevronsLeftRightEllipsisIcon,
  CakeSliceIcon,
} from "lucide-react";
import HeroBackground from "./HeroBackground";
import Logo from "../Logo";
import { EXTENSION_PAGE } from "../../utils/constants";
import Link from "next/link";

const HeroSection: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Text animation effect on mount
  useEffect(() => {
    const titleElement = titleRef.current;
    if (titleElement) {
      titleElement.style.opacity = "0";
      titleElement.style.transform = "translateY(20px)";

      setTimeout(() => {
        titleElement.style.transition =
          "opacity 0.8s ease-out, transform 0.8s ease-out";
        titleElement.style.opacity = "1";
        titleElement.style.transform = "translateY(0)";
      }, 300);
    }
  }, []);

  return (
    <HeroBackground className="min-h-screen">
      <div className="container mx-auto px-4 py-24 sm:py-32 flex flex-col items-center justify-center">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="flex items-center justify-center">
            <span className="relative inline-flex overflow-hidden rounded-full">
              <span className="inline-flex items-center rounded-full bg-primary/20 px-4 py-1.5 text-sm font-medium text-primary mb-4 border border-primary/20 backdrop-blur-md shadow-lg">
                <Sparkles className="w-4 h-4 mr-1.5 animate-pulse" />
                New Features Released
                <Star className="w-4 h-4 ml-1.5 animate-pulse" />
              </span>
            </span>
          </div>

          <h1
            ref={titleRef}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground drop-shadow-md"
            style={{ textShadow: "0 0 30px rgba(255,255,255,0.2)" }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              TabSync
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Your Tabs, Everywhere
            </span>
            <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-50"></span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Seamlessly synchronize your browser tabs across all your devices in
            real-time. Never lose track of your browsing sessions again.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 relative">
            {/* Glow effect behind buttons */}
            <div className="absolute inset-0 blur-2xl bg-primary/10 rounded-full -z-10"></div>

            <Link href={EXTENSION_PAGE} target="_blank">
              <button className="btn text-white gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 border-0 shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 transform hover:scale-105">
                Get from Webstore <Zap className="h-4 w-4 animate-pulse" />
              </button>
            </Link>
            <Link href="/sign-in">
              <button className="btn btn-outline gap-2 backdrop-blur-sm border-white/20 bg-white/5 hover:bg-white/10 shadow-lg hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 transform hover:scale-105">
                <Logo /> Go to app
              </button>
            </Link>
          </div>

          <div className="pt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
            {[
              {
                icon: Globe,
                title: "Works on (Almost) Any Browser",
                description:
                  "Compatible with Chromium, Chrome, Vivaldi, Opera, and Firefox (coming soon).",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                icon: ChevronsLeftRightEllipsisIcon,
                title: "Updates in Real Time",
                description:
                  "Instantly sync your tabs across all your devices with real-time updates.",
                gradient: "from-violet-600 to-indigo-600",
              },
              {
                icon: CakeSliceIcon,
                title: "Easy to use",
                description:
                  "Intuitive interface that makes tab management simple and effortless.",
                gradient: "from-pink-500 to-purple-600",
              },
            ].map((card, index) => (
              <div
                key={index}
                className="bg-card/40 backdrop-blur-md p-6 rounded-xl border border-white/10 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 transform hover:-translate-y-1 group relative overflow-hidden"
              >
                {/* Background glow effect */}
                <div
                  className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10"
                  style={{
                    background: `linear-gradient(to bottom right, ${
                      card.gradient.split(" ")[1]
                    }, ${card.gradient.split(" ")[3]})`,
                  }}
                ></div>

                {/* Icon with gradient background */}
                <div
                  className={`w-14 h-14 rounded-lg bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-5 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
                >
                  <card.icon className="h-7 w-7 text-white" />
                </div>

                <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors duration-300">
                  {card.title}
                </h3>
                <p className="text-muted-foreground">{card.description}</p>

                {/* Animated arrow on hover */}
                {/* <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Learn more</span>
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div> */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </HeroBackground>
  );
};

export default HeroSection;
