'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { RiCloseLine, RiEditLine } from 'react-icons/ri';
import { TextType } from '@shared/types';

/**
 * Props pour le composant EditTextModal
 * ✅ Conforme au pattern Agentova
 */
interface EditTextModalProps {
  isOpen: boolean;
  text: TextType | null;
  onSave: (textId: string, data: { title?: string; content: string }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

/**
 * Modale d'édition de texte
 * ✅ Conforme à l'architecture Agentova
 */
export const EditTextModal: React.FC<EditTextModalProps> = ({
  isOpen,
  text,
  onSave,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

  // ✅ Initialiser le formulaire avec les données du texte
  useEffect(() => {
    if (text && isOpen) {
      setFormData({
        title: text.title || '',
        content: text.content || ''
      });
      setErrors({});
    }
  }, [text, isOpen]);

  // ✅ Validation du formulaire
  const validateForm = useCallback((): boolean => {
    const newErrors: { title?: string; content?: string } = {};

    if (!formData.content.trim()) {
      newErrors.content = 'Le contenu est requis';
    } else if (formData.content.trim().length > 10000) {
      newErrors.content = 'Le contenu ne peut dépasser 10000 caractères';
    }

    if (formData.title && formData.title.trim().length > 255) {
      newErrors.title = 'Le titre ne peut dépasser 255 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // ✅ Handler stabilisé avec useCallback
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && text && !isLoading) {
      onSave(text.id, {
        title: formData.title.trim() || undefined,
        content: formData.content.trim()
      });
    }
  }, [formData, text, validateForm, onSave, isLoading]);

  const handleCancel = useCallback(() => {
    if (!isLoading) {
      setFormData({ title: '', content: '' });
      setErrors({});
      onCancel();
    }
  }, [onCancel, isLoading]);

  // ✅ Gestion de la fermeture avec Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        handleCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, isLoading, handleCancel]);

  // ✅ Empêcher le scroll du body quand la modale est ouverte
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !text) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleCancel}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start mb-4">
            <div className="flex-shrink-0 text-blue-600">
              <RiEditLine className="w-6 h-6" />
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                Modifier le texte
              </h3>
            </div>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="ml-4 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded disabled:opacity-50"
              aria-label="Fermer"
            >
              <RiCloseLine className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Titre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre (optionnel)
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (errors.title) setErrors({ ...errors, title: undefined });
                }}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.title
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Titre du texte..."
                disabled={isLoading}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Contenu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenu *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => {
                  setFormData({ ...formData, content: e.target.value });
                  if (errors.content) setErrors({ ...errors, content: undefined });
                }}
                rows={8}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.content
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Contenu du texte..."
                required
                disabled={isLoading}
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.content.length} / 10000 caractères
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isLoading || !formData.content.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Enregistrement...
                  </span>
                ) : (
                  'Enregistrer'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

