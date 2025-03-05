"use client";

import { motion } from "framer-motion";
import { Brain, Calendar, Check, Clock, Grid3X3Icon } from "lucide-react";

const Categories = () => {
  return (
    <div className="flex flex-col items-center justify-center mx-auto pb-6 overflow-auto w-full lg:max-w-6xl">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-3xl font-bold mb-2 tracking-tighter flex gap-2 items-center text-left w-full">
          <Grid3X3Icon className="text-primary w-8 h-8" />
          Categories
        </h1>
      </div>
      <div className="flex flex-col w-full gap-2">
        <section className="text-center mb-16 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="badge badge-soft badge-primary mb-4 px-3 py-1">
              <Clock className="mr-1 h-3 w-3" /> Launching Soon
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Smart Organization <br className="hidden sm:block" />
              <span className="text-primary">Powered by AI</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Our intelligent system will automatically categorize your records
              using advanced AI technology, all while keeping your data private
              and secure.
            </p>
          </motion.div>
        </section>

        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Will Work</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our application is designed to make organization effortless
              through AI-powered categorization.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Your visited site titles",
                description:
                  "Your browse like normal. We can only categorize the titles of your visited sites.",
                icon: Calendar,
              },
              {
                title: "AI Categorization",
                description:
                  "Our AI suggests relevant categories based solely on the titles of the websites you visit. We do not access the content of those sites.",
                icon: Brain,
              },
              {
                title: "Organized Results",
                description:
                  "See your records organized in a structured manner.",
                icon: Check,
              },
            ].map((step, index) => (
              <div key={index} className="card relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                <div className="card-body">
                  <step.icon className="h-12 w-12 text-primary mb-2" />
                  <h2 className="card-title">{step.title}</h2>
                </div>
                <div className="card-body">
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
                <div className="absolute bottom-4 right-4 text-primary/40">
                  <div className="text-4xl font-bold opacity-20">
                    {index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Categories;
