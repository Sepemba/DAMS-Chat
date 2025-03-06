import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUsers, getConversation, sendMessage, getFriends, getFriendRequests, sendFriendRequest, acceptFriendRequest, rejectFriendRequest } from '../utils/storage';
import { User, Message } from '../types';
import Header from '../components/Header';
import DAMSMessage from '../components/DAMSMessage';
import { Send, MessageSquare } from 'lucide-react';
import { encodeDAMS, decodeDAMS } from '../utils/damsEncoder';

const Chat: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [friends, setFriends] = useState<string[]>([]);
  const [friendRequests, setFriendRequests] = useState<{ incoming: string[], outgoing: string[] }>({ incoming: [], outgoing: [] });
  const [showEncoded, setShowEncoded] = useState(false);

  useEffect(() => {
    if (user) {
      // Initial load
      const loadUsers = () => {
        const allUsers = getUsers().filter(u => u.id !== user.id);
        setUsers(allUsers);
        setFriends(getFriends(user.id));
        setFriendRequests(getFriendRequests(user.id));
      };

      loadUsers();

      // Set up polling every 5 seconds
      const interval = setInterval(loadUsers, 5000);

      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    if (user && selectedUser) {
      // Get conversation between current user and selected user
      const conversation = getConversation(user.id, selectedUser.id);
      setMessages(conversation);
    }
  }, [user, selectedUser]);

  const handleSendMessage = () => {
    if (!user || !selectedUser || !newMessage.trim()) return;

    const message = sendMessage(user.id, selectedUser.id, newMessage);
    setMessages([...messages, message]);
    setNewMessage('');
    setShowEncoded(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTranslate = () => {
    if (newMessage.trim()) {
      setNewMessage(showEncoded ? newMessage : encodeDAMS(newMessage));
      setShowEncoded(!showEncoded);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      
      <div className="flex-1 flex flex-col sm:flex-row container mx-auto p-4 mt-4">
        {/* Users list */}
        <div className="w-full sm:w-1/4 bg-white rounded-lg shadow-md overflow-hidden mb-4 sm:mb-0 sm:mr-4">
          <div className="p-4 bg-blue-600 text-white font-medium text-lg">
            Usuários
          </div>
          <div className="overflow-y-auto max-h-[300px] sm:h-[calc(100vh-180px)]">
            {users.length === 0 ? (
              <p className="p-4 text-gray-500">Nenhum usuário encontrado</p>
            ) : (
              <ul>
                {users.map(u => (
                  <li 
                    key={u.id}
                    className={`p-3 border-b hover:bg-gray-100 ${selectedUser?.id === u.id ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div 
                        className="flex items-center cursor-pointer"
                        onClick={() => setSelectedUser(u)}
                      >
                        <div className={`w-2 h-2 rounded-full mr-2 ${u.online ? 'bg-green-500' : 'bg-gray-400'}`} />
                        <span className="text-sm">{u.username}</span>
                      </div>
                      <div className="flex items-center space-x-2 flex-wrap">
                        {friends.includes(u.id) ? (
                          <span className="text-xs text-green-600 px-2 py-1 bg-green-100 rounded">Amigo</span>
                        ) : friendRequests.outgoing.includes(u.id) ? (
                          <span className="text-xs text-yellow-600 px-2 py-1 bg-yellow-100 rounded">Pendente</span>
                        ) : friendRequests.incoming.includes(u.id) ? (
                          <div className="flex space-x-1">
                            <button
                              onClick={() => {
                                acceptFriendRequest(user.id, u.id);
                                setFriends([...friends, u.id]);
                                setFriendRequests(prev => ({
                                  ...prev,
                                  incoming: prev.incoming.filter(id => id !== u.id)
                                }));
                              }}
                              className="text-xs text-green-600 px-2 py-1 bg-green-100 rounded hover:bg-green-200"
                            >
                              Aceitar
                            </button>
                            <button
                              onClick={() => {
                                rejectFriendRequest(user.id, u.id);
                                setFriendRequests(prev => ({
                                  ...prev,
                                  incoming: prev.incoming.filter(id => id !== u.id)
                                }));
                              }}
                              className="text-xs text-red-600 px-2 py-1 bg-red-100 rounded hover:bg-red-200"
                            >
                              Rejeitar
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              sendFriendRequest(user.id, u.id);
                              setFriendRequests(prev => ({
                                ...prev,
                                outgoing: [...prev.outgoing, u.id]
                              }));
                            }}
                            className="text-xs text-blue-600 px-2 py-1 bg-blue-100 rounded hover:bg-blue-200"
                          >
                            Adicionar
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        {/* Chat area */}
        <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
          {selectedUser ? (
            <>
              <div className="p-4 bg-blue-600 text-white font-medium">
                <span className="text-base">Chat com {selectedUser.username}</span>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto h-[calc(100vh-250px)]">
                {messages.length === 0 ? (
                  <p className="text-center text-gray-500 mt-4">
                    Nenhuma mensagem ainda. Comece a conversar!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {messages.map(message => (
                      <div 
                        key={message.id}
                        className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] ${
                          message.senderId === user.id 
                            ? 'bg-blue-100 rounded-tl-lg rounded-bl-lg rounded-br-lg' 
                            : 'bg-gray-100 rounded-tr-lg rounded-br-lg rounded-bl-lg'
                        }`}>
                          <DAMSMessage 
                            encodedContent={message.encodedContent}
                            originalContent={message.content}
                            requireCode={message.senderId !== user.id}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Digite sua mensagem..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={2}
                    />
                    <div className="absolute right-2 bottom-2 flex space-x-2">
                      <button
                        onClick={handleTranslate}
                        className="p-2 text-gray-600 hover:text-gray-800 bg-gray-200 rounded-md"
                      >
                        Traduzir
                      </button>
                      <button
                        onClick={handleSendMessage}
                        className="p-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                      >
                        <Send size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">Selecione um usuário para iniciar uma conversa</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;