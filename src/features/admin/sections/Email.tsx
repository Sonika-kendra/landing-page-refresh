import { useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EmailEditor, { EditorRef } from 'react-email-editor';
import { ArrowLeft, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AdminPageHeader from '../components/AdminPageHeader';
import { adminApi } from '@/api/admin';
import { toast } from 'sonner';

const AdminEmailEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const emailEditorRef = useRef<EditorRef>(null);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');

  const onReady = useCallback(async () => {
    if (!id) return;
    try {
      const res = await adminApi.getEmailTemplateById(id);
      setName(res.data.name || 'New Template');
      if (res.data.design && emailEditorRef.current?.editor) {
        emailEditorRef.current.editor.loadDesign(res.data.design as object);
      }
    } catch {
      toast.error('Failed to load template');
    }
  }, [id]);

  const saveDesign = () => {
    if (!id || !emailEditorRef.current?.editor) return;
    setSaving(true);
    emailEditorRef.current.editor.exportHtml(async (data) => {
      const { design, html } = data;
      try {
        await adminApi.saveEmailTemplate(id, design, html, name);
        toast.success('Template saved');
      } catch {
        toast.error('Failed to save template');
      } finally {
        setSaving(false);
      }
    });
  };

  return (
    <div>
      <AdminPageHeader
        title="Email Editor"
        description="Edit the template design and name, then save."
        actions={
          <div className="flex items-center gap-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Template name"
              className="h-8 w-48 text-sm"
            />
            <Button variant="outline" size="sm" onClick={() => navigate('/admin/email')}>
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              All Templates
            </Button>
            <Button size="sm" onClick={saveDesign} disabled={saving}>
              <Mail className="h-4 w-4 mr-1.5" />
              {saving ? 'Saving…' : 'Save Template'}
            </Button>
          </div>
        }
      />
      <EmailEditor
        ref={emailEditorRef}
        onReady={onReady}
        options={{ displayMode: 'email' }}
        style={{ height: '80vh', borderRadius: '4px', overflow: 'hidden' }}
      />
    </div>
  );
};

export default AdminEmailEditor;
