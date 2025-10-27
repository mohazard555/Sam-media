
import React from 'react';

// A component for decorative background icons
const BackgroundIcons: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Multiple SVG icons positioned absolutely with low opacity */}
      {/* Icon 1: Chat bubble */}
      <svg className="absolute top-[10%] left-[-5%] w-48 h-48 text-slate-700/20 transform rotate-12" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd"></path></svg>
      {/* Icon 2: Users */}
      <svg className="absolute bottom-[5%] right-[-5%] w-56 h-56 text-slate-700/20 transform -rotate-15" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path></svg>
      {/* Icon 3: At symbol */}
      <svg className="absolute bottom-[40%] left-[10%] w-32 h-32 text-slate-700/20 transform rotate-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M14.25 3a6.002 6.002 0 015.42 8.532.75.75 0 11-1.226-.866A4.502 4.502 0 0014.25 4.5a.75.75 0 010-1.5 4.5 4.5 0 00-4.5 4.5.75.75 0 01-1.5 0 6 6 0 016-6zM10 18a8 8 0 100-16 8 8 0 000 16zM6.5 10a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0zM10 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
      {/* Icon 4: Hashtag */}
       <svg className="absolute top-[25%] right-[15%] w-24 h-24 text-slate-700/20 transform rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path></svg>
    </div>
  );
};

export default BackgroundIcons;