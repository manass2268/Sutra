import { ConnectorConfig, DataConnect, OperationOptions, ExecuteOperationResponse } from 'firebase-admin/data-connect';

export const connectorConfig: ConnectorConfig;

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

/** Generated Node Admin SDK operation action function for the 'CreateUser' Mutation. Allow users to execute without passing in DataConnect. */
export function createUser(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateUserData>>;
/** Generated Node Admin SDK operation action function for the 'CreateUser' Mutation. Allow users to pass in custom DataConnect instances. */
export function createUser(options?: OperationOptions): Promise<ExecuteOperationResponse<CreateUserData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateUser' Mutation. Allow users to execute without passing in DataConnect. */
export function updateUser(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateUserData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateUser' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateUser(options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateUserData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteUser' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteUser(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteUserData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteUser' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteUser(options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteUserData>>;

/** Generated Node Admin SDK operation action function for the 'GetUser' Query. Allow users to execute without passing in DataConnect. */
export function getUser(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<GetUserData>>;
/** Generated Node Admin SDK operation action function for the 'GetUser' Query. Allow users to pass in custom DataConnect instances. */
export function getUser(options?: OperationOptions): Promise<ExecuteOperationResponse<GetUserData>>;

/** Generated Node Admin SDK operation action function for the 'ListUsers' Query. Allow users to execute without passing in DataConnect. */
export function listUsers(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListUsersData>>;
/** Generated Node Admin SDK operation action function for the 'ListUsers' Query. Allow users to pass in custom DataConnect instances. */
export function listUsers(options?: OperationOptions): Promise<ExecuteOperationResponse<ListUsersData>>;

/** Generated Node Admin SDK operation action function for the 'CreateUserProfile' Mutation. Allow users to execute without passing in DataConnect. */
export function createUserProfile(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateUserProfileData>>;
/** Generated Node Admin SDK operation action function for the 'CreateUserProfile' Mutation. Allow users to pass in custom DataConnect instances. */
export function createUserProfile(options?: OperationOptions): Promise<ExecuteOperationResponse<CreateUserProfileData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateUserProfile' Mutation. Allow users to execute without passing in DataConnect. */
export function updateUserProfile(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateUserProfileData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateUserProfile' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateUserProfile(options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateUserProfileData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteUserProfile' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteUserProfile(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteUserProfileData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteUserProfile' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteUserProfile(options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteUserProfileData>>;

/** Generated Node Admin SDK operation action function for the 'GetUserProfile' Query. Allow users to execute without passing in DataConnect. */
export function getUserProfile(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<GetUserProfileData>>;
/** Generated Node Admin SDK operation action function for the 'GetUserProfile' Query. Allow users to pass in custom DataConnect instances. */
export function getUserProfile(options?: OperationOptions): Promise<ExecuteOperationResponse<GetUserProfileData>>;

/** Generated Node Admin SDK operation action function for the 'ListUserProfiles' Query. Allow users to execute without passing in DataConnect. */
export function listUserProfiles(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListUserProfilesData>>;
/** Generated Node Admin SDK operation action function for the 'ListUserProfiles' Query. Allow users to pass in custom DataConnect instances. */
export function listUserProfiles(options?: OperationOptions): Promise<ExecuteOperationResponse<ListUserProfilesData>>;

/** Generated Node Admin SDK operation action function for the 'CreateConversation' Mutation. Allow users to execute without passing in DataConnect. */
export function createConversation(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateConversationData>>;
/** Generated Node Admin SDK operation action function for the 'CreateConversation' Mutation. Allow users to pass in custom DataConnect instances. */
export function createConversation(options?: OperationOptions): Promise<ExecuteOperationResponse<CreateConversationData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateConversation' Mutation. Allow users to execute without passing in DataConnect. */
export function updateConversation(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateConversationData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateConversation' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateConversation(options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateConversationData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteConversation' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteConversation(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteConversationData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteConversation' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteConversation(options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteConversationData>>;

/** Generated Node Admin SDK operation action function for the 'GetConversation' Query. Allow users to execute without passing in DataConnect. */
export function getConversation(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<GetConversationData>>;
/** Generated Node Admin SDK operation action function for the 'GetConversation' Query. Allow users to pass in custom DataConnect instances. */
export function getConversation(options?: OperationOptions): Promise<ExecuteOperationResponse<GetConversationData>>;

/** Generated Node Admin SDK operation action function for the 'ListConversations' Query. Allow users to execute without passing in DataConnect. */
export function listConversations(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListConversationsData>>;
/** Generated Node Admin SDK operation action function for the 'ListConversations' Query. Allow users to pass in custom DataConnect instances. */
export function listConversations(options?: OperationOptions): Promise<ExecuteOperationResponse<ListConversationsData>>;

/** Generated Node Admin SDK operation action function for the 'CreateMessage' Mutation. Allow users to execute without passing in DataConnect. */
export function createMessage(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateMessageData>>;
/** Generated Node Admin SDK operation action function for the 'CreateMessage' Mutation. Allow users to pass in custom DataConnect instances. */
export function createMessage(options?: OperationOptions): Promise<ExecuteOperationResponse<CreateMessageData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateMessage' Mutation. Allow users to execute without passing in DataConnect. */
export function updateMessage(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateMessageData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateMessage' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateMessage(options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateMessageData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteMessage' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteMessage(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteMessageData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteMessage' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteMessage(options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteMessageData>>;

/** Generated Node Admin SDK operation action function for the 'GetMessage' Query. Allow users to execute without passing in DataConnect. */
export function getMessage(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<GetMessageData>>;
/** Generated Node Admin SDK operation action function for the 'GetMessage' Query. Allow users to pass in custom DataConnect instances. */
export function getMessage(options?: OperationOptions): Promise<ExecuteOperationResponse<GetMessageData>>;

/** Generated Node Admin SDK operation action function for the 'ListMessages' Query. Allow users to execute without passing in DataConnect. */
export function listMessages(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListMessagesData>>;
/** Generated Node Admin SDK operation action function for the 'ListMessages' Query. Allow users to pass in custom DataConnect instances. */
export function listMessages(options?: OperationOptions): Promise<ExecuteOperationResponse<ListMessagesData>>;

/** Generated Node Admin SDK operation action function for the 'CreateContact' Mutation. Allow users to execute without passing in DataConnect. */
export function createContact(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateContactData>>;
/** Generated Node Admin SDK operation action function for the 'CreateContact' Mutation. Allow users to pass in custom DataConnect instances. */
export function createContact(options?: OperationOptions): Promise<ExecuteOperationResponse<CreateContactData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateContact' Mutation. Allow users to execute without passing in DataConnect. */
export function updateContact(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateContactData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateContact' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateContact(options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateContactData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteContact' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteContact(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteContactData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteContact' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteContact(options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteContactData>>;

/** Generated Node Admin SDK operation action function for the 'GetContact' Query. Allow users to execute without passing in DataConnect. */
export function getContact(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<GetContactData>>;
/** Generated Node Admin SDK operation action function for the 'GetContact' Query. Allow users to pass in custom DataConnect instances. */
export function getContact(options?: OperationOptions): Promise<ExecuteOperationResponse<GetContactData>>;

/** Generated Node Admin SDK operation action function for the 'ListContacts' Query. Allow users to execute without passing in DataConnect. */
export function listContacts(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListContactsData>>;
/** Generated Node Admin SDK operation action function for the 'ListContacts' Query. Allow users to pass in custom DataConnect instances. */
export function listContacts(options?: OperationOptions): Promise<ExecuteOperationResponse<ListContactsData>>;

