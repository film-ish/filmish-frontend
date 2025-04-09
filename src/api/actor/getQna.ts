import axios from "axios";
import { apiClient } from "../instance/client"

const listQna = async (makerId: number, page: number, size: number) => {
  try {
    const response = await apiClient.get(`/qna/${makerId}`, {
      params: { pageNum: page, pageSize: size },
    });
    return response.data.data.content;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios 에러:", error.response?.data || error.message);
    } else {
      console.error("알 수 없는 에러:", error);
    }
    throw error; // 필요에 따라 다시 에러를 던질 수 있음
  }
};

const createQna = async (makerId: number, title: string, content: string) => {
  const response = await apiClient.post(`/qna`, {
    makerId, // 필수 추가
    title,
    content
  });
  return response.data;
}

// Q&A 수정 API
const updateQna = async (qnaId: number, title: string, content: string) => {
  const response = await apiClient.put(`/qna/${qnaId}`,
    {
      id: qnaId,
      title,
      content
    },
  );
  return response.data;
}

const deleteQna = async (qnaId: number) => {
  const response = await apiClient.delete(`/qna/${qnaId}`);
  return response.data;
}

// Q&A 댓글
// Q&A 댓글 생성 API
const createComment = async (qnaId: number, content: string) => {
  const response = await apiClient.post(`/qna/${qnaId}/comments`, 
    { content },
  );
  return response.data;
};

// 대댓글 생성 API (selfRefKey 사용)
const createReply = async (qnaId: number, parentId: number, content: string) => {
  try {
    console.log("답글 생성 요청:", { qnaId, parentId, content });
    const response = await apiClient.post(`/qna/${qnaId}/comments`, 
      { 
        content,
        parentId: parentId // selfRefKey 대신 parentId 사용
      },
    );
    console.log("답글 생성 응답:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("답글 생성 에러:", error.response?.data || error.message);
    } else {
      console.error("답글 생성 중 알 수 없는 에러:", error);
    }
    throw error;
  }
};

const updateComment = async (commentId: number, content: string) => {
  const response = await apiClient.put(`/qna/comments/${commentId}`, { content });
  return response.data;
}

const deleteComment = async (commentId: number) => {
  const response = await apiClient.delete(`/qna/comments/${commentId}`);
  return response.data;
}

export { listQna, createQna, createComment, createReply, updateQna, deleteQna, updateComment, deleteComment };