# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetUser*](#getuser)
  - [*ListUsers*](#listusers)
  - [*GetUserProfile*](#getuserprofile)
  - [*ListUserProfiles*](#listuserprofiles)
  - [*GetConversation*](#getconversation)
  - [*ListConversations*](#listconversations)
  - [*GetMessage*](#getmessage)
  - [*ListMessages*](#listmessages)
  - [*GetContact*](#getcontact)
  - [*ListContacts*](#listcontacts)
- [**Mutations**](#mutations)
  - [*CreateUser*](#createuser)
  - [*UpdateUser*](#updateuser)
  - [*DeleteUser*](#deleteuser)
  - [*CreateUserProfile*](#createuserprofile)
  - [*UpdateUserProfile*](#updateuserprofile)
  - [*DeleteUserProfile*](#deleteuserprofile)
  - [*CreateConversation*](#createconversation)
  - [*UpdateConversation*](#updateconversation)
  - [*DeleteConversation*](#deleteconversation)
  - [*CreateMessage*](#createmessage)
  - [*UpdateMessage*](#updatemessage)
  - [*DeleteMessage*](#deletemessage)
  - [*CreateContact*](#createcontact)
  - [*UpdateContact*](#updatecontact)
  - [*DeleteContact*](#deletecontact)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetUser
You can execute the `GetUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getUser(options?: ExecuteQueryOptions): QueryPromise<GetUserData, undefined>;

interface GetUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUserData, undefined>;
}
export const getUserRef: GetUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUser(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetUserData, undefined>;

interface GetUserRef {
  ...
  (dc: DataConnect): QueryRef<GetUserData, undefined>;
}
export const getUserRef: GetUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserRef:
```typescript
const name = getUserRef.operationName;
console.log(name);
```

### Variables
The `GetUser` query has no variables.
### Return Type
Recall that executing the `GetUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserData {
  user?: {
    username: string;
    email: string;
  };
}
```
### Using `GetUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUser } from '@dataconnect/generated';


// Call the `getUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUser(dataConnect);

console.log(data.user);

// Or, you can use the `Promise` API.
getUser().then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserRef } from '@dataconnect/generated';


// Call the `getUserRef()` function to get a reference to the query.
const ref = getUserRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## ListUsers
You can execute the `ListUsers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listUsers(options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;

interface ListUsersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUsersData, undefined>;
}
export const listUsersRef: ListUsersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listUsers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;

interface ListUsersRef {
  ...
  (dc: DataConnect): QueryRef<ListUsersData, undefined>;
}
export const listUsersRef: ListUsersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listUsersRef:
```typescript
const name = listUsersRef.operationName;
console.log(name);
```

### Variables
The `ListUsers` query has no variables.
### Return Type
Recall that executing the `ListUsers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListUsersData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListUsersData {
  users: ({
    username: string;
  })[];
}
```
### Using `ListUsers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listUsers } from '@dataconnect/generated';


// Call the `listUsers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listUsers();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listUsers(dataConnect);

console.log(data.users);

// Or, you can use the `Promise` API.
listUsers().then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `ListUsers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listUsersRef } from '@dataconnect/generated';


// Call the `listUsersRef()` function to get a reference to the query.
const ref = listUsersRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listUsersRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.users);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

## GetUserProfile
You can execute the `GetUserProfile` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getUserProfile(options?: ExecuteQueryOptions): QueryPromise<GetUserProfileData, undefined>;

interface GetUserProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUserProfileData, undefined>;
}
export const getUserProfileRef: GetUserProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserProfile(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetUserProfileData, undefined>;

interface GetUserProfileRef {
  ...
  (dc: DataConnect): QueryRef<GetUserProfileData, undefined>;
}
export const getUserProfileRef: GetUserProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserProfileRef:
```typescript
const name = getUserProfileRef.operationName;
console.log(name);
```

### Variables
The `GetUserProfile` query has no variables.
### Return Type
Recall that executing the `GetUserProfile` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserProfileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserProfileData {
  userProfile?: {
    themePreference: string;
  };
}
```
### Using `GetUserProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserProfile } from '@dataconnect/generated';


// Call the `getUserProfile()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserProfile();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserProfile(dataConnect);

console.log(data.userProfile);

// Or, you can use the `Promise` API.
getUserProfile().then((response) => {
  const data = response.data;
  console.log(data.userProfile);
});
```

### Using `GetUserProfile`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserProfileRef } from '@dataconnect/generated';


// Call the `getUserProfileRef()` function to get a reference to the query.
const ref = getUserProfileRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserProfileRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.userProfile);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.userProfile);
});
```

## ListUserProfiles
You can execute the `ListUserProfiles` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listUserProfiles(options?: ExecuteQueryOptions): QueryPromise<ListUserProfilesData, undefined>;

interface ListUserProfilesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUserProfilesData, undefined>;
}
export const listUserProfilesRef: ListUserProfilesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listUserProfiles(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListUserProfilesData, undefined>;

interface ListUserProfilesRef {
  ...
  (dc: DataConnect): QueryRef<ListUserProfilesData, undefined>;
}
export const listUserProfilesRef: ListUserProfilesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listUserProfilesRef:
```typescript
const name = listUserProfilesRef.operationName;
console.log(name);
```

### Variables
The `ListUserProfiles` query has no variables.
### Return Type
Recall that executing the `ListUserProfiles` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListUserProfilesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListUserProfilesData {
  userProfiles: ({
    user: {
      username: string;
    };
  })[];
}
```
### Using `ListUserProfiles`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listUserProfiles } from '@dataconnect/generated';


// Call the `listUserProfiles()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listUserProfiles();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listUserProfiles(dataConnect);

console.log(data.userProfiles);

// Or, you can use the `Promise` API.
listUserProfiles().then((response) => {
  const data = response.data;
  console.log(data.userProfiles);
});
```

### Using `ListUserProfiles`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listUserProfilesRef } from '@dataconnect/generated';


// Call the `listUserProfilesRef()` function to get a reference to the query.
const ref = listUserProfilesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listUserProfilesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.userProfiles);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.userProfiles);
});
```

## GetConversation
You can execute the `GetConversation` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getConversation(options?: ExecuteQueryOptions): QueryPromise<GetConversationData, undefined>;

interface GetConversationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetConversationData, undefined>;
}
export const getConversationRef: GetConversationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getConversation(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetConversationData, undefined>;

interface GetConversationRef {
  ...
  (dc: DataConnect): QueryRef<GetConversationData, undefined>;
}
export const getConversationRef: GetConversationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getConversationRef:
```typescript
const name = getConversationRef.operationName;
console.log(name);
```

### Variables
The `GetConversation` query has no variables.
### Return Type
Recall that executing the `GetConversation` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetConversationData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetConversationData {
  conversation?: {
    lastMessageSnippet?: string | null;
  };
}
```
### Using `GetConversation`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getConversation } from '@dataconnect/generated';


// Call the `getConversation()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getConversation();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getConversation(dataConnect);

console.log(data.conversation);

// Or, you can use the `Promise` API.
getConversation().then((response) => {
  const data = response.data;
  console.log(data.conversation);
});
```

### Using `GetConversation`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getConversationRef } from '@dataconnect/generated';


// Call the `getConversationRef()` function to get a reference to the query.
const ref = getConversationRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getConversationRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.conversation);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.conversation);
});
```

## ListConversations
You can execute the `ListConversations` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listConversations(options?: ExecuteQueryOptions): QueryPromise<ListConversationsData, undefined>;

interface ListConversationsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListConversationsData, undefined>;
}
export const listConversationsRef: ListConversationsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listConversations(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListConversationsData, undefined>;

interface ListConversationsRef {
  ...
  (dc: DataConnect): QueryRef<ListConversationsData, undefined>;
}
export const listConversationsRef: ListConversationsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listConversationsRef:
```typescript
const name = listConversationsRef.operationName;
console.log(name);
```

### Variables
The `ListConversations` query has no variables.
### Return Type
Recall that executing the `ListConversations` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListConversationsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListConversationsData {
  conversations: ({
    id: UUIDString;
  } & Conversation_Key)[];
}
```
### Using `ListConversations`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listConversations } from '@dataconnect/generated';


// Call the `listConversations()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listConversations();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listConversations(dataConnect);

console.log(data.conversations);

// Or, you can use the `Promise` API.
listConversations().then((response) => {
  const data = response.data;
  console.log(data.conversations);
});
```

### Using `ListConversations`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listConversationsRef } from '@dataconnect/generated';


// Call the `listConversationsRef()` function to get a reference to the query.
const ref = listConversationsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listConversationsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.conversations);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.conversations);
});
```

## GetMessage
You can execute the `GetMessage` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMessage(options?: ExecuteQueryOptions): QueryPromise<GetMessageData, undefined>;

interface GetMessageRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMessageData, undefined>;
}
export const getMessageRef: GetMessageRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMessage(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMessageData, undefined>;

interface GetMessageRef {
  ...
  (dc: DataConnect): QueryRef<GetMessageData, undefined>;
}
export const getMessageRef: GetMessageRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMessageRef:
```typescript
const name = getMessageRef.operationName;
console.log(name);
```

### Variables
The `GetMessage` query has no variables.
### Return Type
Recall that executing the `GetMessage` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMessageData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMessageData {
  message?: {
    content: string;
  };
}
```
### Using `GetMessage`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMessage } from '@dataconnect/generated';


// Call the `getMessage()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMessage();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMessage(dataConnect);

console.log(data.message);

// Or, you can use the `Promise` API.
getMessage().then((response) => {
  const data = response.data;
  console.log(data.message);
});
```

### Using `GetMessage`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMessageRef } from '@dataconnect/generated';


// Call the `getMessageRef()` function to get a reference to the query.
const ref = getMessageRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMessageRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.message);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.message);
});
```

## ListMessages
You can execute the `ListMessages` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listMessages(options?: ExecuteQueryOptions): QueryPromise<ListMessagesData, undefined>;

interface ListMessagesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMessagesData, undefined>;
}
export const listMessagesRef: ListMessagesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMessages(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMessagesData, undefined>;

interface ListMessagesRef {
  ...
  (dc: DataConnect): QueryRef<ListMessagesData, undefined>;
}
export const listMessagesRef: ListMessagesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMessagesRef:
```typescript
const name = listMessagesRef.operationName;
console.log(name);
```

### Variables
The `ListMessages` query has no variables.
### Return Type
Recall that executing the `ListMessages` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMessagesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListMessagesData {
  messages: ({
    content: string;
  })[];
}
```
### Using `ListMessages`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMessages } from '@dataconnect/generated';


// Call the `listMessages()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMessages();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMessages(dataConnect);

console.log(data.messages);

// Or, you can use the `Promise` API.
listMessages().then((response) => {
  const data = response.data;
  console.log(data.messages);
});
```

### Using `ListMessages`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMessagesRef } from '@dataconnect/generated';


// Call the `listMessagesRef()` function to get a reference to the query.
const ref = listMessagesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMessagesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.messages);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.messages);
});
```

## GetContact
You can execute the `GetContact` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getContact(options?: ExecuteQueryOptions): QueryPromise<GetContactData, undefined>;

interface GetContactRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetContactData, undefined>;
}
export const getContactRef: GetContactRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getContact(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetContactData, undefined>;

interface GetContactRef {
  ...
  (dc: DataConnect): QueryRef<GetContactData, undefined>;
}
export const getContactRef: GetContactRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getContactRef:
```typescript
const name = getContactRef.operationName;
console.log(name);
```

### Variables
The `GetContact` query has no variables.
### Return Type
Recall that executing the `GetContact` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetContactData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetContactData {
  contact?: {
    status: string;
    nickname?: string | null;
  };
}
```
### Using `GetContact`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getContact } from '@dataconnect/generated';


// Call the `getContact()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getContact();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getContact(dataConnect);

console.log(data.contact);

// Or, you can use the `Promise` API.
getContact().then((response) => {
  const data = response.data;
  console.log(data.contact);
});
```

### Using `GetContact`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getContactRef } from '@dataconnect/generated';


// Call the `getContactRef()` function to get a reference to the query.
const ref = getContactRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getContactRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.contact);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.contact);
});
```

## ListContacts
You can execute the `ListContacts` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listContacts(options?: ExecuteQueryOptions): QueryPromise<ListContactsData, undefined>;

interface ListContactsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListContactsData, undefined>;
}
export const listContactsRef: ListContactsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listContacts(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListContactsData, undefined>;

interface ListContactsRef {
  ...
  (dc: DataConnect): QueryRef<ListContactsData, undefined>;
}
export const listContactsRef: ListContactsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listContactsRef:
```typescript
const name = listContactsRef.operationName;
console.log(name);
```

### Variables
The `ListContacts` query has no variables.
### Return Type
Recall that executing the `ListContacts` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListContactsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListContactsData {
  contacts: ({
    contact: {
      username: string;
    };
  })[];
}
```
### Using `ListContacts`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listContacts } from '@dataconnect/generated';


// Call the `listContacts()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listContacts();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listContacts(dataConnect);

console.log(data.contacts);

// Or, you can use the `Promise` API.
listContacts().then((response) => {
  const data = response.data;
  console.log(data.contacts);
});
```

### Using `ListContacts`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listContactsRef } from '@dataconnect/generated';


// Call the `listContactsRef()` function to get a reference to the query.
const ref = listContactsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listContactsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.contacts);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.contacts);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateUser
You can execute the `CreateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createUser(): MutationPromise<CreateUserData, undefined>;

interface CreateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateUserData, undefined>;
}
export const createUserRef: CreateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUser(dc: DataConnect): MutationPromise<CreateUserData, undefined>;

interface CreateUserRef {
  ...
  (dc: DataConnect): MutationRef<CreateUserData, undefined>;
}
export const createUserRef: CreateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserRef:
```typescript
const name = createUserRef.operationName;
console.log(name);
```

### Variables
The `CreateUser` mutation has no variables.
### Return Type
Recall that executing the `CreateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserData {
  user_insert: User_Key;
}
```
### Using `CreateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUser } from '@dataconnect/generated';


// Call the `createUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUser(dataConnect);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createUser().then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserRef } from '@dataconnect/generated';


// Call the `createUserRef()` function to get a reference to the mutation.
const ref = createUserRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## UpdateUser
You can execute the `UpdateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateUser(): MutationPromise<UpdateUserData, undefined>;

interface UpdateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<UpdateUserData, undefined>;
}
export const updateUserRef: UpdateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateUser(dc: DataConnect): MutationPromise<UpdateUserData, undefined>;

interface UpdateUserRef {
  ...
  (dc: DataConnect): MutationRef<UpdateUserData, undefined>;
}
export const updateUserRef: UpdateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateUserRef:
```typescript
const name = updateUserRef.operationName;
console.log(name);
```

### Variables
The `UpdateUser` mutation has no variables.
### Return Type
Recall that executing the `UpdateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateUserData {
  user_update?: User_Key | null;
}
```
### Using `UpdateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateUser } from '@dataconnect/generated';


// Call the `updateUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateUser(dataConnect);

console.log(data.user_update);

// Or, you can use the `Promise` API.
updateUser().then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `UpdateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateUserRef } from '@dataconnect/generated';


// Call the `updateUserRef()` function to get a reference to the mutation.
const ref = updateUserRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateUserRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

## DeleteUser
You can execute the `DeleteUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteUser(): MutationPromise<DeleteUserData, undefined>;

interface DeleteUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<DeleteUserData, undefined>;
}
export const deleteUserRef: DeleteUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteUser(dc: DataConnect): MutationPromise<DeleteUserData, undefined>;

interface DeleteUserRef {
  ...
  (dc: DataConnect): MutationRef<DeleteUserData, undefined>;
}
export const deleteUserRef: DeleteUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteUserRef:
```typescript
const name = deleteUserRef.operationName;
console.log(name);
```

### Variables
The `DeleteUser` mutation has no variables.
### Return Type
Recall that executing the `DeleteUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteUserData {
  user_delete?: User_Key | null;
}
```
### Using `DeleteUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteUser } from '@dataconnect/generated';


// Call the `deleteUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteUser(dataConnect);

console.log(data.user_delete);

// Or, you can use the `Promise` API.
deleteUser().then((response) => {
  const data = response.data;
  console.log(data.user_delete);
});
```

### Using `DeleteUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteUserRef } from '@dataconnect/generated';


// Call the `deleteUserRef()` function to get a reference to the mutation.
const ref = deleteUserRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteUserRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_delete);
});
```

## CreateUserProfile
You can execute the `CreateUserProfile` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createUserProfile(): MutationPromise<CreateUserProfileData, undefined>;

interface CreateUserProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateUserProfileData, undefined>;
}
export const createUserProfileRef: CreateUserProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUserProfile(dc: DataConnect): MutationPromise<CreateUserProfileData, undefined>;

interface CreateUserProfileRef {
  ...
  (dc: DataConnect): MutationRef<CreateUserProfileData, undefined>;
}
export const createUserProfileRef: CreateUserProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserProfileRef:
```typescript
const name = createUserProfileRef.operationName;
console.log(name);
```

### Variables
The `CreateUserProfile` mutation has no variables.
### Return Type
Recall that executing the `CreateUserProfile` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserProfileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserProfileData {
  userProfile_insert: UserProfile_Key;
}
```
### Using `CreateUserProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUserProfile } from '@dataconnect/generated';


// Call the `createUserProfile()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUserProfile();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUserProfile(dataConnect);

console.log(data.userProfile_insert);

// Or, you can use the `Promise` API.
createUserProfile().then((response) => {
  const data = response.data;
  console.log(data.userProfile_insert);
});
```

### Using `CreateUserProfile`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserProfileRef } from '@dataconnect/generated';


// Call the `createUserProfileRef()` function to get a reference to the mutation.
const ref = createUserProfileRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserProfileRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userProfile_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userProfile_insert);
});
```

## UpdateUserProfile
You can execute the `UpdateUserProfile` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateUserProfile(): MutationPromise<UpdateUserProfileData, undefined>;

interface UpdateUserProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<UpdateUserProfileData, undefined>;
}
export const updateUserProfileRef: UpdateUserProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateUserProfile(dc: DataConnect): MutationPromise<UpdateUserProfileData, undefined>;

interface UpdateUserProfileRef {
  ...
  (dc: DataConnect): MutationRef<UpdateUserProfileData, undefined>;
}
export const updateUserProfileRef: UpdateUserProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateUserProfileRef:
```typescript
const name = updateUserProfileRef.operationName;
console.log(name);
```

### Variables
The `UpdateUserProfile` mutation has no variables.
### Return Type
Recall that executing the `UpdateUserProfile` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateUserProfileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateUserProfileData {
  userProfile_update?: UserProfile_Key | null;
}
```
### Using `UpdateUserProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateUserProfile } from '@dataconnect/generated';


// Call the `updateUserProfile()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUserProfile();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateUserProfile(dataConnect);

console.log(data.userProfile_update);

// Or, you can use the `Promise` API.
updateUserProfile().then((response) => {
  const data = response.data;
  console.log(data.userProfile_update);
});
```

### Using `UpdateUserProfile`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateUserProfileRef } from '@dataconnect/generated';


// Call the `updateUserProfileRef()` function to get a reference to the mutation.
const ref = updateUserProfileRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateUserProfileRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userProfile_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userProfile_update);
});
```

## DeleteUserProfile
You can execute the `DeleteUserProfile` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteUserProfile(): MutationPromise<DeleteUserProfileData, undefined>;

interface DeleteUserProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<DeleteUserProfileData, undefined>;
}
export const deleteUserProfileRef: DeleteUserProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteUserProfile(dc: DataConnect): MutationPromise<DeleteUserProfileData, undefined>;

interface DeleteUserProfileRef {
  ...
  (dc: DataConnect): MutationRef<DeleteUserProfileData, undefined>;
}
export const deleteUserProfileRef: DeleteUserProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteUserProfileRef:
```typescript
const name = deleteUserProfileRef.operationName;
console.log(name);
```

### Variables
The `DeleteUserProfile` mutation has no variables.
### Return Type
Recall that executing the `DeleteUserProfile` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteUserProfileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteUserProfileData {
  userProfile_delete?: UserProfile_Key | null;
}
```
### Using `DeleteUserProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteUserProfile } from '@dataconnect/generated';


// Call the `deleteUserProfile()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteUserProfile();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteUserProfile(dataConnect);

console.log(data.userProfile_delete);

// Or, you can use the `Promise` API.
deleteUserProfile().then((response) => {
  const data = response.data;
  console.log(data.userProfile_delete);
});
```

### Using `DeleteUserProfile`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteUserProfileRef } from '@dataconnect/generated';


// Call the `deleteUserProfileRef()` function to get a reference to the mutation.
const ref = deleteUserProfileRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteUserProfileRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userProfile_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userProfile_delete);
});
```

## CreateConversation
You can execute the `CreateConversation` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createConversation(): MutationPromise<CreateConversationData, undefined>;

interface CreateConversationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateConversationData, undefined>;
}
export const createConversationRef: CreateConversationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createConversation(dc: DataConnect): MutationPromise<CreateConversationData, undefined>;

interface CreateConversationRef {
  ...
  (dc: DataConnect): MutationRef<CreateConversationData, undefined>;
}
export const createConversationRef: CreateConversationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createConversationRef:
```typescript
const name = createConversationRef.operationName;
console.log(name);
```

### Variables
The `CreateConversation` mutation has no variables.
### Return Type
Recall that executing the `CreateConversation` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateConversationData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateConversationData {
  conversation_insert: Conversation_Key;
}
```
### Using `CreateConversation`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createConversation } from '@dataconnect/generated';


// Call the `createConversation()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createConversation();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createConversation(dataConnect);

console.log(data.conversation_insert);

// Or, you can use the `Promise` API.
createConversation().then((response) => {
  const data = response.data;
  console.log(data.conversation_insert);
});
```

### Using `CreateConversation`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createConversationRef } from '@dataconnect/generated';


// Call the `createConversationRef()` function to get a reference to the mutation.
const ref = createConversationRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createConversationRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.conversation_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.conversation_insert);
});
```

## UpdateConversation
You can execute the `UpdateConversation` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateConversation(): MutationPromise<UpdateConversationData, undefined>;

interface UpdateConversationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<UpdateConversationData, undefined>;
}
export const updateConversationRef: UpdateConversationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateConversation(dc: DataConnect): MutationPromise<UpdateConversationData, undefined>;

interface UpdateConversationRef {
  ...
  (dc: DataConnect): MutationRef<UpdateConversationData, undefined>;
}
export const updateConversationRef: UpdateConversationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateConversationRef:
```typescript
const name = updateConversationRef.operationName;
console.log(name);
```

### Variables
The `UpdateConversation` mutation has no variables.
### Return Type
Recall that executing the `UpdateConversation` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateConversationData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateConversationData {
  conversation_update?: Conversation_Key | null;
}
```
### Using `UpdateConversation`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateConversation } from '@dataconnect/generated';


// Call the `updateConversation()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateConversation();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateConversation(dataConnect);

console.log(data.conversation_update);

// Or, you can use the `Promise` API.
updateConversation().then((response) => {
  const data = response.data;
  console.log(data.conversation_update);
});
```

### Using `UpdateConversation`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateConversationRef } from '@dataconnect/generated';


// Call the `updateConversationRef()` function to get a reference to the mutation.
const ref = updateConversationRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateConversationRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.conversation_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.conversation_update);
});
```

## DeleteConversation
You can execute the `DeleteConversation` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteConversation(): MutationPromise<DeleteConversationData, undefined>;

interface DeleteConversationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<DeleteConversationData, undefined>;
}
export const deleteConversationRef: DeleteConversationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteConversation(dc: DataConnect): MutationPromise<DeleteConversationData, undefined>;

interface DeleteConversationRef {
  ...
  (dc: DataConnect): MutationRef<DeleteConversationData, undefined>;
}
export const deleteConversationRef: DeleteConversationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteConversationRef:
```typescript
const name = deleteConversationRef.operationName;
console.log(name);
```

### Variables
The `DeleteConversation` mutation has no variables.
### Return Type
Recall that executing the `DeleteConversation` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteConversationData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteConversationData {
  conversation_delete?: Conversation_Key | null;
}
```
### Using `DeleteConversation`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteConversation } from '@dataconnect/generated';


// Call the `deleteConversation()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteConversation();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteConversation(dataConnect);

console.log(data.conversation_delete);

// Or, you can use the `Promise` API.
deleteConversation().then((response) => {
  const data = response.data;
  console.log(data.conversation_delete);
});
```

### Using `DeleteConversation`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteConversationRef } from '@dataconnect/generated';


// Call the `deleteConversationRef()` function to get a reference to the mutation.
const ref = deleteConversationRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteConversationRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.conversation_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.conversation_delete);
});
```

## CreateMessage
You can execute the `CreateMessage` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createMessage(): MutationPromise<CreateMessageData, undefined>;

interface CreateMessageRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateMessageData, undefined>;
}
export const createMessageRef: CreateMessageRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createMessage(dc: DataConnect): MutationPromise<CreateMessageData, undefined>;

interface CreateMessageRef {
  ...
  (dc: DataConnect): MutationRef<CreateMessageData, undefined>;
}
export const createMessageRef: CreateMessageRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createMessageRef:
```typescript
const name = createMessageRef.operationName;
console.log(name);
```

### Variables
The `CreateMessage` mutation has no variables.
### Return Type
Recall that executing the `CreateMessage` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateMessageData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateMessageData {
  message_insert: Message_Key;
}
```
### Using `CreateMessage`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createMessage } from '@dataconnect/generated';


// Call the `createMessage()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createMessage();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createMessage(dataConnect);

console.log(data.message_insert);

// Or, you can use the `Promise` API.
createMessage().then((response) => {
  const data = response.data;
  console.log(data.message_insert);
});
```

### Using `CreateMessage`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createMessageRef } from '@dataconnect/generated';


// Call the `createMessageRef()` function to get a reference to the mutation.
const ref = createMessageRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createMessageRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.message_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.message_insert);
});
```

## UpdateMessage
You can execute the `UpdateMessage` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateMessage(): MutationPromise<UpdateMessageData, undefined>;

interface UpdateMessageRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<UpdateMessageData, undefined>;
}
export const updateMessageRef: UpdateMessageRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateMessage(dc: DataConnect): MutationPromise<UpdateMessageData, undefined>;

interface UpdateMessageRef {
  ...
  (dc: DataConnect): MutationRef<UpdateMessageData, undefined>;
}
export const updateMessageRef: UpdateMessageRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateMessageRef:
```typescript
const name = updateMessageRef.operationName;
console.log(name);
```

### Variables
The `UpdateMessage` mutation has no variables.
### Return Type
Recall that executing the `UpdateMessage` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateMessageData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateMessageData {
  message_update?: Message_Key | null;
}
```
### Using `UpdateMessage`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateMessage } from '@dataconnect/generated';


// Call the `updateMessage()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateMessage();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateMessage(dataConnect);

console.log(data.message_update);

// Or, you can use the `Promise` API.
updateMessage().then((response) => {
  const data = response.data;
  console.log(data.message_update);
});
```

### Using `UpdateMessage`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateMessageRef } from '@dataconnect/generated';


// Call the `updateMessageRef()` function to get a reference to the mutation.
const ref = updateMessageRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateMessageRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.message_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.message_update);
});
```

## DeleteMessage
You can execute the `DeleteMessage` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteMessage(): MutationPromise<DeleteMessageData, undefined>;

interface DeleteMessageRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<DeleteMessageData, undefined>;
}
export const deleteMessageRef: DeleteMessageRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteMessage(dc: DataConnect): MutationPromise<DeleteMessageData, undefined>;

interface DeleteMessageRef {
  ...
  (dc: DataConnect): MutationRef<DeleteMessageData, undefined>;
}
export const deleteMessageRef: DeleteMessageRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteMessageRef:
```typescript
const name = deleteMessageRef.operationName;
console.log(name);
```

### Variables
The `DeleteMessage` mutation has no variables.
### Return Type
Recall that executing the `DeleteMessage` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteMessageData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteMessageData {
  message_delete?: Message_Key | null;
}
```
### Using `DeleteMessage`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteMessage } from '@dataconnect/generated';


// Call the `deleteMessage()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteMessage();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteMessage(dataConnect);

console.log(data.message_delete);

// Or, you can use the `Promise` API.
deleteMessage().then((response) => {
  const data = response.data;
  console.log(data.message_delete);
});
```

### Using `DeleteMessage`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteMessageRef } from '@dataconnect/generated';


// Call the `deleteMessageRef()` function to get a reference to the mutation.
const ref = deleteMessageRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteMessageRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.message_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.message_delete);
});
```

## CreateContact
You can execute the `CreateContact` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createContact(): MutationPromise<CreateContactData, undefined>;

interface CreateContactRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateContactData, undefined>;
}
export const createContactRef: CreateContactRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createContact(dc: DataConnect): MutationPromise<CreateContactData, undefined>;

interface CreateContactRef {
  ...
  (dc: DataConnect): MutationRef<CreateContactData, undefined>;
}
export const createContactRef: CreateContactRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createContactRef:
```typescript
const name = createContactRef.operationName;
console.log(name);
```

### Variables
The `CreateContact` mutation has no variables.
### Return Type
Recall that executing the `CreateContact` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateContactData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateContactData {
  contact_insert: Contact_Key;
}
```
### Using `CreateContact`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createContact } from '@dataconnect/generated';


// Call the `createContact()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createContact();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createContact(dataConnect);

console.log(data.contact_insert);

// Or, you can use the `Promise` API.
createContact().then((response) => {
  const data = response.data;
  console.log(data.contact_insert);
});
```

### Using `CreateContact`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createContactRef } from '@dataconnect/generated';


// Call the `createContactRef()` function to get a reference to the mutation.
const ref = createContactRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createContactRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.contact_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.contact_insert);
});
```

## UpdateContact
You can execute the `UpdateContact` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateContact(): MutationPromise<UpdateContactData, undefined>;

interface UpdateContactRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<UpdateContactData, undefined>;
}
export const updateContactRef: UpdateContactRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateContact(dc: DataConnect): MutationPromise<UpdateContactData, undefined>;

interface UpdateContactRef {
  ...
  (dc: DataConnect): MutationRef<UpdateContactData, undefined>;
}
export const updateContactRef: UpdateContactRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateContactRef:
```typescript
const name = updateContactRef.operationName;
console.log(name);
```

### Variables
The `UpdateContact` mutation has no variables.
### Return Type
Recall that executing the `UpdateContact` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateContactData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateContactData {
  contact_update?: Contact_Key | null;
}
```
### Using `UpdateContact`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateContact } from '@dataconnect/generated';


// Call the `updateContact()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateContact();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateContact(dataConnect);

console.log(data.contact_update);

// Or, you can use the `Promise` API.
updateContact().then((response) => {
  const data = response.data;
  console.log(data.contact_update);
});
```

### Using `UpdateContact`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateContactRef } from '@dataconnect/generated';


// Call the `updateContactRef()` function to get a reference to the mutation.
const ref = updateContactRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateContactRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.contact_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.contact_update);
});
```

## DeleteContact
You can execute the `DeleteContact` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteContact(): MutationPromise<DeleteContactData, undefined>;

interface DeleteContactRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<DeleteContactData, undefined>;
}
export const deleteContactRef: DeleteContactRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteContact(dc: DataConnect): MutationPromise<DeleteContactData, undefined>;

interface DeleteContactRef {
  ...
  (dc: DataConnect): MutationRef<DeleteContactData, undefined>;
}
export const deleteContactRef: DeleteContactRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteContactRef:
```typescript
const name = deleteContactRef.operationName;
console.log(name);
```

### Variables
The `DeleteContact` mutation has no variables.
### Return Type
Recall that executing the `DeleteContact` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteContactData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteContactData {
  contact_delete?: Contact_Key | null;
}
```
### Using `DeleteContact`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteContact } from '@dataconnect/generated';


// Call the `deleteContact()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteContact();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteContact(dataConnect);

console.log(data.contact_delete);

// Or, you can use the `Promise` API.
deleteContact().then((response) => {
  const data = response.data;
  console.log(data.contact_delete);
});
```

### Using `DeleteContact`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteContactRef } from '@dataconnect/generated';


// Call the `deleteContactRef()` function to get a reference to the mutation.
const ref = deleteContactRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteContactRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.contact_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.contact_delete);
});
```

