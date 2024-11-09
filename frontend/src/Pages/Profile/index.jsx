import { Label } from "../../UIs/shadcn-ui/label";
import { Input } from "../../UIs/shadcn-ui/input";
import { Button } from "../../UIs/shadcn-ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";
import ProfileInfo from './ProfileInfo'
import Security from "./Security";

export function Profile() {
  const [selectedTab, setSelectedTab] = useState('profile');

  const renderContent = () => {
    switch (selectedTab) {
      case 'profile':
        return <ProfileInfo/>;
      case 'security':
        return <Security/>
      case 'privacy':
        return <p>Privacy settings content goes here.</p>;
      case 'notifications':
        return <p>Notifications settings content goes here.</p>;
      default:
        return null;
    }
  };

  return (
    <div className="mt-28 w-full max-w-4xl mx-auto grid md:grid-cols-[250px_1fr] items-start gap-6 px-6">
      <div className="space-y-1 mt-7">
        <button
          onClick={() => setSelectedTab('profile')}
          className={`flex items-center space-x-2 py-2 px-4 rounded-md text-sm font-medium w-full ${selectedTab === 'profile' ? 'bg-gray-100 text-black' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        >
          <UserIcon className="w-6 h-6" />
          <span>Profile Information</span>
        </button>
        <button
          onClick={() => setSelectedTab('security')}
          className={`flex items-center space-x-2 py-2 px-4 rounded-md text-sm font-medium w-full ${selectedTab === 'security' ? 'bg-gray-100 text-black' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        >
          <LockIcon className="w-6 h-6" />
          <span>Account Security</span>
        </button>
        <button
          onClick={() => setSelectedTab('privacy')}
          className={`flex items-center space-x-2 py-2 px-4 rounded-md text-sm font-medium w-full ${selectedTab === 'privacy' ? 'bg-gray-100 text-black' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        >
          <LockIcon className="w-6 h-6" />
          <span>Privacy Settings</span>
        </button>
        <button
          onClick={() => setSelectedTab('notifications')}
          className={`flex items-center space-x-2 py-2 px-4 rounded-md text-sm font-medium w-full ${selectedTab === 'notifications' ? 'bg-gray-100 text-black' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        >
          <BellIcon className="w-6 h-6" />
          <span>Notifications</span>
        </button>
      </div>
      <div className="grid gap-4">
        {renderContent()}
      </div>
    </div>
  );
}

function BellIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function LockIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function UserIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
