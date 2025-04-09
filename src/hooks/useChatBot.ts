import { useEffect, useRef, useState } from 'react';

interface Chatting {
  owner: 'user' | 'bot';
  message: string;
}

const useChatBot = (userId: number) => {
  const webSocketRef = useRef<WebSocket | null>(null);

  const [chattings, setChattings] = useState<Chatting[]>([]);

  const [question, setQuestion] = useState('');
  const [currentResponse, setCurrentResponse] = useState('');
  const currentResponseRef = useRef(currentResponse);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingIndicatorIdx, setLoadingIndicatorIdx] = useState(0);

  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      setLoadingIndicatorIdx(0);
      return;
    }

    const interval = setInterval(() => {
      setLoadingIndicatorIdx((prevCount) => (prevCount + 1) % 3);
    }, 150);

    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    currentResponseRef.current = currentResponse;
  }, [currentResponse]);

  useEffect(() => {
    if (!userId) {
      alert('로그인 상태를 확인해주세요.');
      return;
    }

    const ws = new WebSocket(`wss://ddokddok.duckdns.org/algorithm/v1/woorecommendations/ws/${userId}`);
    webSocketRef.current = ws;

    ws.onopen = () => {
      setDisabled(false);
    };

    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      setIsLoading(false);

      if (response.status === 200) {
        setChattings((prev) => [
          ...prev,
          {
            owner: 'bot',
            message: currentResponseRef.current,
          },
        ]);

        setCurrentResponse('');
        setDisabled(false);

        return;
      }

      setCurrentResponse((prev) => prev + response.data);
    };

    ws.onerror = (error) => {
      console.error(error);
    };

    ws.onclose = () => {
      setDisabled(true);
    };

    return () => {
      if (ws.readyState === 1) {
        webSocketRef.current = null;
        ws.close();
      }
    };
  }, [userId]);

  const sendQuestion = () => {
    if (!question.trim()) {
      setQuestion('');
      return;
    }

    setIsLoading(true);
    setDisabled(true);

    webSocketRef.current?.send(question);
    setChattings((prev) => [...prev, { owner: 'user', message: question }]);
    setQuestion('');
  };

  return {
    chattings,
    question,
    setQuestion,
    disabled,
    sendQuestion,
    currentResponse,
    isLoading,
    loadingIndicatorIdx,
  };
};

export default useChatBot;
