import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "../../UIs/shadcn-ui/card";
import { Button } from "../../UIs/shadcn-ui/button";
import { Textarea } from "../../UIs/shadcn-ui/textarea";
import { Heart, MessageCircle } from 'lucide-react';
import healthLoader from '../../assets/healthLoader.json';
import { useParams } from 'react-router-dom';
import Global from '@/Utils/Global';
import { toast } from 'sonner';
import { LottieAnimation } from '@/Components/Lottie/LottieAnimation';

const ForumMessage = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [forumLoading, setForumLoading] = useState(false);
    const [forumData, setForumData] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [username, setUsername] = useState("");
    const [addComment, setAddComment] = useState('');

    useEffect(() => {
        if (id) {
            const fetchforumdata = async () => {
                try {
                    setLoading(true);
                    const response = await Global.httpGet(`/forums/${id}`);
                    setForumData(response.forum_messages);
                    setOriginalData(response.original_message);
                    setUsername(response.original_message.user.firstName);
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            }
            fetchforumdata();
        }
    }, [id]);
    if (loading) {
        return <div className="flex h-[80vh] w-full justify-center items-center">
            <div className="w-[35vw] h-[35vh]">
                <LottieAnimation animationData={healthLoader} loop={true} />
            </div>
        </div>
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!id) return;
        setForumLoading(true);
        try {
            const response = await Global.httpPost('/forums/postMessage', {
                message: addComment,
                forum_id: parseInt(id)
            });
            toast.success('Comment added successfully');
            setForumData([...forumData, response]);
            setAddComment(false);
            setAddComment('');
            toast.success('Comment added successfully');
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setForumLoading(false);
        }
    };

    return (
        <div>


            <div className="max-w-3xl font-dm-sans mx-auto p-4">
                {/* Main Message Card */}
                <Card className="bg-gradient-to-br from-teal-50 to-white shadow-lg mb-6">
                    <CardContent className="p-6">

                        <div className="border-b border-teal-100 pb-4 mb-4">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <h3 className="font-semibold text-teal-700 text-lg">✨ {username}</h3>
                                    {/* <span className="text-sm text-gray-500">{mainMessage.timestamp}</span> */}
                                </div>
                                <button
                                    className="flex items-center space-x-1 text-teal-500 hover:text-teal-700 transition-colors"
                                >
                                    <Heart className="w-5 h-5" fill="#14b8a6" />
                                    {/* <span className="text-sm">{mainMessage.likes}</span> */}
                                </button>
                            </div>
                            <p className="text-gray-700 text-lg leading-relaxed">
                                {originalData.message}
                            </p>
                        </div>


                        {
                            forumData.map((comment) => (
                                <div>

                                    <div className="space-y-4 mb-6">
                                        <div
                                            key={comment.id}
                                            className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-medium text-teal-700">✨ {comment['user'].firstName}</span>

                                            </div>
                                            <p className="text-gray-700">{comment.message}</p>
                                        </div>
                                    </div>

                                    {/* Comment Form */}

                                </div>
                            ))
                        }
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <Textarea
                                placeholder="Add your comment... ✨"
                                value={addComment}
                                onChange={(e) => setAddComment(e.target.value)}
                                className="w-full min-h-[80px] p-3 rounded-xl border-teal-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 bg-white"
                            />
                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    className={`bg-gradient-to-r from-teal-500 to-teal-700 text-white hover:from-teal-600 hover:to-teal-800 rounded-xl px-6 py-2 transform transition-transform hover:scale-105 ${forumLoading ? 'cursor-not-allowed opacity-50' : ''
                                        }`}
                                    disabled={forumLoading} 
                                >
                                    {forumLoading ? (
                                        <div className="flex items-center">
                                            <svg
                                                className="animate-spin h-5 w-5 mr-2 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8v8H4z"
                                                ></path>
                                            </svg>
                                            Adding...
                                        </div>
                                    ) : (
                                        'Add Comment ✨'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>

    );
};

export default ForumMessage;