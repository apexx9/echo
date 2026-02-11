'use client';
import * as React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function LandingPage() {
  const [isDemoPlaying, setIsDemoPlaying] = React.useState(false);
  const [currentDemoText, setCurrentDemoText] = React.useState('');
  const [showAnswer, setShowAnswer] = React.useState(false);
  const [isClient, setIsClient] = React.useState(false);

  const currentYear = new Date().getFullYear();
  const demoQuestion = "When did I first learn about pricing psychology?";
  const demoAnswer = "Based on your saved memories...";

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    if (isDemoPlaying) {
      let charIndex = 0;
      setCurrentDemoText('');
      setShowAnswer(false);

      const typeInterval = setInterval(() => {
        if (charIndex < demoQuestion.length) {
          setCurrentDemoText(prev => prev + demoQuestion[charIndex]);
          charIndex++;
        } else {
          clearInterval(typeInterval);
          setTimeout(() => setShowAnswer(true), 500);
        }
      }, 50);

      return () => clearInterval(typeInterval);
    }
  }, [isDemoPlaying]);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsDemoPlaying(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="text-xl font-light tracking-wide text-zinc-900 dark:text-zinc-100">
            Echo
          </div>
          <nav className="flex items-center space-x-8">
            <button 
              onClick={() => window.location.href = '/login'}
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => window.location.href = '/signup'}
              className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 rounded text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >
              Get Started
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0.0, 0.2, 1] }}
          >
            <h1 className="text-6xl md:text-7xl font-light tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight">
              Ask anything
              <br />
              you've ever
              <br />
              <span className="font-medium">learned.</span>
            </h1>
            <p className="mt-8 text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto">
              Your personal memory system. Grounded in what you've actually read, saved, and written.
            </p>
          </motion.div>

          {/* Demo */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-8">
              <div className="space-y-6">
                <div className="text-left">
                  <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">Example</div>
                  <div className="bg-white dark:bg-zinc-900 rounded border border-zinc-200 dark:border-zinc-700 p-4 min-h-[60px] flex items-center">
                    <span className="text-zinc-900 dark:text-zinc-100 font-mono text-sm">
                      {currentDemoText}
                      {isDemoPlaying && currentDemoText.length < demoQuestion.length && (
                        <motion.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ repeat: Infinity, duration: 0.8 }}
                          className="inline-block w-2 h-4 bg-zinc-900 dark:bg-zinc-100 ml-1"
                        />
                      )}
                    </span>
                  </div>
                </div>

                {showAnswer && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-left"
                  >
                    <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">Response</div>
                    <div className="bg-zinc-100 dark:bg-zinc-700 rounded p-4">
                      <p className="text-zinc-900 dark:text-zinc-100">{demoAnswer}</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => window.location.href = '/signup'}
              className="px-8 py-3 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 rounded text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >
              Start Remembering
            </button>
            <button
              className="px-8 py-3 border border-zinc-300 dark:border-zinc-700 rounded text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Learn More
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-zinc-50 dark:bg-zinc-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-16">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="space-y-4"
            >
              <div className="text-2xl font-light text-zinc-900 dark:text-zinc-100">
                Save
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Articles, notes, documents. Save anything without organizing. Your memory system handles the rest.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="space-y-4"
            >
              <div className="text-2xl font-light text-zinc-900 dark:text-zinc-100">
                Ask
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Get answers grounded in your own past. No generic responses — just your personal knowledge.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="space-y-4"
            >
              <div className="text-2xl font-light text-zinc-900 dark:text-zinc-100">
                Grow
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Track how your understanding evolves. Watch your knowledge build on itself over time.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Differentiation Section */}
      <section className="py-24 px-6 bg-white dark:bg-zinc-900">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-light text-zinc-900 dark:text-zinc-100">
              This is not a notes app.
            </h2>
          </motion.div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="border-b border-zinc-200 dark:border-zinc-800 pb-8"
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="text-zinc-400 dark:text-zinc-600 line-through">Notes store information</div>
                  <div className="text-xl font-medium text-zinc-900 dark:text-zinc-100 mt-2">This remembers it</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="border-b border-zinc-200 dark:border-zinc-800 pb-8"
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="text-zinc-400 dark:text-zinc-600 line-through">Search finds text</div>
                  <div className="text-xl font-medium text-zinc-900 dark:text-zinc-100 mt-2">This recalls meaning</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="text-zinc-400 dark:text-zinc-600 line-through">Generic AI answers for everyone</div>
                  <div className="text-xl font-medium text-zinc-900 dark:text-zinc-100 mt-2">This answers for you</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-zinc-50 dark:bg-zinc-800">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-light text-zinc-900 dark:text-zinc-100">
              Build a memory
              <br />
              you can trust.
            </h2>
            <p className="mt-6 text-xl text-zinc-600 dark:text-zinc-400">
              Start building your personal cognitive memory system.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => window.location.href = '/signup'}
              className="px-8 py-3 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 rounded text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >
              Start Now
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex items-center justify-center space-x-8 text-zinc-500 dark:text-zinc-400 text-sm"
          >
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4" />
              <span>Free to start</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4" />
              <span>Your data, your control</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            © {currentYear} Echo. Personal cognitive memory system.
          </div>
          <div className="flex items-center space-x-6 text-sm text-zinc-600 dark:text-zinc-400">
            <button className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              Privacy
            </button>
            <button className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              Terms
            </button>
            <button className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              Contact
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
