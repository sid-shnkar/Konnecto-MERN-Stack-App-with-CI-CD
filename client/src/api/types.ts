import { ApiType } from "@/api";

// Defines the structure of a user

export interface UserInterface {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  picturePath: string;
  friends: Array<string>;
  location: string;
  occupation: string;
  viewedProfile: number;
  impressions: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Defines the structure of the authentication state

export interface AuthInterface {
  mode: "dark" | "light";
  token: string | null;
}

// Defines the structure of the socket state
export interface SocketStateInterface {
  activeUsers: Array<string>;
}

// Defines the structure of the overall application state
export interface StateInterface {
  socketReducer: SocketStateInterface;
  persistedReducer: AuthInterface;
  api: ApiType;
}

// Defines the structure of a post
export interface PostInterface {
  userId: string;
  desription: string;
  picturePath: File;
}

// Defines the structure of a retrieved post
export interface GetPostInterface {
  comments: Array<string>;
  createdAt: string;
  description: string;
  firstName: string;
  lastName: string;
  likes: { [userId: string]: boolean };
  location: string;
  picturePath: string;
  updatedAt: string;
  userId: string;
  userPicturePath: string;
  __v: number;
  _id: string;
}

// Defines the structure of a query for retrieving posts
export interface GetPostInterfaceQuery {
  posts: Array<GetPostInterface>;
  totalPosts: number;
}

// Defines the structure of a verified token response
export interface VerifyTokenInterface {
  user: UserInterface;
}

// Defines the structure of the parameters for the verifyToken query
export interface VerifyTokenQueryInterface {
  skip?: boolean;
  queryKey?: Array<string>;
  force?: boolean;
}

// Defines the structure of a friend
export interface FriendInterface {
  firstName: string;
  lastName: string;
  location: string;
  occupation: string;
  picturePath: string;
  _id: string;
}

// Defines the structure of the login response
export interface LoginInterface {
  user: UserInterface;
  token: string;
}

// Defines the structure of the login request payload
export interface LoginInterfaceUser {
  email: string;
  password: string;
}

// Defines the structure of a comment
export interface CommentInterface {
  _id: string;
  __v: number;
  userId: string;
  updatedAt: string;
  text: string;
  postId: string;
  likes: { [userId: string]: boolean };
  createdAt: string;
}

// Defines the structure of the retrieved comments response
export interface GetCommentsInterface {
  comments: { comments: Array<CommentInterface> };
  totalComments: number;
}

// Defines the structure of a message
export interface MessageInterface {
  chatId: string;
  content: string;
  createdAt: string;
  sender: UserInterface;
  updatedAt: string;
  __v: number;
  _id: number;
}

// Defines the structure of a chat
export interface ChatInterface {
  _id: string;
  participants: Array<UserInterface>;
  messages: Array<MessageInterface>;
  createdBy: UserInterface;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
