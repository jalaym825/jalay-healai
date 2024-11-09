import React, { useEffect } from 'react';
import { MessageCircle, Heart, Share2, BookmarkPlus, ArrowUpCircle, Hash } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '../../UIs/shadcn-ui/card';
import { Button } from '../../UIs/shadcn-ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../../UIs/shadcn-ui/avatar';
import { Input } from '../../UIs/shadcn-ui/input';
import { Badge } from '../../UIs/shadcn-ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '../../UIs/shadcn-ui/dialog';
import { Textarea } from '../../UIs/shadcn-ui/textarea';
import { Label } from '../../UIs/shadcn-ui/label';
import Global from '@/Utils/Global';
import { toast } from 'sonner';

const DiscussionForum = () => {
    const [forumContent, setForumContent] = React.useState({
        content: ''
    });
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [forumId, setForumId] = React.useState(null);
    const [forumData, setForumData] = React.useState({});


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
            setForumId(response.id);
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
    
   


    const posts = [
        {
            id: 1,
            title: "What's your favorite programming language and why?",
            author: "Sarah Chen",
            content: "I've been coding for a few years now and I'm curious to hear everyone's preferences. Personally, I love Python for its simplicity and vast ecosystem.",
            tags: ["Programming", "Discussion"],
            likes: 42,
            replies: 28,
            timeAgo: "2h ago"
        },
        {
            id: 2,
            title: "Tips for Remote Work Productivity",
            author: "Alex Kumar",
            content: "After working remotely for 2 years, I've gathered some effective strategies for staying productive. Here are my top recommendations...",
            tags: ["Remote Work", "Productivity"],
            likes: 89,
            replies: 56,
            timeAgo: "5h ago"
        }
    ];



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

                {/* Posts */}
                {posts.map(post => (
                    <Card key={post.id} className="bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <Avatar>
                                        <AvatarFallback>{post.author[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-semibold text-lg">{post.title}</h3>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <span>{post.author}</span>
                                            <span className="mx-2">•</span>
                                            <span>{post.timeAgo}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">{post.content}</p>
                            <div className="flex gap-2 mt-4">
                                {post.tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="bg-teal-100 text-teal-700 hover:bg-teal-200">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="border-t pt-4">
                            <div className="flex items-center space-x-4 text-gray-500">
                                <Button variant="ghost" size="sm" className="flex items-center">
                                    <ArrowUpCircle className="h-4 w-4 mr-1" />
                                    {post.likes}
                                </Button>
                                <Button variant="ghost" size="sm" className="flex items-center">
                                    <MessageCircle className="h-4 w-4 mr-1" />
                                    {post.replies}
                                </Button>
                                <Button variant="ghost" size="sm">
                                    <Share2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default DiscussionForum;