# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createUser, updateUser, deleteUser, getUser, listUsers, createUserProfile, updateUserProfile, deleteUserProfile, getUserProfile, listUserProfiles } from '@dataconnect/generated';


// Operation CreateUser: 
const { data } = await CreateUser(dataConnect);

// Operation UpdateUser: 
const { data } = await UpdateUser(dataConnect);

// Operation DeleteUser: 
const { data } = await DeleteUser(dataConnect);

// Operation GetUser: 
const { data } = await GetUser(dataConnect);

// Operation ListUsers: 
const { data } = await ListUsers(dataConnect);

// Operation CreateUserProfile: 
const { data } = await CreateUserProfile(dataConnect);

// Operation UpdateUserProfile: 
const { data } = await UpdateUserProfile(dataConnect);

// Operation DeleteUserProfile: 
const { data } = await DeleteUserProfile(dataConnect);

// Operation GetUserProfile: 
const { data } = await GetUserProfile(dataConnect);

// Operation ListUserProfiles: 
const { data } = await ListUserProfiles(dataConnect);


```