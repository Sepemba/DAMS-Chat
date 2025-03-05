import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { sendMessage } from '../utils/storage';

interface DAMSMessageProps {
  encodedContent: string;
  originalContent: string;
  showTranslateButton?: boolean;
  requireCode?: boolean;
  postUserId?: string;
}

interface ErrorState {
  show: boolean;
  message: string;
}

const DAMSMessage: React.FC<DAMSMessageProps> = ({ 
  encodedContent, 
  originalContent, 
  showTranslateButton = true,
  requireCode = false,
  postUserId
}) => {
  const { user } = useAuth();
  const [showOriginal, setShowOriginal] = useState(false);
  const [translationCode, setTranslationCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [error, setError] = useState<ErrorState>({ show: false, message: '' });

  const handleTranslate = () => {
    if (requireCode && postUserId && user) {
      // Send a message to the post author requesting the translation code
      sendMessage(
        user.id,
        postUserId,
        "Olá! Poderia me enviar o código para traduzir sua mensagem?"
      );
      setShowCodeInput(true);
    } else {
      setShowOriginal(true);
    }
  };

  const handleCodeSubmit = () => {
    if (translationCode === 'DAMS2') {
      setShowOriginal(true);
      setShowCodeInput(false);
      setError({ show: false, message: '' });
    } else {
      setError({ show: true, message: 'Código inválido. Tente novamente.' });
    }
  };

  return (
    <div className="p-3 rounded-lg bg-[#F5F5F5] mb-2">
      <p className="font-mono text-gray-800 break-all">{encodedContent}</p>
      
      {showOriginal && (
        <div className="mt-2 p-2 bg-white rounded border border-gray-300">
          <p className="text-black text-[14px]">{originalContent}</p>
        </div>
      )}
      
      {showTranslateButton && !showOriginal && !showCodeInput && (
        <button
          onClick={handleTranslate}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800"
        >
          Traduzir
        </button>
      )}
      
      {showCodeInput && (
        <div className="mt-2 flex space-x-2">
          <input
            type="text"
            value={translationCode}
            onChange={(e) => setTranslationCode(e.target.value)}
            placeholder="Código de tradução"
            className="w-[100px] h-[30px] px-2 text-sm border border-[#D3D3D3] rounded"
          />
          <button
            onClick={handleCodeSubmit}
            className="w-[80px] h-[30px] text-sm bg-[#1976D2] text-white rounded-[5px] hover:bg-blue-700"
          >
            Verificar
          </button>
        </div>
      )}
      
      {error.show && (
        <p className="mt-1 text-red-500 text-[12px]">{error.message}</p>
      )}
    </div>
  );
};

export default DAMSMessage;