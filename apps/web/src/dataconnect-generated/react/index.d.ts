import { CreateUserData, UpdateUserData, DeleteUserData, GetUserData, ListUsersData, CreateUserProfileData, UpdateUserProfileData, DeleteUserProfileData, GetUserProfileData, ListUserProfilesData, CreateConversationData, UpdateConversationData, DeleteConversationData, GetConversationData, ListConversationsData, CreateMessageData, UpdateMessageData, DeleteMessageData, GetMessageData, ListMessagesData, CreateContactData, UpdateContactData, DeleteContactData, GetContactData, ListContactsData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateUser(options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, void>): UseDataConnectMutationResult<CreateUserData, undefined>;
export function useCreateUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, void>): UseDataConnectMutationResult<CreateUserData, undefined>;

export function useUpdateUser(options?: useDataConnectMutationOptions<UpdateUserData, FirebaseError, void>): UseDataConnectMutationResult<UpdateUserData, undefined>;
export function useUpdateUser(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateUserData, FirebaseError, void>): UseDataConnectMutationResult<UpdateUserData, undefined>;

export function useDeleteUser(options?: useDataConnectMutationOptions<DeleteUserData, FirebaseError, void>): UseDataConnectMutationResult<DeleteUserData, undefined>;
export function useDeleteUser(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteUserData, FirebaseError, void>): UseDataConnectMutationResult<DeleteUserData, undefined>;

export function useGetUser(options?: useDataConnectQueryOptions<GetUserData>): UseDataConnectQueryResult<GetUserData, undefined>;
export function useGetUser(dc: DataConnect, options?: useDataConnectQueryOptions<GetUserData>): UseDataConnectQueryResult<GetUserData, undefined>;

export function useListUsers(options?: useDataConnectQueryOptions<ListUsersData>): UseDataConnectQueryResult<ListUsersData, undefined>;
export function useListUsers(dc: DataConnect, options?: useDataConnectQueryOptions<ListUsersData>): UseDataConnectQueryResult<ListUsersData, undefined>;

export function useCreateUserProfile(options?: useDataConnectMutationOptions<CreateUserProfileData, FirebaseError, void>): UseDataConnectMutationResult<CreateUserProfileData, undefined>;
export function useCreateUserProfile(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserProfileData, FirebaseError, void>): UseDataConnectMutationResult<CreateUserProfileData, undefined>;

export function useUpdateUserProfile(options?: useDataConnectMutationOptions<UpdateUserProfileData, FirebaseError, void>): UseDataConnectMutationResult<UpdateUserProfileData, undefined>;
export function useUpdateUserProfile(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateUserProfileData, FirebaseError, void>): UseDataConnectMutationResult<UpdateUserProfileData, undefined>;

export function useDeleteUserProfile(options?: useDataConnectMutationOptions<DeleteUserProfileData, FirebaseError, void>): UseDataConnectMutationResult<DeleteUserProfileData, undefined>;
export function useDeleteUserProfile(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteUserProfileData, FirebaseError, void>): UseDataConnectMutationResult<DeleteUserProfileData, undefined>;

export function useGetUserProfile(options?: useDataConnectQueryOptions<GetUserProfileData>): UseDataConnectQueryResult<GetUserProfileData, undefined>;
export function useGetUserProfile(dc: DataConnect, options?: useDataConnectQueryOptions<GetUserProfileData>): UseDataConnectQueryResult<GetUserProfileData, undefined>;

export function useListUserProfiles(options?: useDataConnectQueryOptions<ListUserProfilesData>): UseDataConnectQueryResult<ListUserProfilesData, undefined>;
export function useListUserProfiles(dc: DataConnect, options?: useDataConnectQueryOptions<ListUserProfilesData>): UseDataConnectQueryResult<ListUserProfilesData, undefined>;

export function useCreateConversation(options?: useDataConnectMutationOptions<CreateConversationData, FirebaseError, void>): UseDataConnectMutationResult<CreateConversationData, undefined>;
export function useCreateConversation(dc: DataConnect, options?: useDataConnectMutationOptions<CreateConversationData, FirebaseError, void>): UseDataConnectMutationResult<CreateConversationData, undefined>;

export function useUpdateConversation(options?: useDataConnectMutationOptions<UpdateConversationData, FirebaseError, void>): UseDataConnectMutationResult<UpdateConversationData, undefined>;
export function useUpdateConversation(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateConversationData, FirebaseError, void>): UseDataConnectMutationResult<UpdateConversationData, undefined>;

export function useDeleteConversation(options?: useDataConnectMutationOptions<DeleteConversationData, FirebaseError, void>): UseDataConnectMutationResult<DeleteConversationData, undefined>;
export function useDeleteConversation(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteConversationData, FirebaseError, void>): UseDataConnectMutationResult<DeleteConversationData, undefined>;

export function useGetConversation(options?: useDataConnectQueryOptions<GetConversationData>): UseDataConnectQueryResult<GetConversationData, undefined>;
export function useGetConversation(dc: DataConnect, options?: useDataConnectQueryOptions<GetConversationData>): UseDataConnectQueryResult<GetConversationData, undefined>;

export function useListConversations(options?: useDataConnectQueryOptions<ListConversationsData>): UseDataConnectQueryResult<ListConversationsData, undefined>;
export function useListConversations(dc: DataConnect, options?: useDataConnectQueryOptions<ListConversationsData>): UseDataConnectQueryResult<ListConversationsData, undefined>;

export function useCreateMessage(options?: useDataConnectMutationOptions<CreateMessageData, FirebaseError, void>): UseDataConnectMutationResult<CreateMessageData, undefined>;
export function useCreateMessage(dc: DataConnect, options?: useDataConnectMutationOptions<CreateMessageData, FirebaseError, void>): UseDataConnectMutationResult<CreateMessageData, undefined>;

export function useUpdateMessage(options?: useDataConnectMutationOptions<UpdateMessageData, FirebaseError, void>): UseDataConnectMutationResult<UpdateMessageData, undefined>;
export function useUpdateMessage(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateMessageData, FirebaseError, void>): UseDataConnectMutationResult<UpdateMessageData, undefined>;

export function useDeleteMessage(options?: useDataConnectMutationOptions<DeleteMessageData, FirebaseError, void>): UseDataConnectMutationResult<DeleteMessageData, undefined>;
export function useDeleteMessage(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteMessageData, FirebaseError, void>): UseDataConnectMutationResult<DeleteMessageData, undefined>;

export function useGetMessage(options?: useDataConnectQueryOptions<GetMessageData>): UseDataConnectQueryResult<GetMessageData, undefined>;
export function useGetMessage(dc: DataConnect, options?: useDataConnectQueryOptions<GetMessageData>): UseDataConnectQueryResult<GetMessageData, undefined>;

export function useListMessages(options?: useDataConnectQueryOptions<ListMessagesData>): UseDataConnectQueryResult<ListMessagesData, undefined>;
export function useListMessages(dc: DataConnect, options?: useDataConnectQueryOptions<ListMessagesData>): UseDataConnectQueryResult<ListMessagesData, undefined>;

export function useCreateContact(options?: useDataConnectMutationOptions<CreateContactData, FirebaseError, void>): UseDataConnectMutationResult<CreateContactData, undefined>;
export function useCreateContact(dc: DataConnect, options?: useDataConnectMutationOptions<CreateContactData, FirebaseError, void>): UseDataConnectMutationResult<CreateContactData, undefined>;

export function useUpdateContact(options?: useDataConnectMutationOptions<UpdateContactData, FirebaseError, void>): UseDataConnectMutationResult<UpdateContactData, undefined>;
export function useUpdateContact(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateContactData, FirebaseError, void>): UseDataConnectMutationResult<UpdateContactData, undefined>;

export function useDeleteContact(options?: useDataConnectMutationOptions<DeleteContactData, FirebaseError, void>): UseDataConnectMutationResult<DeleteContactData, undefined>;
export function useDeleteContact(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteContactData, FirebaseError, void>): UseDataConnectMutationResult<DeleteContactData, undefined>;

export function useGetContact(options?: useDataConnectQueryOptions<GetContactData>): UseDataConnectQueryResult<GetContactData, undefined>;
export function useGetContact(dc: DataConnect, options?: useDataConnectQueryOptions<GetContactData>): UseDataConnectQueryResult<GetContactData, undefined>;

export function useListContacts(options?: useDataConnectQueryOptions<ListContactsData>): UseDataConnectQueryResult<ListContactsData, undefined>;
export function useListContacts(dc: DataConnect, options?: useDataConnectQueryOptions<ListContactsData>): UseDataConnectQueryResult<ListContactsData, undefined>;
