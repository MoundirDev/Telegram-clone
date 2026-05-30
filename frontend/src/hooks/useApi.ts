import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import { useAuthStore } from '../lib/store';

/**
 * Hook for getting conversations
 */
export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: () => apiClient.getConversations(),
    enabled: true,
  });
};

/**
 * Hook for getting conversation details
 */
export const useConversationDetails = (conversationId: string | null) => {
  return useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => apiClient.getConversationDetails(conversationId!),
    enabled: !!conversationId,
  });
};

/**
 * Hook for getting messages
 */
export const useMessages = (conversationId: string | null, page = 1) => {
  return useQuery({
    queryKey: ['messages', conversationId, page],
    queryFn: () => apiClient.getMessages(conversationId!, page),
    enabled: !!conversationId,
  });
};

export const useAllMessages = (conversationId: string | null) => {
  return useQuery({
    queryKey: ['messages', conversationId, 'all'],
    queryFn: () => apiClient.getAllMessages(conversationId!),
    enabled: !!conversationId,
  });
};

export const useSearchInChat = (conversationId: string | null, query: string) => {
  return useQuery({
    queryKey: ['messages', conversationId, 'search', query],
    queryFn: () => apiClient.searchMessagesInChat(conversationId!, query),
    enabled: !!conversationId && query.trim().length > 0,
  });
};

export const useClearChatHistory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (conversationId: string) => apiClient.clearChatHistory(conversationId),
    onSuccess: (_d, conversationId) => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] });
    },
  });
};

export const useDeleteConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (conversationId: string) => apiClient.deleteConversation(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useUpdateGroupConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ conversationId, name }: { conversationId: string; name: string }) =>
      apiClient.updateGroupConversation(conversationId, name),
    onSuccess: (_d, vars) => {
      queryClient.invalidateQueries({ queryKey: ['conversation', vars.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useLeaveGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      conversationId,
      userId,
    }: {
      conversationId: string;
      userId: string;
    }) => apiClient.removeMemberFromGroup(conversationId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

/**
 * Hook for creating private conversation
 */
export const useCreatePrivateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (otherUserId: string) => apiClient.createPrivateConversation(otherUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

/**
 * Hook for creating group conversation
 */
export const useCreateGroupConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, memberIds }: { name: string; memberIds: string[] }) =>
      apiClient.createGroupConversation(name, memberIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

/**
 * Hook for sending message
 */
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
      content,
      files,
    }: {
      conversationId: string;
      content: string;
      files?: File[];
    }) => apiClient.sendMessage(conversationId, content, files),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({
        queryKey: ['conversation', variables.conversationId],
      });
    },
  });
};

/**
 * Hook for searching users
 */
export const useSearchUsers = (query: string) => {
  return useQuery({
    queryKey: ['users', 'search', query],
    queryFn: () => apiClient.searchUsers(query),
    enabled: query.length > 0,
  });
};

/**
 * Hook for getting user profile
 */
export const useUserProfile = (userId: string | null) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => apiClient.getUserProfile(userId!),
    enabled: !!userId,
  });
};

/**
 * Hook for updating user profile
 */
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  const token = useAuthStore(state => state.token);
  const setAuth = useAuthStore(state => state.setAuth);

  return useMutation({
    mutationFn: (formData: FormData) => apiClient.updateUserProfile(formData),
    onSuccess: user => {
      if (token) {
        setAuth(user, token);
      }
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};
