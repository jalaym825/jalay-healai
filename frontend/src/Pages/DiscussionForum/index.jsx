import React, { useEffect, useState } from 'react';
import { MessageCircle, Share2, ArrowUpCircle, Hash } from 'lucide-react';
import { Card, CardHeader, CardFooter } from '../../UIs/shadcn-ui/card';
import { Button } from '../../UIs/shadcn-ui/button';
import { Avatar, AvatarFallback } from '../../UIs/shadcn-ui/avatar';
import { Input } from '../../UIs/shadcn-ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '../../UIs/shadcn-ui/dialog';
import { Textarea } from '../../UIs/shadcn-ui/textarea';
import { Label } from '../../UIs/shadcn-ui/label';
import Global from '@/Utils/Global';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { LottieAnimation } from '@/Components/Lottie/LottieAnimation';
import healthLoader from '../../assets/healthLoader.json';


const DiscussionForum = () => {
    const [forumContent, setForumContent] = React.useState({
        content: ''
    });
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [forumData, setForumData] = React.useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchForumData = async () => {
            try {
                setLoading(true);
                const response = await Global.httpGet(`/forums`);
                setForumData(response['forums']);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchForumData();
    }, []);

    if (loading) {
        return <div className="flex h-[80vh] w-full justify-center items-center">
            <div className="w-[35vw] h-[35vh]">
                <LottieAnimation animationData={healthLoader} loop={true} />
            </div>
        </div>
    }


    const resetForm = () => {
        setForumContent({
            content: ''
        });
    };

    const handlePostDiscussion = async () => {
        if (!forumContent.content.trim()) {
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await Global.httpPost('/forums/createforum', {
                message: forumContent.content
            });
            console.log(response.id);
            toast.success('Discussion posted successfully');
            setIsDialogOpen(false);
            resetForm();
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };





    return (
        <div className="min-h-screen font-dm-sans bg-gradient-to-br from-teal-500 to-teal-700 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Discussion Forum</h1>
                        <p className="text-teal-100 mt-2">Join the conversation with fellow developers</p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) resetForm();
                    }}>
                        <DialogTrigger asChild>
                            <Button className="bg-white text-teal-700 hover:bg-teal-50 font-medium">
                                <MessageCircle className="mr-2 h-4 w-4" />
                                New Forum
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[525px] font-dm-sans">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-semibold">Create New Forum</DialogTitle>
                                <DialogDescription className="text-gray-500">
                                    Share your thoughts and start a discussion with the community.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="content" className="text-sm font-medium">
                                        Add DiscussionForum message
                                    </Label>
                                    <Textarea
                                        id="content"
                                        placeholder="Write your forum content here..."
                                        className="min-h-[150px] border-gray-200 focus-visible:ring-teal-500 resize-none"
                                        onChange={(e) => setForumContent({ ...forumContent, content: e.target.value })}
                                        value={forumContent.content}
                                    />
                                </div>
                            </div>
                            <DialogFooter className="flex space-x-2 pt-4 border-t">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsDialogOpen(false);
                                        resetForm();
                                    }}
                                    className="text-gray-600"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="bg-teal-600 text-white hover:bg-teal-700"
                                    onClick={handlePostDiscussion}
                                    disabled={isSubmitting || !forumContent.content.trim()}
                                >
                                    {isSubmitting ? 'Posting...' : 'Post Discussion'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Search and filters */}
                <div className="flex gap-4 mb-6">
                    <Input
                        placeholder="Search discussions..."
                        className="w-full bg-white/90 border-0 focus-visible:ring-2 focus-visible:ring-white"
                    />
                    <Button variant="outline" className="bg-white/90 border-0 text-teal-700 hover:bg-white">
                        <Hash className="h-4 w-4 mr-2" />
                        Filter
                    </Button>
                </div>

                {
                    forumData.length > 0 ? (
                        forumData.map((post) => (
                            <Link to={`/forum/${post.id}`}>
                                <Card key={post.id} className="bg-white/95 mt-4 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <Avatar>
                                                    <AvatarFallback>{post.original_message.user_id[0]}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h3 className="font-semibold text-lg">{post.original_message.message}</h3>
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <span>{post.original_message.user_id}</span>
                                                        <span className="mx-2">•</span>
                                                        <span>10</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardFooter className="border-t pt-4">
                                        <div className="flex items-center space-x-4 text-gray-500">
                                            <Button variant="ghost" size="sm" className="flex items-center">
                                                <ArrowUpCircle className="h-4 w-4 mr-1" />
                                                10
                                            </Button>
                                            <Button variant="ghost" size="sm" className="flex items-center">
                                                <MessageCircle className="h-4 w-4 mr-1" />
                                                20
                                            </Button>
                                            <Button variant="ghost" size="sm">
                                                <Share2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </Link>
                        ))
                    ) : (
                        <p>No forums available.</p>
                    )
                }

            </div>
        </div>
    );
};

export default DiscussionForum;