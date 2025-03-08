import React, { useState, useEffect } from 'react';
import { History, Users, Database, LogOut, Coins } from 'lucide-react';
import LeadsSection from './LeadsSection';
import HistorySection from './HistorySection';
import UserSection from './UserSection';

interface DashboardProps {
  user: {
    userName: string;
    credits: number;
  };
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeSection, setActiveSection] = useState('leads');
  const [credits, setCredits] = useState(user.credits);

  useEffect(() => {
    const fetchCredits = async () => {
      const userToken = localStorage.getItem('token');
      if (!userToken) {
        console.error('User token not found');
        return;
      }

      try {
        const response = await fetch('https://7cvccltb-5000.inc1.devtunnels.ms/api/users/get-credits', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userToken }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch credits');
        }

        const data = await response.json();
        setCredits(data.credits);
      } catch (error) {
        console.error('Error fetching credits:', error);
      }
    };

    fetchCredits();
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case 'leads':
        return <LeadsSection />;
      case 'history':
        return <HistorySection />;
      case 'user':
        return <UserSection user={user} />;
      default:
        return <LeadsSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-gray-800">Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              {/* <div className="flex items-center space-x-2">
                <Coins className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-semibold">{credits} Credits</span>
              </div> */}
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="space-y-2">
                <button
                  onClick={() => setActiveSection('leads')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeSection === 'leads'
                      ? 'bg-blue-500 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <Database className="w-5 h-5" />
                  <span>Get Leads</span>
                </button>
                <button
                  onClick={() => setActiveSection('history')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeSection === 'history'
                      ? 'bg-blue-500 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <History className="w-5 h-5" />
                  <span>History</span>
                </button>
                <button
                  onClick={() => setActiveSection('user')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeSection === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span>User Profile</span>
                </button>
              </div>
            </div>
          </div>
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              {renderSection()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
