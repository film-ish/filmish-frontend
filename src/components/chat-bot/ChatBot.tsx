import Markdown from 'react-markdown';
import IconButton from '../common/IconButton';
import { Send, X } from 'lucide-react';
import useChatBot from '../../hooks/useChatBot';

const ChatBot = ({ closeChatBot }) => {
  const userId = 1;

  const { chattings, question, setQuestion, sendQuestion, disabled, currentResponse, isLoading, loadingIndicatorIdx } =
    useChatBot(userId);

  return (
    <div className="fixed z-50 bottom-10 right-10 w-sm aspect-[1/1.2] p-4 flex flex-col gap-2 bg-gray-2 text-gray-8 rounded-[10px]">
      <div className="relative w-full flex items-center justify-center">
        <h3 className="text-label-xl font-bold">똑똑 ChatBot</h3>
        <IconButton
          className="absolute right-0"
          onClick={() => {
            closeChatBot();
          }}>
          <X />
        </IconButton>
      </div>

      <div className="box" id="querySection" style={{ display: 'none' }}>
        <div className="field">
          <label className="label">질문 입력</label>
          <div className="control">
            <textarea className="textarea" id="queryInput" placeholder="질문을 입력하세요..."></textarea>
          </div>
        </div>
        <button className="button is-info" onClick={sendQuestion}>
          전송
        </button>
      </div>

      <div className="h-full flex flex-col gap-2 mt-2 py-2 chatbot-scrollbar">
        {chattings.map((chatting, index) => {
          if (chatting.owner === 'user') {
            return (
              <div key={index} className="w-fit max-w-4/6 px-2 py-1 rounded-[10px] bg-gray-3 self-end">
                <Markdown>{chatting.message}</Markdown>
              </div>
            );
          } else {
            return (
              <div key={index} className="w-fit max-w-4/6 px-2 py-1 rounded-[10px] bg-gray-6 text-gray-3">
                <Markdown
                  components={{
                    a(props) {
                      return (
                        <a {...props} className="font-bold text-gray-2 hover:text-white">
                          {props.children}
                        </a>
                      );
                    },
                  }}>
                  {chatting.message}
                </Markdown>
              </div>
            );
          }
        })}

        {isLoading && (
          <div className="w-fit max-w-4/6 px-2 py-1 rounded-[10px] bg-gray-6 text-gray-3">
            <div className="flex items-center p-1 gap-2">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className={
                    'w-1 h-1 rounded-full transition-colors' +
                    (loadingIndicatorIdx === index ? ' bg-white' : ' bg-gray-4')
                  }
                />
              ))}
            </div>
          </div>
        )}

        {currentResponse && (
          <div className="w-fit max-w-4/6 px-2 py-1 rounded-[10px] bg-gray-6 text-gray-3">
            <Markdown>{currentResponse}</Markdown>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mt-auto border-[1px] border-gray-4 rounded-full pl-4 pt-1 pr-1 pb-1">
        <input
          className="w-full focus:outline-none focus:ring-0"
          type="text"
          placeholder="질문을 입력하세요"
          value={question}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !disabled) {
              sendQuestion();
            }
          }}
          onChange={(e) => {
            setQuestion(e.target.value);
          }}
        />

        <IconButton
          className={'disabled:!bg-gray-3 ' + (disabled ? '!cursor-not-allowed' : '')}
          onClick={sendQuestion}
          disabled={disabled}>
          <Send stroke={disabled ? 'white' : 'black'} size={20} />
        </IconButton>
      </div>
    </div>
  );
};

export default ChatBot;
