import type { Types } from 'mongoose';

export type Reply = {
  _id?: Types.ObjectId | undefined;
  comment: Types.ObjectId | undefined;
  content: string;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
  score: number;
  user: {
    image: {
      png: string;
      webp: string;
    };
    username: string;
  };
  replyingTo: string;
  showReplyForm: boolean;
};

export type Comment = {
  _id?: Types.ObjectId | undefined;
  content: string;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
  score: number;
  user: {
    image: {
      png: string;
      webp: string;
    };
    username: string;
  };
  replies: Reply[];
  showReplyForm: boolean;
};