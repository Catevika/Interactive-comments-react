export type Reply = {
  _id?: string | undefined;
  comment: string | undefined;
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
  _id?: string | undefined;
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