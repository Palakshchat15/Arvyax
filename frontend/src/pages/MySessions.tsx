import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SessionCard } from '../components/SessionCard';
import { apiClient, WellnessSession } from '../lib/api';
import { Plus, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export function MySessions() {
  const [sessions, setSessions] = useState<WellnessSession[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const data = await apiClient.getMySessions();
      setSessions(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (sessionId: string) => {
    navigate(`/session-editor/${sessionId}`);
  };

  const handleDelete = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this session?')) {
      return;
    }

    try {
      await apiClient.deleteSession(sessionId);
      setSessions(sessions.filter(s => s._id !== sessionId));
      toast.success('Session deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete session');
    }
  };

  const handleCreateNew = () => {
    navigate('/session-editor');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader className="h-6 w-6 animate-spin text-emerald-600" />
          <span className="text-gray-600">Loading your sessions...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Sessions
            </h1>
            <p className="text-gray-600">
              Manage your wellness sessions and drafts
            </p>
          </div>
          
          <button
            onClick={handleCreateNew}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>New Session</span>
          </button>
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No sessions yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first wellness session to get started
              </p>
              <button
                onClick={handleCreateNew}
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors inline-flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Create First Session</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <SessionCard
                key={session._id}
                session={session}
                onEdit={() => handleEdit(session._id)}
                onDelete={() => handleDelete(session._id)}
                showStatus={true}
                showActions={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}