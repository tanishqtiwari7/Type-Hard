import React from 'react';
import TypingTest from '../components/TypingTest.jsx';
import useStore from '../store/useStore.js';
import { FaInfoCircle } from 'react-icons/fa';

const Home = () => {
  const { user } = useStore();
  
  return (
    <div className="flex flex-col items-center justify-start min-h-[calc(100vh-100px)] pt-4 pb-20">
      
      {/* User Greeting / Layout Spacer */}
      <div className="w-full max-w-6xl px-4 mb-2 flex justify-between items-end opacity-0">
         {/* Hidden spacer to push content if needed, or keeping structure for future */}
         <span>Spacer</span>
      </div>

      <TypingTest />

      {/* Footer Info Area - Good place for keyboard shortcuts or tips */}
      <div className="fixed bottom-8 text-center text-textGray/30 text-xs font-mono select-none pointer-events-none">
          Type Hard &copy; 2026 &bull; Enterprise Grade Typing
      </div>
    </div>
  );
};

export default Home;
