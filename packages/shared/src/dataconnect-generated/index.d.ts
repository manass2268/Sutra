import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Contact_Key {
  id: UUIDString;
  __typename?: 'Contact_Key';
}

export interface Conversation_Key {
  id: UUIDString;
  __typename?: 'Conversation_Key';
}

export interface CreateContactData {
  contact_insert: Contact_Key;
}

export interface CreateConversationData {
  conversation_insert: Conversation_Key;
}

export interface CreateMessageData {
  message_insert: Message_Key;
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface CreateUserProfileData {
  userProfile_insert: UserProfile_Key;
}

export interface DeleteContactData {
  contact_delete?: Contact_Key | null;
}

export interface DeleteConversationData {
  conversation_delete?: Conversation_Key | null;
}

export interface DeleteMessageData {
  message_delete?: Message_Key | null;
}

export interface DeleteUserData {
  user_delete?: User_Key | null;
}

export interface DeleteUserProfileData {
  userProfile_delete?: UserProfile_Key | null;
}

export interface GetContactData {
  contact?: {
    status: string;
    nickname?: string | null;
  };
}

export interface GetConversationData {
  conversation?: {
    lastMessageSnippet?: string | null;
  };
}

export interface GetMessageData {
  message?: {
    content: string;
  };
}

export interface GetUserData {
  user?: {
    username: string;
    email: string;
  };
}

export interface GetUserProfileData {
  userProfile?: {
    themePreference: string;
  };
}

export interface ListContactsData {
  contacts: ({
    contact: {
      username: string;
    };
  })[];
}

export interface ListConversationsData {
  conversations: ({
    id: UUIDString;
  } & Conversation_Key)[];
}

export interface ListMessagesData {
  messages: ({
    content: string;
  })[];
}

export interface ListUserProfilesData {
  userProfiles: ({
    user: {
      username: string;
    };
  })[];
}

export interface ListUsersData {
  users: ({
    username: string;
  })[];
}

export interface Message_Key {
  id: UUIDString;
  __typename?: 'Message_Key';
}

export interface UpdateContactData {
  contact_update?: Contact_Key | null;
}

export interface UpdateConversationData {
  conversation_update?: Conversation_Key | null;
}

export interface UpdateMessageData {
  message_update?: Message_Key | null;
}

export interface UpdateUserData {
  user_update?: User_Key | null;
}

export interface UpdateUserProfileData {
  userProfile_update?: UserProfile_Key | null;
}

export interface UserProfile_Key {
  id: UUIDString;
  __typename?: 'UserProfile_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateUserData, undefined>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(): MutationPromise<CreateUserData, undefined>;
export function createUser(dc: DataConnect): MutationPromise<CreateUserData, undefined>;

interface UpdateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<UpdateUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<UpdateUserData, undefined>;
  operationName: string;
}
export const updateUserRef: UpdateUserRef;

export function updateUser(): MutationPromise<UpdateUserData, undefined>;
export function updateUser(dc: DataConnect): MutationPromise<UpdateUserData, undefined>;

interface DeleteUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<DeleteUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<DeleteUserData, undefined>;
  operationName: string;
}
export const deleteUserRef: DeleteUserRef;

export function deleteUser(): MutationPromise<DeleteUserData, undefined>;
export function deleteUser(dc: DataConnect): MutationPromise<DeleteUserData, undefined>;

interface GetUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetUserData, undefined>;
  operationName: string;
}
export const getUserRef: GetUserRef;

export function getUser(options?: ExecuteQueryOptions): QueryPromise<GetUserData, undefined>;
export function getUser(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetUserData, undefined>;

interface ListUsersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUsersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListUsersData, undefined>;
  operationName: string;
}
export const listUsersRef: ListUsersRef;

export function listUsers(options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;
export function listUsers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;

interface CreateUserProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateUserProfileData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateUserProfileData, undefined>;
  operationName: string;
}
export const createUserProfileRef: CreateUserProfileRef;

export function createUserProfile(): MutationPromise<CreateUserProfileData, undefined>;
export function createUserProfile(dc: DataConnect): MutationPromise<CreateUserProfileData, undefined>;

interface UpdateUserProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<UpdateUserProfileData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<UpdateUserProfileData, undefined>;
  operationName: string;
}
export const updateUserProfileRef: UpdateUserProfileRef;

export function updateUserProfile(): MutationPromise<UpdateUserProfileData, undefined>;
export function updateUserProfile(dc: DataConnect): MutationPromise<UpdateUserProfileData, undefined>;

interface DeleteUserProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<DeleteUserProfileData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<DeleteUserProfileData, undefined>;
  operationName: string;
}
export const deleteUserProfileRef: DeleteUserProfileRef;

export function deleteUserProfile(): MutationPromise<DeleteUserProfileData, undefined>;
export function deleteUserProfile(dc: DataConnect): MutationPromise<DeleteUserProfileData, undefined>;

interface GetUserProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUserProfileData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetUserProfileData, undefined>;
  operationName: string;
}
export const getUserProfileRef: GetUserProfileRef;

export function getUserProfile(options?: ExecuteQueryOptions): QueryPromise<GetUserProfileData, undefined>;
export function getUserProfile(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetUserProfileData, undefined>;

interface ListUserProfilesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUserProfilesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListUserProfilesData, undefined>;
  operationName: string;
}
export const listUserProfilesRef: ListUserProfilesRef;

export function listUserProfiles(options?: ExecuteQueryOptions): QueryPromise<ListUserProfilesData, undefined>;
export function listUserProfiles(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListUserProfilesData, undefined>;

interface CreateConversationRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateConversationData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateConversationData, undefined>;
  operationName: string;
}
export const createConversationRef: CreateConversationRef;

export function createConversation(): MutationPromise<CreateConversationData, undefined>;
export function createConversation(dc: DataConnect): MutationPromise<CreateConversationData, undefined>;

interface UpdateConversationRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<UpdateConversationData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<UpdateConversationData, undefined>;
  operationName: string;
}
export const updateConversationRef: UpdateConversationRef;

export function updateConversation(): MutationPromise<UpdateConversationData, undefined>;
export function updateConversation(dc: DataConnect): MutationPromise<UpdateConversationData, undefined>;

interface DeleteConversationRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<DeleteConversationData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<DeleteConversationData, undefined>;
  operationName: string;
}
export const deleteConversationRef: DeleteConversationRef;

export function deleteConversation(): MutationPromise<DeleteConversationData, undefined>;
export function deleteConversation(dc: DataConnect): MutationPromise<DeleteConversationData, undefined>;

interface GetConversationRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetConversationData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetConversationData, undefined>;
  operationName: string;
}
export const getConversationRef: GetConversationRef;

export function getConversation(options?: ExecuteQueryOptions): QueryPromise<GetConversationData, undefined>;
export function getConversation(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetConversationData, undefined>;

interface ListConversationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListConversationsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListConversationsData, undefined>;
  operationName: string;
}
export const listConversationsRef: ListConversationsRef;

export function listConversations(options?: ExecuteQueryOptions): QueryPromise<ListConversationsData, undefined>;
export function listConversations(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListConversationsData, undefined>;

interface CreateMessageRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateMessageData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateMessageData, undefined>;
  operationName: string;
}
export const createMessageRef: CreateMessageRef;

export function createMessage(): MutationPromise<CreateMessageData, undefined>;
export function createMessage(dc: DataConnect): MutationPromise<CreateMessageData, undefined>;

interface UpdateMessageRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<UpdateMessageData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<UpdateMessageData, undefined>;
  operationName: string;
}
export const updateMessageRef: UpdateMessageRef;

export function updateMessage(): MutationPromise<UpdateMessageData, undefined>;
export function updateMessage(dc: DataConnect): MutationPromise<UpdateMessageData, undefined>;

interface DeleteMessageRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<DeleteMessageData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<DeleteMessageData, undefined>;
  operationName: string;
}
export const deleteMessageRef: DeleteMessageRef;

export function deleteMessage(): MutationPromise<DeleteMessageData, undefined>;
export function deleteMessage(dc: DataConnect): MutationPromise<DeleteMessageData, undefined>;

interface GetMessageRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMessageData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMessageData, undefined>;
  operationName: string;
}
export const getMessageRef: GetMessageRef;

export function getMessage(options?: ExecuteQueryOptions): QueryPromise<GetMessageData, undefined>;
export function getMessage(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMessageData, undefined>;

interface ListMessagesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMessagesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMessagesData, undefined>;
  operationName: string;
}
export const listMessagesRef: ListMessagesRef;

export function listMessages(options?: ExecuteQueryOptions): QueryPromise<ListMessagesData, undefined>;
export function listMessages(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMessagesData, undefined>;

interface CreateContactRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateContactData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateContactData, undefined>;
  operationName: string;
}
export const createContactRef: CreateContactRef;

export function createContact(): MutationPromise<CreateContactData, undefined>;
export function createContact(dc: DataConnect): MutationPromise<CreateContactData, undefined>;

interface UpdateContactRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<UpdateContactData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<UpdateContactData, undefined>;
  operationName: string;
}
export const updateContactRef: UpdateContactRef;

export function updateContact(): MutationPromise<UpdateContactData, undefined>;
export function updateContact(dc: DataConnect): MutationPromise<UpdateContactData, undefined>;

interface DeleteContactRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<DeleteContactData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<DeleteContactData, undefined>;
  operationName: string;
}
export const deleteContactRef: DeleteContactRef;

export function deleteContact(): MutationPromise<DeleteContactData, undefined>;
export function deleteContact(dc: DataConnect): MutationPromise<DeleteContactData, undefined>;

interface GetContactRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetContactData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetContactData, undefined>;
  operationName: string;
}
export const getContactRef: GetContactRef;

export function getContact(options?: ExecuteQueryOptions): QueryPromise<GetContactData, undefined>;
export function getContact(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetContactData, undefined>;

interface ListContactsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListContactsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListContactsData, undefined>;
  operationName: string;
}
export const listContactsRef: ListContactsRef;

export function listContacts(options?: ExecuteQueryOptions): QueryPromise<ListContactsData, undefined>;
export function listContacts(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListContactsData, undefined>;

