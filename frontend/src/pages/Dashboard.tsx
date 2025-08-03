import React, { useEffect, useState } from 'react';
import { SessionCard } from '../components/SessionCard';
import { apiClient, WellnessSession } from '../lib/api';
import { Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export function Dashboard() {
  const [sessions, setSessions] = useState<WellnessSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const data = await apiClient.getPublicSessions();
      setSessions(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader className="h-6 w-6 animate-spin text-emerald-600" />
          <span className="text-gray-600">Loading sessions...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Wellness Sessions
          </h1>
          <p className="text-gray-600">
            Discover guided wellness sessions created by our community
          </p>
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No sessions available yet
              </h3>
              <p className="text-gray-600">
                Be the first to publish a wellness session for the community!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <SessionCard
                key={session._id}
                session={session}
                showStatus={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}