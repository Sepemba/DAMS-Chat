import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import { encodeDAMS, decodeDAMS } from '../utils/damsEncoder';
import { MessageSquare, UserCircle } from 'lucide-react';
import { updateUserProfilePhoto } from '../utils/storage';

const Profile: React.FC = () => {
  const { user, login } = useAuth();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcess = () => {
    if (mode === 'encode') {
      setOutputText(encodeDAMS(inputText));
    } else {
      setOutputText(decodeDAMS(inputText));
    }
  };
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setError('Arquivo inválido. Use JPEG ou PNG, máximo 2MB.');
      return;
    }

    // Validate file size (2MB = 2 * 1024 * 1024 bytes)
    if (file.size > 2 * 1024 * 1024) {
      setError('Arquivo muito grande. O tamanho máximo é 2MB.');
      return;
    }

    // Clear any previous errors
    setError('');

    // Create a FileReader to read the file as Data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      // Update user's profile photo
      const updatedUser = updateUserProfilePhoto(user.id, dataUrl);
      
      if (updatedUser) {
        // Force a re-render by updating the auth context
        login(user.username, '');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      
      <div className="container mx-auto p-4 mt-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Perfil do Usuário</h2>
          
          <div className="flex items-center mb-6">
            {user.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt={user.username}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="ml-4">
              <h3 className="text-lg font-medium">{user.username}</h3>
              {user.email && <p className="text-gray-600">{user.email}</p>}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/jpeg,image/png"
                className="hidden"
              />
              <button
                onClick={handleUploadClick}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                Adicionar/Alterar Foto
              </button>
              {error && (
                <p className="text-red-500 text-xs mt-1">{error}</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Codificador/Decodificador DAMS</h2>
          
          <div className="mb-4">
            <div className="flex space-x-4 mb-4">
              <button
                onClick={() => setMode('encode')}
                className={`px-4 py-2 rounded-md ${
                  mode === 'encode' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Codificar
              </button>
              <button
                onClick={() => setMode('decode')}
                className={`px-4 py-2 rounded-md ${
                  mode === 'decode' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Decodificar
              </button>
            </div>
            
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={mode === 'encode' ? "Digite o texto para codificar..." : "Digite o código DAMS para decodificar..."}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-3"
              rows={4}
            />
            
            <button
              onClick={handleProcess}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {mode === 'encode' ? 'Codificar' : 'Decodificar'}
            </button>
          </div>
          
          {outputText && (
            <div className="mt-6">
              <h3 className="font-medium mb-2">Resultado:</h3>
              <div className="p-3 bg-gray-100 rounded-md font-mono break-all">
                {outputText}
              </div>
            </div>
          )}
          
          <div className="mt-8 border-t pt-6">
            <h3 className="font-bold mb-4">Como Usar a Linguagem DAMS (2ª Variante)</h3>
            
            <div className="bg-blue-50 p-4 rounded-md mb-4">
              <h4 className="font-medium mb-2">Quadro Padrão:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>2 → D, U, Y (Ú)</li>
                <li>3 → O, Q, A (Ó, Ô, Ö, Á, Â, Ã, À)</li>
                <li>4 → B, V, E (É, Ê)</li>
                <li>5 → W, M, H</li>
                <li>6 → I, Z, T, C (Í, Ç)</li>
                <li>7 → K, P, F, G</li>
                <li>8 → L, N, R</li>
                <li>9 → X, S, J</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md mb-4">
              <h4 className="font-medium mb-2">Regras de Codificação:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Minúscula: NOL|NUDAL (ex.: 'o' → 1|3)</li>
                <li>Maiúscula: NUDAL|NOL NOL (ex.: 'O' → 3|11)</li>
                <li>Minúscula acentuada: NOL|NUDAL NUSEP NAC (ex.: 'ó' → 1|305)</li>
                <li>Maiúscula acentuada: NUDAL|NOL NOL NAC (ex.: 'Ó' → 3|117)</li>
                <li>Espaço: |NUDALanterior - NUDALposterior| em romano</li>
                <li>Pontuação: Tabela específica (ex.: '?' → XIV|0)</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="font-medium mb-2">Exemplo:</h4>
              <p className="mb-2">Texto: <strong>Oi</strong></p>
              <p className="mb-2">Codificação: <strong>6|112|8</strong></p>
              <p className="text-sm text-gray-600">
                'O' (maiúscula) → 3|11 (NUDAL|NOL NOL)<br />
                'i' (minúscula) → 1|6 (NOL|NUDAL)<br />
                Resultado: 3|111|6
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;