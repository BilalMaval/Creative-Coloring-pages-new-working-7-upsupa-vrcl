'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';

export default function AdminPrintablesPage() {
  const [printables, setPrintables] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPrintable, setEditingPrintable] = useState(null);
  const [uploading, setUploading] = useState({ image: false, pdf: false });
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    tags: '',
    image: '',
    pdf_url: '',
    category_id: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [printablesRes, categoriesRes] = await Promise.all([
        fetch('/api/printables?limit=1000'),
        fetch('/api/categories')
      ]);

      const printablesData = await printablesRes.json();
      const categoriesData = await categoriesRes.json();

      if (printablesData.success) setPrintables(printablesData.data);
      if (categoriesData.success) setCategories(categoriesData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (title) => {
    setFormData({
      ...formData,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    });
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading({ ...uploading, [type]: true });
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({
          ...prev,
          [type === 'image' ? 'image' : 'pdf_url']: data.url
        }));
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (error) {
      alert('Upload failed');
    } finally {
      setUploading({ ...uploading, [type]: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = '/api/printables';
      const method = editingPrintable ? 'PUT' : 'POST';
      const tags = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
      const body = editingPrintable 
        ? { ...formData, tags, _id: editingPrintable._id }
        : { ...formData, tags };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (data.success) {
        setDialogOpen(false);
        setEditingPrintable(null);
        setFormData({
          title: '',
          slug: '',
          description: '',
          tags: '',
          image: '',
          pdf_url: '',
          category_id: ''
        });
        fetchData();
      } else {
        alert(data.error || 'Failed to save printable');
      }
    } catch (error) {
      alert('Failed to save printable');
    }
  };

  const handleEdit = (printable) => {
    setEditingPrintable(printable);
    setFormData({
      title: printable.title,
      slug: printable.slug,
      description: printable.description || '',
      tags: Array.isArray(printable.tags) ? printable.tags.join(', ') : '',
      image: printable.image || '',
      pdf_url: printable.pdf_url || '',
      category_id: printable.category_id
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this printable?')) return;

    try {
      const res = await fetch(`/api/printables?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch (error) {
      alert('Failed to delete printable');
    }
  };

  const openNewDialog = () => {
    setEditingPrintable(null);
    setFormData({
      title: '',
      slug: '',
      description: '',
      tags: '',
      image: '',
      pdf_url: '',
      category_id: categories[0]?._id || ''
    });
    setDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Printables</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog} disabled={categories.length === 0}>
              <Plus className="h-4 w-4 mr-2" />
              New Printable
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPrintable ? 'Edit Printable' : 'New Printable'}</DialogTitle>
              <DialogDescription>
                {editingPrintable ? 'Update printable information' : 'Upload a new coloring page'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                  placeholder="e.g. Beautiful Butterfly Mandala"
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  placeholder="auto-generated-from-title"
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this printable"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="mandala, butterfly, nature"
                />
              </div>

              <div>
                <Label htmlFor="image">Preview Image *</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'image')}
                  disabled={uploading.image}
                />
                {formData.image && (
                  <div className="mt-2">
                    <img src={formData.image} alt="Preview" className="h-32 w-auto rounded" />
                  </div>
                )}
                {uploading.image && <p className="text-sm text-muted-foreground mt-2">Uploading image...</p>}
              </div>

              <div>
                <Label htmlFor="pdf">PDF File *</Label>
                <Input
                  id="pdf"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileUpload(e, 'pdf')}
                  disabled={uploading.pdf}
                />
                {formData.pdf_url && (
                  <p className="text-sm text-green-600 mt-2">✓ PDF uploaded</p>
                )}
                {uploading.pdf && <p className="text-sm text-muted-foreground mt-2">Uploading PDF...</p>}
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={!formData.image || !formData.pdf_url}>
                  {editingPrintable ? 'Update' : 'Create'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {categories.length === 0 && (
        <Card className="mb-4">
          <CardContent className="py-6">
            <p className="text-muted-foreground text-center">
              Please create at least one category before adding printables.
            </p>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : printables.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {printables.map((printable) => {
            const category = categories.find(c => c._id === printable.category_id);
            return (
              <Card key={printable._id}>
                <CardHeader>
                  {printable.image && (
                    <div className="mb-2 aspect-[3/4] relative rounded overflow-hidden bg-muted">
                      <img src={printable.image} alt={printable.title} className="object-cover w-full h-full" />
                    </div>
                  )}
                  <CardTitle className="line-clamp-1">{printable.title}</CardTitle>
                  {category && (
                    <p className="text-sm text-muted-foreground">{category.name}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {printable.description || 'No description'}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    {printable.downloads || 0} downloads
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(printable)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(printable._id)}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-20">
            <p className="text-muted-foreground mb-4">No printables yet</p>
            {categories.length > 0 && (
              <Button onClick={openNewDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Printable
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </AdminLayout>
  );
}