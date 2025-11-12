'use client';

import React, { useState, useCallback } from 'react';
import { useComments } from '@/hooks/useComments';
import { CommentType, CreateCommentType } from '@shared/types';
import { RiCloseLine } from 'react-icons/ri';

interface TextCommentsProps {
  textId: string;
  onClose: () => void;
}

export function TextComments({ textId, onClose }: TextCommentsProps) {
  const textComments = useComments(textId);
  const [commentContent, setCommentContent] = useState('');

  const handleSubmit = useCallback(() => {
    if (commentContent.trim()) {
      textComments.createComment({
        text_id: textId,
        content: commentContent.trim(),
        created_by: '' // Will be set by the service
      });
      setCommentContent('');
    }
  }, [commentContent, textId, textComments]);

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-semibold text-gray-700">
          Commentaires ({textComments.comments.length})
        </h4>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <RiCloseLine className="w-4 h-4" />
        </button>
      </div>

      {/* Formulaire d'ajout de commentaire */}
      <div className="mb-4">
        <textarea
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          rows={2}
          placeholder="Ajouter un commentaire..."
        />
        <button
          onClick={handleSubmit}
          disabled={!commentContent.trim() || textComments.isCreating}
          className="mt-2 px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {textComments.isCreating ? 'Ajout...' : 'Ajouter un commentaire'}
        </button>
      </div>

      {/* Liste des commentaires */}
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {textComments.isLoading ? (
          <p className="text-xs text-gray-500">Chargement...</p>
        ) : textComments.comments.length === 0 ? (
          <p className="text-xs text-gray-500">Aucun commentaire</p>
        ) : (
          textComments.comments.map((comment: CommentType) => (
            <div key={comment.id} className="bg-gray-50 rounded p-2 text-sm">
              <p className="text-gray-700">{comment.content}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(comment.created_at).toLocaleDateString('fr-FR')} à {new Date(comment.created_at).toLocaleTimeString('fr-FR')}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

