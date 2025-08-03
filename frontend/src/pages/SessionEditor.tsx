import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient, WellnessSession } from '../lib/api';
import { Save, Send, ArrowLeft, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export function SessionEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [session, setSession] = useState({
    title: '',
    tags: [] as string[],
    json_file_url: '',
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);

  // Auto-save functionality
  const autoSave = useCallback(
    async (sessionData: typeof session) => {
      if (!sessionData.title.trim()) return;

      try {
        setAutoSaving(true);
        await apiClient.saveDraft({
          id: id,
          ...sessionData,
        });
        toast.success('Draft auto-saved', {
          icon: '💾',
          duration: 2000,
        });
      } catch (error: any) {
        toast.error('Auto-save failed');
      } finally {
        setAutoSaving(false);
      }
    },
    [id]
  );

  // Debounced auto-save effect
  useEffect(() => {
    if (!session.title.trim()) return;

    const timeoutId = setTimeout(() => {
      autoSave(session);
    }, 5000); // Auto-save after 5 seconds of inactivity

    return () => clearTimeout(timeoutId);
  }, [session, autoSave]);

  useEffect(() => {
    if (isEditing) {
      loadSession();
    }
  }, [id, isEditing]);

  const loadSession = async () => {
    if (!id) return;

    try {
      const data = await apiClient.getMySession(id);
      setSession({
        title: data.title,
        tags: data.tags,
        json_file_url: data.json_file_url || '',
      });
      setTagInput(data.tags.join(', '));
    } catch (error: any) {
      toast.error(error.message || 'Failed to load session');
      navigate('/my-sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof session, value: string | string[]) => {
    setSession(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTagInputChange = (value: string) => {
    setTagInput(value);
    const tags = value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    handleInputChange('tags', tags);
  };

  const handleSaveDraft = async () => {
    if (!session.title.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      setSaving(true);
      const response = await apiClient.saveDraft({
        id: id,
        ...session,
      });
      
      toast.success('Draft saved successfully');
      
      if (!isEditing) {
        navigate(`/session-editor/${response.session._id}`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!session.title.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      setPublishing(true);
      await apiClient.publishSession({
        id: id,
        ...session,
      });
      
      toast.success('Session published successfully!');
      navigate('/my-sessions');
    } catch (error: any) {
      toast.error(error.message || 'Failed to publish session');
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader className="h-6 w-6 animate-spin text-emerald-600" />
          <span className="text-gray-600">Loading session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/my-sessions')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEditing ? 'Edit Session' : 'Create New Session'}
              </h1>
              <p className="text-gray-600">
                Design your wellness session and share it with the community
              </p>
            </div>
          </div>

          {autoSaving && (
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600"></div>
              <span>Auto-saving...</span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Session Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={session.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter a descriptive title for your wellness session"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  value={tagInput}
                  onChange={(e) => handleTagInputChange(e.target.value)}
                  placeholder="yoga, meditation, relaxation (separate with commas)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                />
                {session.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {session.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="json_url" className="block text-sm font-medium text-gray-700 mb-2">
                  Session Data URL
                </label>
                <input
                  type="url"
                  id="json_url"
                  value={session.json_file_url}
                  onChange={(e) => handleInputChange('json_file_url', e.target.value)}
                  placeholder="https://example.com/session-data.json"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Optional: Link to your session configuration or data file
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-8 py-4 rounded-b-xl border-t border-gray-200">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                {isEditing ? 'Changes are auto-saved after 5 seconds of inactivity' : 'Save as draft first to enable auto-save'}
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleSaveDraft}
                  disabled={saving || !session.title.trim()}
                  className="flex items-center space-x-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>{saving ? 'Saving...' : 'Save Draft'}</span>
                </button>
                
                <button
                  onClick={handlePublish}
                  disabled={publishing || !session.title.trim()}
                  className="flex items-center space-x-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {publishing ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span>{publishing ? 'Publishing...' : 'Publish Session'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}