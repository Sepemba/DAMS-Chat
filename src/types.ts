export interface User {
  id: string;
  username: string;
  email?: string;
  profilePhoto?: string;
  friends?: string[]; // Array of user IDs who are friends
  friendRequests?: {
    incoming: string[]; // Array of user IDs who sent friend requests
    outgoing: string[]; // Array of user IDs to whom friend requests were sent
  };
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  encodedContent: string;
  timestamp: number;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  encodedContent: string;
  timestamp: number;
  likes: string[]; // Array of user IDs who liked the post
  comments: Comment[];
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  encodedContent: string;
  timestamp: number;
}