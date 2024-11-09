import React, { useState } from 'react';
import { Card, CardContent } from "../../UIs/shadcn-ui/card";
import { Button } from "../../UIs/shadcn-ui/button";
import { Textarea } from "../../UIs/shadcn-ui/textarea";
import { Heart, MessageCircle } from 'lucide-react';

const ForumMessage = () => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    {
      id: 1,
      user: 'Sarah',
      content: 'This is such a great point! Thanks for sharing.',
      likes: 5
    },
    {
      id: 2,
      user: 'Mike',
      content: 'I completely agree with your perspective!',
      likes: 3
    }
  ]);

  // Main message data
  const mainMessage = {
    user: "John Smith",
    content: "I believe the key to success is persistent effort and continuous learning. What are your thoughts on this approach?",
    timestamp: "2 hours ago",
    likes: 12
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newComment = {
      id: comments.length + 2,
      user: 'You',
      content: comment,
      likes: 0
    };

    setComments([...comments, newComment]);
    setComment('');
  };

  return (
    <div className="max-w-3xl font-dm-sans mx-auto p-4">
      {/* Main Message Card */}
      <Card className="bg-gradient-to-br from-teal-50 to-white shadow-lg mb-6">
        <CardContent className="p-6">
          <div className="border-b border-teal-100 pb-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-teal-700 text-lg">✨ {mainMessage.user}</h3>
                <span className="text-sm text-gray-500">{mainMessage.timestamp}</span>
              </div>
              <button 
                className="flex items-center space-x-1 text-teal-500 hover:text-teal-700 transition-colors"
              >
                <Heart className="w-5 h-5" fill="#14b8a6" />
                <span className="text-sm">{mainMessage.likes}</span>
              </button>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">
              {mainMessage.content}
            </p>
          </div>

          {/* Comments Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <MessageCircle className="w-5 h-5 text-teal-600" />
              <h4 className="font-medium text-teal-600">Comments ({comments.length})</h4>
            </div>

            <div className="space-y-4 mb-6">
              {comments.map((comment) => (
                <div 
                  key={comment.id} 
                  className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-teal-700">✨ {comment.user}</span>
                    <button 
                      className="flex items-center space-x-1 text-teal-500 hover:text-teal-700 transition-colors"
                      onClick={() => {
                        const updatedComments = comments.map(c => 
                          c.id === comment.id ? {...c, likes: c.likes + 1} : c
                        );
                        setComments(updatedComments);
                      }}
                    >
                      <Heart className="w-4 h-4" fill={comment.likes > 0 ? "#14b8a6" : "none"} />
                      <span className="text-sm">{comment.likes}</span>
                    </button>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <Textarea
                placeholder="Add your comment... ✨"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full min-h-[80px] p-3 rounded-xl border-teal-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 bg-white"
              />
              <div className="flex justify-end">
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-teal-500 to-teal-700 text-white hover:from-teal-600 hover:to-teal-800 rounded-xl px-6 py-2 transform transition-transform hover:scale-105"
                >
                  Add Comment ✨
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForumMessage;