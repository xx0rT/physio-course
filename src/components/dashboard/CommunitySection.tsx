import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/authProvider";
import { FaUsers, FaTrophy, FaComments, FaHeart, FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  post_type: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  users: {
    first_name: string;
    last_name: string;
    profile_picture: string;
  };
}

export default function CommunitySection() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [postType, setPostType] = useState<'discussion' | 'challenge' | 'achievement'>('discussion');

  useEffect(() => {
    loadCommunityPosts();
  }, []);

  const loadCommunityPosts = async () => {
    const { data, error } = await supabase
      .from('community_posts')
      .select(`
        *,
        users (
          first_name,
          last_name,
          profile_picture
        )
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error loading community posts:', error);
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  const handleCreatePost = async () => {
    if (!user || !newPostTitle.trim() || !newPostContent.trim()) return;

    const { error } = await supabase
      .from('community_posts')
      .insert({
        user_id: user._id,
        title: newPostTitle,
        content: newPostContent,
        post_type: postType
      });

    if (error) {
      toast.error("Nepodařilo se vytvořit příspěvek");
    } else {
      toast.success("Příspěvek vytvořen!");
      setNewPostTitle("");
      setNewPostContent("");
      setShowNewPost(false);
      loadCommunityPosts();
    }
  };

  const getPostTypeLabel = (type: string) => {
    switch (type) {
      case 'discussion': return 'Diskuze';
      case 'challenge': return 'Výzva';
      case 'achievement': return 'Úspěch';
      default: return type;
    }
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'discussion': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'challenge': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'achievement': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FaUsers className="text-3xl text-blue-600 dark:text-blue-400" />
          <div>
            <h2 className="text-2xl font-bold text-neutral-800 dark:text-white">
              Komunita
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Zapojte se do diskuzí a výzev
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowNewPost(!showNewPost)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FaPlus />
          Nový příspěvek
        </button>
      </div>

      {showNewPost && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-bold text-neutral-800 dark:text-white mb-4">
            Vytvořit nový příspěvek
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                Typ příspěvku
              </label>
              <select
                value={postType}
                onChange={(e) => setPostType(e.target.value as any)}
                className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700"
              >
                <option value="discussion">Diskuze</option>
                <option value="challenge">Výzva</option>
                <option value="achievement">Úspěch</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                Nadpis
              </label>
              <input
                type="text"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                placeholder="Zadejte nadpis..."
                className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                Obsah
              </label>
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Sdílejte své myšlenky..."
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700"
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCreatePost}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Zveřejnit
              </button>
              <button
                onClick={() => setShowNewPost(false)}
                className="bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-600 dark:hover:bg-neutral-500 text-neutral-800 dark:text-white px-6 py-2 rounded-lg transition-colors"
              >
                Zrušit
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.length === 0 ? (
          <div className="col-span-full text-center py-12 text-neutral-600 dark:text-neutral-400">
            Zatím žádné příspěvky v komunitě
          </div>
        ) : (
          posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getPostTypeColor(post.post_type)}`}>
                  {getPostTypeLabel(post.post_type)}
                </span>
                {post.post_type === 'achievement' && (
                  <FaTrophy className="text-yellow-500 text-xl" />
                )}
              </div>

              <h3 className="text-lg font-bold text-neutral-800 dark:text-white mb-2">
                {post.title}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-3">
                {post.content}
              </p>

              <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400 mb-3">
                <div className="flex items-center gap-1">
                  <FaHeart className="text-red-500" />
                  <span>{post.likes_count}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaComments className="text-blue-500" />
                  <span>{post.comments_count}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-neutral-200 dark:border-neutral-700">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-bold">
                  {post.users.first_name[0]}{post.users.last_name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-800 dark:text-white truncate">
                    {post.users.first_name} {post.users.last_name}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {new Date(post.created_at).toLocaleDateString('cs-CZ')}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
