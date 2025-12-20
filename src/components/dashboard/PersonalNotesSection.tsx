import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/authProvider";
import { FaStickyNote, FaCheckCircle, FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";

interface Note {
  id: string;
  title: string;
  content: string;
  note_type: 'note' | 'goal';
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export default function PersonalNotesSection() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    note_type: 'note' as 'note' | 'goal'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadNotes();
    }
  }, [user]);

  const loadNotes = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_notes')
      .select('*')
      .eq('user_id', user._id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading notes:', error);
    } else {
      setNotes(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!user || !formData.title.trim()) return;

    if (editingNote) {
      const { error } = await supabase
        .from('user_notes')
        .update({
          title: formData.title,
          content: formData.content,
          note_type: formData.note_type,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingNote.id);

      if (error) {
        toast.error("Nepodařilo se upravit poznámku");
      } else {
        toast.success("Poznámka upravena!");
        resetForm();
        loadNotes();
      }
    } else {
      const { error } = await supabase
        .from('user_notes')
        .insert({
          user_id: user._id,
          title: formData.title,
          content: formData.content,
          note_type: formData.note_type
        });

      if (error) {
        toast.error("Nepodařilo se vytvořit poznámku");
      } else {
        toast.success("Poznámka vytvořena!");
        resetForm();
        loadNotes();
      }
    }
  };

  const handleToggleComplete = async (note: Note) => {
    const { error } = await supabase
      .from('user_notes')
      .update({ is_completed: !note.is_completed })
      .eq('id', note.id);

    if (error) {
      toast.error("Nepodařilo se aktualizovat");
    } else {
      loadNotes();
    }
  };

  const handleDelete = async (noteId: string) => {
    if (!confirm('Opravdu chcete smazat tuto poznámku?')) return;

    const { error } = await supabase
      .from('user_notes')
      .delete()
      .eq('id', noteId);

    if (error) {
      toast.error("Nepodařilo se smazat poznámku");
    } else {
      toast.success("Poznámka smazána!");
      loadNotes();
    }
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content || '',
      note_type: note.note_type
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ title: '', content: '', note_type: 'note' });
    setEditingNote(null);
    setShowForm(false);
  };

  const goals = notes.filter(n => n.note_type === 'goal');
  const regularNotes = notes.filter(n => n.note_type === 'note');

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
          <FaStickyNote className="text-3xl text-yellow-600 dark:text-yellow-400" />
          <h2 className="text-2xl font-bold text-neutral-800 dark:text-white">
            Poznámky a cíle
          </h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FaPlus />
          {editingNote ? 'Upravit' : 'Přidat'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow">
          <h3 className="text-lg font-bold text-neutral-800 dark:text-white mb-4">
            {editingNote ? 'Upravit' : 'Nová'} poznámka
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                Typ
              </label>
              <select
                value={formData.note_type}
                onChange={(e) => setFormData({ ...formData, note_type: e.target.value as 'note' | 'goal' })}
                className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700"
              >
                <option value="note">Poznámka</option>
                <option value="goal">Cíl</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                Nadpis
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                Obsah
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                {editingNote ? 'Uložit změny' : 'Vytvořit'}
              </button>
              <button
                onClick={resetForm}
                className="bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-600 dark:hover:bg-neutral-500 px-6 py-2 rounded-lg transition-colors"
              >
                Zrušit
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-bold text-neutral-800 dark:text-white mb-4">
            Cíle ({goals.filter(g => !g.is_completed).length}/{goals.length})
          </h3>
          <div className="space-y-3">
            {goals.length === 0 ? (
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                Zatím žádné cíle
              </p>
            ) : (
              goals.map(goal => (
                <div
                  key={goal.id}
                  className={`bg-white dark:bg-neutral-800 rounded-lg p-4 shadow ${
                    goal.is_completed ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleComplete(goal)}
                      className={`mt-1 ${
                        goal.is_completed
                          ? 'text-green-500'
                          : 'text-neutral-400 hover:text-green-500'
                      }`}
                    >
                      <FaCheckCircle className="text-xl" />
                    </button>
                    <div className="flex-1">
                      <h4 className={`font-semibold text-neutral-800 dark:text-white ${
                        goal.is_completed ? 'line-through' : ''
                      }`}>
                        {goal.title}
                      </h4>
                      {goal.content && (
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                          {goal.content}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(goal)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(goal.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-neutral-800 dark:text-white mb-4">
            Poznámky ({regularNotes.length})
          </h3>
          <div className="space-y-3">
            {regularNotes.length === 0 ? (
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                Zatím žádné poznámky
              </p>
            ) : (
              regularNotes.map(note => (
                <div
                  key={note.id}
                  className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 shadow border-l-4 border-yellow-400"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-neutral-800 dark:text-white">
                        {note.title}
                      </h4>
                      {note.content && (
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                          {note.content}
                        </p>
                      )}
                      <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-2">
                        {new Date(note.created_at).toLocaleDateString('cs-CZ')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(note)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
