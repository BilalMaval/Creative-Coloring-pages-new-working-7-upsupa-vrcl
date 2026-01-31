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
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit, Trash2, Loader2, Package, Star, X, Image as ImageIcon } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState({ image: false, pdf: false, gallery: false });
  
  // Filter states
  const [filterCollection, setFilterCollection] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  
  // Form states
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    tags: '',
    image: '',
    pdfPath: '',
    categoryId: '',
    price: '0',
    isFree: true,
    gallery: [],
    printLength: '',
    language: '',
    dimensions: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Update available categories when selected collections change
    if (selectedCollections.length > 0) {
      const cats = allCategories.filter(cat => 
        cat.parentId && selectedCollections.includes(cat.parentId)
      );
      setAvailableCategories(cats);
    } else {
      setAvailableCategories([]);
    }
  }, [selectedCollections, allCategories]);

  // Check if Bookshop or Printables is selected
  const isBookshopSelected = selectedCollections.some(colId => {
    const col = collections.find(c => c.id === colId);
    return col?.slug === 'bookshop';
  });
  
  const isPrintablesOrBookshopSelected = selectedCollections.some(colId => {
    const col = collections.find(c => c.id === colId);
    return col?.slug === 'bookshop' || col?.slug === 'printables';
  });

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes, collectionsRes] = await Promise.all([
        fetch('/api/printables?limit=1000'),
        fetch('/api/categories'),
        fetch('/api/collections')
      ]);

      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();
      const collectionsData = await collectionsRes.json();

      if (productsData.success) setProducts(productsData.data);
      if (categoriesData.success) setAllCategories(categoriesData.data);
      if (collectionsData.success) setCollections(collectionsData.data);
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

  const handleCollectionToggle = (collectionId) => {
    setSelectedCollections(prev => {
      if (prev.includes(collectionId)) {
        const newCollections = prev.filter(id => id !== collectionId);
        setSelectedCategories(cats => 
          cats.filter(catId => {
            const cat = allCategories.find(c => c.id === catId);
            return cat && newCollections.includes(cat.parentId);
          })
        );
        return newCollections;
      } else {
        return [...prev, collectionId];
      }
    });
  };

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
    if (!formData.categoryId || !selectedCategories.includes(formData.categoryId)) {
      setFormData(prev => ({ ...prev, categoryId: categoryId }));
    }
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading({ ...uploading, [type]: true });
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('type', type);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData
      });

      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({
          ...prev,
          [type === 'image' ? 'image' : 'pdfPath']: data.url
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

  const handleGalleryUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading({ ...uploading, gallery: true });
    
    const uploadedUrls = [];
    
    try {
      // Upload all files
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        uploadFormData.append('type', 'image');

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData
        });

        const data = await res.json();
        if (data.success) {
          uploadedUrls.push(data.url);
        } else {
          console.error(`Failed to upload ${file.name}:`, data.error);
        }
      }
      
      // Add all uploaded URLs to gallery
      if (uploadedUrls.length > 0) {
        setFormData(prev => ({
          ...prev,
          gallery: [...prev.gallery, ...uploadedUrls]
        }));
      }
      
      if (uploadedUrls.length < files.length) {
        alert(`Uploaded ${uploadedUrls.length} of ${files.length} images`);
      }
    } catch (error) {
      alert('Upload failed');
    } finally {
      setUploading({ ...uploading, gallery: false });
      // Reset the input
      e.target.value = '';
    }
  };

  const removeGalleryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedCategories.length === 0) {
      alert('Please select at least one category');
      return;
    }
    
    try {
      const url = '/api/printables';
      const method = editingProduct ? 'PUT' : 'POST';
      const tags = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
      
      const mainCategoryId = selectedCategories[0];
      
      const body = {
        ...formData,
        tags,
        categoryId: mainCategoryId,
        price: parseFloat(formData.price) || 0,
        isFree: formData.isFree,
        gallery: formData.gallery,
        printLength: formData.printLength || null,
        language: formData.language || null,
        dimensions: formData.dimensions || null,
        customFields: {
          additionalCategories: selectedCategories.slice(1),
          collections: selectedCollections
        }
      };
      
      if (editingProduct) {
        body.id = editingProduct.id;
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (data.success) {
        setDialogOpen(false);
        setEditingProduct(null);
        resetForm();
        fetchData();
      } else {
        alert(data.error || 'Failed to save product');
      }
    } catch (error) {
      alert('Failed to save product');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      description: '',
      tags: '',
      image: '',
      pdfPath: '',
      categoryId: '',
      price: '0',
      isFree: true,
      gallery: [],
      printLength: '',
      language: '',
      dimensions: ''
    });
    setSelectedCollections([]);
    setSelectedCategories([]);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    
    const category = allCategories.find(c => c.id === product.categoryId);
    const collectionId = category?.parentId;
    
    const additionalCategories = product.customFields?.additionalCategories || [];
    const storedCollections = product.customFields?.collections || (collectionId ? [collectionId] : []);
    
    setSelectedCollections(storedCollections);
    setSelectedCategories([product.categoryId, ...additionalCategories]);
    
    setFormData({
      title: product.title,
      slug: product.slug,
      description: product.description || '',
      tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
      image: product.webpPath || '',
      pdfPath: product.pdfPath || '',
      categoryId: product.categoryId,
      price: String(product.price || 0),
      isFree: product.isFree !== false,
      gallery: product.gallery || [],
      printLength: product.printLength || '',
      language: product.language || '',
      dimensions: product.dimensions || ''
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/printables?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch (error) {
      alert('Failed to delete product');
    }
  };

  const openNewDialog = () => {
    setEditingProduct(null);
    resetForm();
    setDialogOpen(true);
  };

  // Filter products
  const childCategories = allCategories.filter(cat => cat.parentId !== null);
  const filterCategories = filterCollection === 'all' 
    ? childCategories 
    : childCategories.filter(cat => cat.parentId === filterCollection);
  
  const filteredProducts = products.filter(product => {
    if (filterCollection !== 'all') {
      const category = allCategories.find(c => c.id === product.categoryId);
      if (!category || category.parentId !== filterCollection) return false;
    }
    if (filterCategory !== 'all' && product.categoryId !== filterCategory) return false;
    return true;
  });

  const getCategoryName = (categoryId) => {
    const category = allCategories.find(c => c.id === categoryId);
    return category?.name || 'Unknown';
  };

  const getCollectionName = (categoryId) => {
    const category = allCategories.find(c => c.id === categoryId);
    if (!category) return 'Unknown';
    const collection = collections.find(c => c.id === category.parentId);
    return collection?.name || 'Unknown';
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog} disabled={collections.length === 0}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
              <DialogDescription>
                {editingProduct ? 'Update product information' : 'Create a new product'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Collections Selection */}
              <div>
                <Label>Select Collections *</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 p-3 border rounded-md bg-muted/50">
                  {collections.map((collection) => (
                    <div key={collection.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`collection-${collection.id}`}
                        checked={selectedCollections.includes(collection.id)}
                        onCheckedChange={() => handleCollectionToggle(collection.id)}
                      />
                      <label
                        htmlFor={`collection-${collection.id}`}
                        className="text-sm font-medium cursor-pointer"
                      >
                        {collection.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Categories Selection */}
              {selectedCollections.length > 0 && (
                <div>
                  <Label>Select Categories *</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2 p-3 border rounded-md bg-muted/50 max-h-48 overflow-y-auto">
                    {availableCategories.map((category) => {
                      const collection = collections.find(c => c.id === category.parentId);
                      return (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category.id}`}
                            checked={selectedCategories.includes(category.id)}
                            onCheckedChange={() => handleCategoryToggle(category.id)}
                          />
                          <label
                            htmlFor={`category-${category.id}`}
                            className="text-sm cursor-pointer"
                          >
                            {category.name}
                            <span className="text-xs text-muted-foreground ml-1">({collection?.name})</span>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                  {availableCategories.length === 0 && (
                    <p className="text-sm text-muted-foreground mt-2">No categories in selected collections</p>
                  )}
                </div>
              )}

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
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this product"
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

              {/* Pricing */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Checkbox
                    id="isFree"
                    checked={formData.isFree}
                    onCheckedChange={(checked) => setFormData({ ...formData, isFree: checked })}
                  />
                  <label htmlFor="isFree" className="text-sm font-medium cursor-pointer">
                    Free Download
                  </label>
                </div>
              </div>

              {/* Book Parameters - Only for Bookshop */}
              {isBookshopSelected && (
                <div className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
                  <Label className="text-purple-800 font-bold mb-3 block">📚 Book Parameters</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="printLength">Print Length</Label>
                      <Input
                        id="printLength"
                        value={formData.printLength}
                        onChange={(e) => setFormData({ ...formData, printLength: e.target.value })}
                        placeholder="e.g. 150 pages"
                      />
                    </div>
                    <div>
                      <Label htmlFor="language">Language</Label>
                      <Input
                        id="language"
                        value={formData.language}
                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                        placeholder="e.g. English"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dimensions">Dimensions</Label>
                      <Input
                        id="dimensions"
                        value={formData.dimensions}
                        onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                        placeholder="e.g. 8.5 x 11 in"
                      />
                    </div>
                  </div>
                </div>
              )}

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

              {/* Photo Gallery - For Printables and Bookshop */}
              {isPrintablesOrBookshopSelected && (
                <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                  <Label className="text-blue-800 font-bold mb-3 block">📷 Photo Gallery (Multiple Images)</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryUpload}
                    disabled={uploading.gallery}
                  />
                  {uploading.gallery && <p className="text-sm text-muted-foreground mt-2">Uploading images...</p>}
                  
                  {formData.gallery.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.gallery.map((img, index) => (
                        <div key={index} className="relative">
                          <img src={img} alt={`Gallery ${index + 1}`} className="h-16 w-16 object-cover rounded" />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Select multiple images at once (hold Ctrl/Cmd to select multiple files)
                  </p>
                </div>
              )}

              <div>
                <Label htmlFor="pdf">PDF/File *</Label>
                <Input
                  id="pdf"
                  type="file"
                  accept=".pdf,.epub,.zip"
                  onChange={(e) => handleFileUpload(e, 'pdf')}
                  disabled={uploading.pdf}
                />
                {formData.pdfPath && (
                  <p className="text-sm text-green-600 mt-2">✓ File uploaded</p>
                )}
                {uploading.pdf && <p className="text-sm text-muted-foreground mt-2">Uploading file...</p>}
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={selectedCategories.length === 0}>
                  {editingProduct ? 'Update' : 'Create'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {collections.length === 0 && (
        <Card className="mb-4">
          <CardContent className="py-6">
            <p className="text-muted-foreground text-center">
              Please create at least one collection and category before adding products.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      {collections.length > 0 && (
        <div className="flex gap-4 mb-6">
          <div>
            <Label>Filter by Collection</Label>
            <Select value={filterCollection} onValueChange={(val) => { setFilterCollection(val); setFilterCategory('all'); }}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Collections</SelectItem>
                {collections.map((collection) => (
                  <SelectItem key={collection.id} value={collection.id}>
                    {collection.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Filter by Category</Label>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {filterCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                {product.webpPath && (
                  <div className="mb-2 aspect-[3/4] relative rounded overflow-hidden bg-muted">
                    <img src={product.webpPath} alt={product.title} className="object-cover w-full h-full" />
                  </div>
                )}
                <CardTitle className="line-clamp-1 flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  {product.title}
                </CardTitle>
                <div className="text-xs space-y-1">
                  <p className="text-blue-600">Collection: {getCollectionName(product.categoryId)}</p>
                  <p className="text-green-600">Category: {getCategoryName(product.categoryId)}</p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {product.description || 'No description'}
                </p>
                <div className="flex items-center gap-2 mb-4">
                  {product.isFree ? (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">FREE</span>
                  ) : (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">${product.price}</span>
                  )}
                  <span className="text-xs text-muted-foreground">{product.downloads || 0} downloads</span>
                  {product.gallery?.length > 0 && (
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                      <ImageIcon className="h-3 w-3" /> {product.gallery.length}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(product)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(product.id)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-20">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No products yet</p>
            {collections.length > 0 && childCategories.length > 0 && (
              <Button onClick={openNewDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Product
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </AdminLayout>
  );
}
