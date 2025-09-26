
'use client';
import Link from 'next/link';
import Navbar from './(frontend)/_components/Navbar';
import FeatureCard from './(frontend)/FeatureCard';
import Footer from './(frontend)/Footer';
import Image from 'next/image';

import { GrSchedules } from "react-icons/gr";
import { MdEventSeat } from "react-icons/md";
import { FaWallet } from "react-icons/fa";

export default function Home() {
  return (
    <main className="min-h-screen font-light tracking-wide bg-black text-white">
      <Navbar />
            <section className="relative pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left order-2 lg:order-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[64px] font-bold leading-tight mb-4 sm:mb-6">
                The Ultimate <br/>
                <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                  Exam Management
                </span><br/>
                Software You Need
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-6 sm:mb-8 max-w-2xl">
                Automate your institution operations, with ExamEase.
              </p>
              <div className="flex justify-center lg:justify-start gap-6">
                <Link
                  href="/signin"
                  className="bg-white text-black px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-gray-100 transition text-sm sm:text-base"
                >
                  Get Started →
                </Link>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end order-1 lg:order-2">
              <Image 
                src={'/man.jpeg'} 
                alt='Man_Image' 
                height={300}
                width={300}
                className="sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[400px] lg:h-[400px] rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 sm:py-24 md:py-32 bg-black/50">
        <div className="max-w-7xl mx-auto px-4">
          
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <span className="text-sm text-purple-500">Core Features</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2 sm:mt-4">The Ultimate Toolkit</h2>
          </div>
    
          <div className="space-y-8 sm:space-y-12 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 lg:gap-8">
            <div className="md:col-span-2 lg:col-span-1">
              <FeatureCard
                title="Timetable Generation"
                description="Generate conflict-free examination schedules in seconds with smart automation."
                icon={GrSchedules}
              />
            </div>
            <div className="md:col-span-2 lg:col-span-1">
              <FeatureCard
                title="Seating Arrangement"
                description="Automatically create optimal seating plans based on room capacity and constraints."
                icon={MdEventSeat}
              />
            </div>
            <div className="md:col-span-2 lg:col-span-1">
              <FeatureCard
                title="Faculty Remuneration"
                description="Track and process faculty payments for examination duties efficiently."
                icon={FaWallet}
              />
            </div>
          </div>
        </div>
      </section>
      
      <Footer/>
    </main>
  );
}