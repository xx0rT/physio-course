import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/authProvider";
import { FaEnvelope, FaEnvelopeOpen, FaReply, FaPaperPlane } from "react-icons/fa";
import { toast } from "react-toastify";

interface Message {
  id: string;
  subject: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender: {
    first_name: string;
    last_name: string;
    profile_picture: string;
  };
}

export default function MessagesSection() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadMessages();
    }
  }, [user]);

  const loadMessages = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:sender_id (
          first_name,
          last_name,
          profile_picture
        )
      `)
      .eq('receiver_id', user._id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error loading messages:', error);
    } else {
      setMessages(data || []);
    }
    setLoading(false);
  };

  const markAsRead = async (messageId: string) => {
    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', messageId);

    setMessages(prev =>
      prev.map(msg => msg.id === messageId ? { ...msg, is_read: true } : msg)
    );
  };

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    if (!message.is_read) {
      markAsRead(message.id);
    }
  };

  const handleSendReply = async () => {
    if (!user || !selectedMessage || !replyContent.trim()) return;

    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: user._id,
        receiver_id: selectedMessage.sender,
        subject: `Re: ${selectedMessage.subject}`,
        content: replyContent,
        parent_message_id: selectedMessage.id
      });

    if (error) {
      toast.error("Nepodařilo se odeslat zprávu");
    } else {
      toast.success("Zpráva odeslána!");
      setReplyContent("");
      setSelectedMessage(null);
    }
  };

  const unreadCount = messages.filter(m => !m.is_read).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 bg-white dark:bg-neutral-800 rounded-xl p-6 shadow">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-neutral-800 dark:text-white">
            Zprávy
          </h2>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-neutral-600 dark:text-neutral-400">
              Žádné zprávy
            </div>
          ) : (
            messages.map((message) => (
              <button
                key={message.id}
                onClick={() => handleMessageClick(message)}
                className={`w-full text-left p-4 rounded-lg transition-all ${
                  selectedMessage?.id === message.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500'
                    : message.is_read
                    ? 'bg-neutral-50 dark:bg-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-600'
                    : 'bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20 border-l-4 border-blue-500'
                }`}
              >
                <div className="flex items-start gap-3">
                  {message.is_read ? (
                    <FaEnvelopeOpen className="text-neutral-400 mt-1" />
                  ) : (
                    <FaEnvelope className="text-blue-500 mt-1" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${message.is_read ? 'font-normal' : 'font-bold'}`}>
                      {message.sender.first_name} {message.sender.last_name}
                    </p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
                      {message.subject}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                      {new Date(message.created_at).toLocaleDateString('cs-CZ')}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="lg:col-span-2 bg-white dark:bg-neutral-800 rounded-xl p-6 shadow">
        {selectedMessage ? (
          <div className="space-y-4">
            <div className="border-b border-neutral-200 dark:border-neutral-700 pb-4">
              <h3 className="text-xl font-bold text-neutral-800 dark:text-white mb-2">
                {selectedMessage.subject}
              </h3>
              <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                <span>
                  Od: {selectedMessage.sender.first_name} {selectedMessage.sender.last_name}
                </span>
                <span>•</span>
                <span>
                  {new Date(selectedMessage.created_at).toLocaleDateString('cs-CZ', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">
                {selectedMessage.content}
              </p>
            </div>

            <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
              <div className="flex items-center gap-2 mb-3">
                <FaReply className="text-blue-500" />
                <h4 className="font-semibold text-neutral-800 dark:text-white">Odpovědět</h4>
              </div>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Napište vaši odpověď..."
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
              <button
                onClick={handleSendReply}
                disabled={!replyContent.trim()}
                className="mt-3 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-400 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FaPaperPlane />
                Odeslat odpověď
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-neutral-500 dark:text-neutral-400">
            Vyberte zprávu pro zobrazení
          </div>
        )}
      </div>
    </div>
  );
}
