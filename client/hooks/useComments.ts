import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useWorkspaceContext } from '@/contexts/WorkspaceContext';
import { CommentService } from '@/services/api/commentService';
import { CommentType, CreateCommentType } from '@shared/types';
import { queryKeys } from '@/query/queryKeys';

/**
 * Hook pour la gestion des commentaires
 * ✅ Hook suivant les patterns du projet
 */
export function useComments(textId?: string) {
  // ✅ Context workspace obligatoire
  const { currentWorkspaceId } = useWorkspaceContext();
  const queryClient = useQueryClient();

  // ✅ React Query avec clés standardisées
  const commentsQuery = useQuery({
    queryKey: textId 
      ? queryKeys.comments.byText(currentWorkspaceId, textId)
      : queryKeys.comments.all(currentWorkspaceId),
    queryFn: () => CommentService.getComments(currentWorkspaceId, textId),
    staleTime: 0,
    refetchOnMount: true,
    placeholderData: (previousData) => previousData
  });

  // ✅ Mutation création avec gestion cache
  const createMutation = useMutation({
    mutationFn: (data: CreateCommentType) =>
      CommentService.createComment(currentWorkspaceId, data),
    onSuccess: (newComment) => {
      // ✅ Utiliser le textId du hook (celui de la requête actuelle)
      const currentQueryKey = textId 
        ? queryKeys.comments.byText(currentWorkspaceId, textId)
        : queryKeys.comments.all(currentWorkspaceId);
      
      // Ajouter le nouveau commentaire au cache de la requête actuelle
      queryClient.setQueryData<CommentType[]>(
        currentQueryKey,
        (old) => old ? [newComment, ...old] : [newComment]
      );

      // ✅ Invalider aussi la clé correspondant au text_id du commentaire créé
      // pour s'assurer que toutes les vues sont à jour
      if (newComment.text_id) {
        const commentQueryKey = queryKeys.comments.byText(currentWorkspaceId, newComment.text_id);
        // Si c'est une clé différente de celle actuelle, invalider pour forcer le refetch
        if (JSON.stringify(commentQueryKey) !== JSON.stringify(currentQueryKey)) {
          queryClient.invalidateQueries({
            queryKey: commentQueryKey
          });
        }
      }

      // Invalider aussi la clé générale pour s'assurer de la cohérence
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.all(currentWorkspaceId)
      });
    }
  });

  // ✅ Mutation mise à jour avec gestion cache
  const updateMutation = useMutation({
    mutationFn: ({ commentId, data }: { commentId: string; data: Partial<Pick<CreateCommentType, 'content'>> }) =>
      CommentService.updateComment(currentWorkspaceId, commentId, data),
    onSuccess: (updatedComment) => {
      // Mettre à jour le commentaire dans le cache
      const queryKey = updatedComment.text_id 
        ? queryKeys.comments.byText(currentWorkspaceId, updatedComment.text_id)
        : queryKeys.comments.all(currentWorkspaceId);
      
      queryClient.setQueryData<CommentType[]>(
        queryKey,
        (old) => old ? old.map(comment => 
          comment.id === updatedComment.id ? updatedComment : comment
        ) : [updatedComment]
      );

      // Invalider aussi la clé générale si on filtre par text_id
      if (textId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.comments.all(currentWorkspaceId)
        });
      }
    }
  });

  // ✅ Mutation suppression avec gestion cache
  const deleteMutation = useMutation({
    mutationFn: (commentId: string) => 
      CommentService.deleteComment(currentWorkspaceId, commentId),
    onSuccess: (_, commentId) => {
      // Supprimer le commentaire du cache actuel
      const currentQueryKey = textId 
        ? queryKeys.comments.byText(currentWorkspaceId, textId)
        : queryKeys.comments.all(currentWorkspaceId);
      
      queryClient.setQueryData<CommentType[]>(
        currentQueryKey,
        (old) => old ? old.filter(comment => comment.id !== commentId) : []
      );

      // Invalider aussi la clé générale pour s'assurer de la cohérence
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.all(currentWorkspaceId)
      });
    }
  });

  // ✅ Fonctions utilitaires avec useCallback
  const createComment = useCallback((data: CreateCommentType) => {
    createMutation.mutate(data);
  }, [createMutation]);

  const updateComment = useCallback((commentId: string, data: Partial<Pick<CreateCommentType, 'content'>>) => {
    updateMutation.mutate({ commentId, data });
  }, [updateMutation]);

  const deleteComment = useCallback((commentId: string) => {
    deleteMutation.mutate(commentId);
  }, [deleteMutation]);

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: textId 
        ? queryKeys.comments.byText(currentWorkspaceId, textId)
        : queryKeys.comments.all(currentWorkspaceId)
    });
  }, [currentWorkspaceId, textId, queryClient]);

  // ✅ Return organisé par catégorie
  return {
    // Data
    comments: commentsQuery.data || [],
    // Loading states
    isLoading: commentsQuery.isLoading,
    isRefetching: commentsQuery.isRefetching,
    isError: commentsQuery.isError,
    error: commentsQuery.error,
    // Actions
    createComment,
    updateComment,
    deleteComment,
    // Action states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    // Utils
    refresh
  };
}

