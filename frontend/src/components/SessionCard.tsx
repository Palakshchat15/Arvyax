import React from 'react';
import { Calendar, Tag, ExternalLink, Edit, Trash2 } from 'lucide-react';
import { WellnessSession } from '../lib/api';

interface SessionCardProps {
  session: WellnessSession;
  onEdit?: () => void;
  onDelete?: () => void;
  showStatus?: boolean;
  showActions?: boolean;
}

export function SessionCard({ 
  session, 
  onEdit, 
  onDelete, 
  showStatus = false, 
  showActions = false 
}: SessionCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getAuthorEmail = () => {
    if (typeof session.user_id === 'object' && session.user_id.email) {
      return session.user_id.email;
    }
    return '';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1 mr-4">
          {session.title}
        </h3>
        <div className="flex items-center space-x-2">
          {showStatus && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              session.status === 'published' 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-amber-100 text-amber-800'
            }`}>
              {session.status}
            </span>
          )}
          {showActions && (
            <div className="flex space-x-1">
              <button
                onClick={onEdit}
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                title="Edit session"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={onDelete}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                title="Delete session"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {session.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {session.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              <Tag className="h-3 w-3" />
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(session.created_at)}</span>
        </div>
        {getAuthorEmail() && (
          <span className="text-gray-400">by {getAuthorEmail()}</span>
        )}
      </div>

      {session.json_file_url && (
        <div className="pt-4 border-t border-gray-100">
          <a
            href={session.json_file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            View Session Data
          </a>
        </div>
      )}
    </div>
  );
}