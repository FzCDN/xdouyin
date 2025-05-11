import { useState } from "react";

export default function TopNavigation() {
  const [activeTab, setActiveTab] = useState<"forYou" | "following">("forYou");

  return (
    <div className="fixed top-0 left-0 right-0 flex justify-between items-center p-4 z-30 bg-gradient-to-b from-black/50 to-transparent">
      <div className="flex space-x-4 text-lg">
        <button 
          className={`px-4 py-1 font-medium ${activeTab === "forYou" ? "text-white" : "text-[#AAAAAA]"}`}
          onClick={() => setActiveTab("forYou")}
        >
          For You
        </button>
        <button 
          className={`px-4 py-1 font-medium ${activeTab === "following" ? "text-white" : "text-[#AAAAAA]"}`}
          onClick={() => setActiveTab("following")}
        >
          Following
        </button>
      </div>
      <button className="p-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
      </button>
    </div>
  );
}
