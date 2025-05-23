'use client';

import { useRef } from 'react';

// Define the prop types for TimelineCard
interface TimelineCardProps {
  title: string;
  description: string;
  index: number;
}

const TimelineCard = ({ title, description, index }: TimelineCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  // Alternate card position (left/right) for zigzag effect
  const isEven = index % 2 === 0;

  return (
    <div className={`relative flex ${isEven ? 'justify-start' : 'justify-end'} mb-16`}>
      {/* Timeline Line (Zigzag effect with pseudo-elements) */}
      <div
        className={`absolute w-1 bg-blue-500 ${
          isEven ? 'left-1/2 -translate-x-1/2' : 'left-1/2 -translate-x-1/2'
        } h-full z-0`}
      >
        {/* Zigzag connector */}
        <div
          className={`absolute w-4 h-4 ${
            isEven ? 'left-full -translate-x-1/2' : '-left-3 -translate-x-1/2'
          } top-0 bg-blue-500 rotate-45`}
        />
      </div>
      {/* Timeline Dot */}
      <div
        className={`absolute w-4 h-4 bg-blue-500 rounded-full z-10 ${
          isEven ? 'left-1/2 -translate-x-1/2' : 'left-1/2 -translate-x-1/2'
        } top-4`}
      />
      {/* Card */}
      <div
        ref={ref}
        className={`p-6 bg-white rounded-lg shadow-lg w-full max-w-md animate-descend ${
          isEven ? 'mr-8' : 'ml-8'
        }`}
        style={{ animationDelay: `${index * 200}ms` }}
      >
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default function Projects() {
  const timelineData = [
    {
      title: 'Project 1',
      description: 'A web app built with Next.js and Tailwind CSS.',
    },
    {
      title: 'Project 2',
      description: 'A mobile-first design with smooth animations.',
    },
    {
      title: 'Project 3',
      description: 'An e-commerce platform with dynamic features.',
    },
    {
      title: 'Project 4',
      description: 'A portfolio site showcasing creative work.',
    },
  ];

  return (
    <section className="min-h-screen flex flex-col items-center py-12 bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-900 mb-12">My Projects</h1>
      <div className="relative w-full max-w-4xl">
        {timelineData.map((project, index) => (
          <TimelineCard
            key={index}
            title={project.title}
            description={project.description}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}