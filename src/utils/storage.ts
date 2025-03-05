import { User, Message, Post } from '../types';
import SHA256 from 'crypto-js/sha256';
import { encodeDAMS } from './damsEncoder';

// Local storage keys
const USERS_KEY = 'dams_users';
const CURRENT_USER_KEY = 'dams_current_user';
const MESSAGES_KEY = 'dams_messages';
const POSTS_KEY = 'dams_posts';

// Helper function to generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// User functions
export const getUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

export const getUserById = (id: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.id === id);
};

export const getUserByUsername = (username: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.username === username);
};

export const registerUser = (username: string, password: string, email?: string): User | null => {
  if (getUserByUsername(username)) {
    return null; // Username already exists
  }
  
  const users = getUsers();
  const newUser: User = {
    id: generateId(),
    username,
    email
  };
  
  // Store user with hashed password
  const userWithPassword = {
    ...newUser,
    password: SHA256(password).toString()
  };
  
  localStorage.setItem(USERS_KEY, JSON.stringify([...users, userWithPassword]));
  
  // Return user without password
  return newUser;
};

export const loginUser = (username: string, password: string): User | null => {
  const users = getUsers();
  const user = users.find(
    u => u.username === username && u.password === SHA256(password).toString()
  );
  
  if (user) {
    // Store current user without password
    const { password, ...userWithoutPassword } = user;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  }
  
  return null;
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const updateUserProfilePhoto = (userId: string, photoUrl: string): User | null => {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) return null;
  
  // Update user in the users array
  users[userIndex] = {
    ...users[userIndex],
    profilePhoto: photoUrl
  };
  
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  // If this is the current user, update current user as well
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    const updatedCurrentUser = {
      ...currentUser,
      profilePhoto: photoUrl
    };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedCurrentUser));
    return updatedCurrentUser;
  }
  
  // Return the updated user without password
  const { password, ...userWithoutPassword } = users[userIndex];
  return userWithoutPassword;
};

export const logoutUser = (): void => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

// Friend request functions
export const sendFriendRequest = (senderId: string, receiverId: string): void => {
  const users = getUsers();
  const senderIndex = users.findIndex(u => u.id === senderId);
  const receiverIndex = users.findIndex(u => u.id === receiverId);

  if (senderIndex === -1 || receiverIndex === -1) return;

  // Initialize friend requests if they don't exist
  if (!users[senderIndex].friendRequests) {
    users[senderIndex].friendRequests = { incoming: [], outgoing: [] };
  }
  if (!users[receiverIndex].friendRequests) {
    users[receiverIndex].friendRequests = { incoming: [], outgoing: [] };
  }

  // Add to sender's outgoing requests
  if (!users[senderIndex].friendRequests.outgoing.includes(receiverId)) {
    users[senderIndex].friendRequests.outgoing.push(receiverId);
  }

  // Add to receiver's incoming requests
  if (!users[receiverIndex].friendRequests.incoming.includes(senderId)) {
    users[receiverIndex].friendRequests.incoming.push(senderId);
  }

  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const acceptFriendRequest = (userId: string, friendId: string): void => {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  const friendIndex = users.findIndex(u => u.id === friendId);

  if (userIndex === -1 || friendIndex === -1) return;

  // Initialize friends arrays if they don't exist
  if (!users[userIndex].friends) users[userIndex].friends = [];
  if (!users[friendIndex].friends) users[friendIndex].friends = [];

  // Add each user to the other's friends list
  if (!users[userIndex].friends.includes(friendId)) {
    users[userIndex].friends.push(friendId);
  }
  if (!users[friendIndex].friends.includes(userId)) {
    users[friendIndex].friends.push(userId);
  }

  // Remove the friend request
  if (users[userIndex].friendRequests?.incoming) {
    users[userIndex].friendRequests.incoming = users[userIndex].friendRequests.incoming.filter(id => id !== friendId);
  }
  if (users[friendIndex].friendRequests?.outgoing) {
    users[friendIndex].friendRequests.outgoing = users[friendIndex].friendRequests.outgoing.filter(id => id !== userId);
  }

  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const rejectFriendRequest = (userId: string, friendId: string): void => {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  const friendIndex = users.findIndex(u => u.id === friendId);

  if (userIndex === -1 || friendIndex === -1) return;

  // Remove the friend request
  if (users[userIndex].friendRequests?.incoming) {
    users[userIndex].friendRequests.incoming = users[userIndex].friendRequests.incoming.filter(id => id !== friendId);
  }
  if (users[friendIndex].friendRequests?.outgoing) {
    users[friendIndex].friendRequests.outgoing = users[friendIndex].friendRequests.outgoing.filter(id => id !== userId);
  }

  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getFriendRequests = (userId: string): { incoming: string[], outgoing: string[] } => {
  const user = getUserById(userId);
  return user?.friendRequests || { incoming: [], outgoing: [] };
};

export const getFriends = (userId: string): string[] => {
  const user = getUserById(userId);
  return user?.friends || [];
};

// Message functions
export const getMessages = (): Message[] => {
  const messages = localStorage.getItem(MESSAGES_KEY);
  return messages ? JSON.parse(messages) : [];
};

export const getConversation = (userId1: string, userId2: string): Message[] => {
  const messages = getMessages();
  return messages.filter(
    message => 
      (message.senderId === userId1 && message.receiverId === userId2) ||
      (message.senderId === userId2 && message.receiverId === userId1)
  ).sort((a, b) => a.timestamp - b.timestamp);
};

export const sendMessage = (senderId: string, receiverId: string, content: string): Message => {
  const messages = getMessages();
  const encodedContent = encodeDAMS(content);
  
  const newMessage: Message = {
    id: generateId(),
    senderId,
    receiverId,
    content,
    encodedContent,
    timestamp: Date.now()
  };
  
  localStorage.setItem(MESSAGES_KEY, JSON.stringify([...messages, newMessage]));
  return newMessage;
};

// Post functions
export const getPosts = (): Post[] => {
  const posts = localStorage.getItem(POSTS_KEY);
  return posts ? JSON.parse(posts) : [];
};

export const createPost = (userId: string, content: string): Post => {
  const posts = getPosts();
  const encodedContent = encodeDAMS(content);
  
  const newPost: Post = {
    id: generateId(),
    userId,
    content,
    encodedContent,
    timestamp: Date.now(),
    likes: [],
    comments: []
  };
  
  localStorage.setItem(POSTS_KEY, JSON.stringify([...posts, newPost]));
  return newPost;
};

export const likePost = (postId: string, userId: string): void => {
  const posts = getPosts();
  const updatedPosts = posts.map(post => {
    if (post.id === postId) {
      // Toggle like
      if (post.likes.includes(userId)) {
        return {
          ...post,
          likes: post.likes.filter(id => id !== userId)
        };
      } else {
        return {
          ...post,
          likes: [...post.likes, userId]
        };
      }
    }
    return post;
  });
  
  localStorage.setItem(POSTS_KEY, JSON.stringify(updatedPosts));
};

export const commentOnPost = (postId: string, userId: string, content: string): void => {
  const posts = getPosts();
  const encodedContent = encodeDAMS(content);
  
  const updatedPosts = posts.map(post => {
    if (post.id === postId) {
      return {
        ...post,
        comments: [
          ...post.comments,
          {
            id: generateId(),
            userId,
            content,
            encodedContent,
            timestamp: Date.now()
          }
        ]
      };
    }
    return post;
  });
  
  localStorage.setItem(POSTS_KEY, JSON.stringify(updatedPosts));
};