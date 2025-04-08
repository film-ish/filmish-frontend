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

const createComment = async (qnaId: number, content: string) => {
  const response = await apiClient.post(`/qna/${qnaId}/comments`, 
    { content },
  );
  return response.data;
};

// 답글 생성 API (selfRefKey 사용)
const createReply = async (qnaId: number, parentId: number, content: string) => {
  const response = await apiClient.post(`/qna/${qnaId}/comments`, 
    { 
      content,
      selfRefKey: parentId // 답글인 경우 부모 댓글 ID 전달
    },
  );
  return response.data;
};

const updateQna = async (qnaId: number, title: string, content: string) => {
  console.log('Sending update request for QNA ID:', qnaId);
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

export { listQna, createQna, createComment, createReply, updateQna, deleteQna };