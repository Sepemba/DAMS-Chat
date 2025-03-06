import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getPosts, createPost, likePost, commentOnPost, getUserById } from '../utils/storage';
import { Post } from '../types';
import Header from '../components/Header';
import DAMSMessage from '../components/DAMSMessage';
import { Heart, MessageSquare, Share2, Send } from 'lucide-react';
import { encodeDAMS } from '../utils/damsEncoder';

const Feed: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [previewContent, setPreviewContent] = useState<string>('');

  useEffect(() => {
    // Get all posts and sort by timestamp (newest first)
    const allPosts = getPosts().sort((a, b) => b.timestamp - a.timestamp);
    setPosts(allPosts);
  }, []);

  const handleCreatePost = () => {
    if (!user || !newPost.trim()) return;

    const post = createPost(user.id, newPost);
    setPosts([post, ...posts]);
    setNewPost('');
    setPreviewContent('');
  };

  const handlePreview = () => {
    if (!newPost.trim()) return;
    const encoded = encodeDAMS(newPost);
    setPreviewContent(encoded);
  };

  const handleLike = (postId: string) => {
    if (!user) return;

    likePost(postId, user.id);
    
    // Update posts state
    setPosts(posts.map(post => {
      if (post.id === postId) {
        if (post.likes.includes(user.id)) {
          return {
            ...post,
            likes: post.likes.filter(id => id !== user.id)
          };
        } else {
          return {
            ...post,
            likes: [...post.likes, user.id]
          };
        }
      }
      return post;
    }));
  };

  const handleComment = (postId: string) => {
    if (!user || !commentText[postId]?.trim()) return;

    commentOnPost(postId, user.id, commentText[postId]);
    
    // Update posts state
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: Math.random().toString(),
              userId: user.id,
              content: commentText[postId],
              encodedContent: encodeDAMS(commentText[postId]),
              timestamp: Date.now()
            }
          ]
        };
      }
      return post;
    }));
    
    // Clear comment text
    setCommentText({
      ...commentText,
      [postId]: ''
    });
  };

  const handleShare = (encodedContent: string) => {
    navigator.clipboard.writeText(encodedContent)
      .then(() => {
        alert('Mensagem codificada copiada para a área de transferência!');
      })
      .catch(err => {
        console.error('Erro ao copiar texto: ', err);
      });
  };

  const getUserName = (userId: string): string => {
    const postUser = getUserById(userId);
    return postUser ? postUser.username : 'Usuário desconhecido';
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-4 max-w-7xl">
        {/* Create post */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h2 className="text-lg font-medium mb-3">Criar nova publicação</h2>
          <textarea
            value={newPost}
            onChange={(e) => {
              setNewPost(e.target.value);
              setPreviewContent('');
            }}
            placeholder="O que você está pensando?"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-3"
            rows={3}
          />
          {previewContent && (
            <div className="mb-3 p-3 bg-gray-100 rounded-md">
              <p className="text-sm font-medium mb-1">Prévia da codificação:</p>
              <p className="font-mono break-all text-sm">{previewContent}</p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row justify-end gap-2.5 mt-2.5">
            <button
              onClick={handlePreview}
              className="w-full sm:w-[140px] h-[40px] px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Pré-visualizar
            </button>
            <button
              onClick={handleCreatePost}
              className="w-full sm:w-[100px] h-[40px] px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Publicar
            </button>
          </div>
        </div>
        
        {/* Posts list */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <p className="text-center text-gray-500 p-4 bg-white rounded-lg shadow-md">
              Nenhuma publicação ainda. Seja o primeiro a publicar!
            </p>
          ) : (
            posts.map(post => (
              <div key={post.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {getUserName(post.userId).charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">{getUserName(post.userId)}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(post.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <DAMSMessage 
                  encodedContent={post.encodedContent}
                  originalContent={post.content}
                  showTranslateButton={true}
                  requireCode={true}
                  postUserId={post.userId}
                />
                
                <div className="flex items-center mt-4 pt-3 border-t">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center mr-4 ${
                      post.likes.includes(user.id) ? 'text-red-500' : 'text-gray-500'
                    } hover:text-red-500`}
                  >
                    <Heart size={20} className={post.likes.includes(user.id) ? 'fill-current' : ''} />
                    <span className="ml-1">{post.likes.length}</span>
                  </button>
                  
                  <button
                    className="flex items-center mr-4 text-gray-500 hover:text-blue-500"
                  >
                    <MessageSquare size={20} />
                    <span className="ml-1">{post.comments.length}</span>
                  </button>
                  
                  <button
                    onClick={() => handleShare(post.encodedContent)}
                    className="flex items-center text-gray-500 hover:text-green-500"
                  >
                    <Share2 size={20} />
                    <span className="ml-1">Compartilhar</span>
                  </button>
                </div>
                
                {/* Comments */}
                {post.comments.length > 0 && (
                  <div className="mt-4 pt-3 border-t">
                    <h3 className="font-medium mb-2">Comentários</h3>
                    <div className="space-y-3">
                      {post.comments.map(comment => (
                        <div key={comment.id} className="flex">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                            {getUserName(comment.userId).charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-2 flex-1">
                            <p className="text-sm font-medium">{getUserName(comment.userId)}</p>
                            <DAMSMessage 
                              encodedContent={comment.encodedContent}
                              originalContent={comment.content}
                              showTranslateButton={true}
                              requireCode={false}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Add comment */}
                <div className="mt-4 pt-3 border-t flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-2 flex-1 relative">
                    <input
                      type="text"
                      value={commentText[post.id] || ''}
                      onChange={(e) => setCommentText({...commentText, [post.id]: e.target.value})}
                      placeholder="Adicionar um comentário..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => handleComment(post.id)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;