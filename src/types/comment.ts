export interface Comment {
  commentId: number;
  comentWriterName: string;
  comentWriterImage?: string;
  commentWriterType: string;
  content: string;
  cocomments: Cocoment[];
}

export interface Cocoment {
  cocomentsId: number;
  cocommentWriterName: string;
  cocommentWriterImage?: string;
  commentWriterType: string;
  content: string;
}
