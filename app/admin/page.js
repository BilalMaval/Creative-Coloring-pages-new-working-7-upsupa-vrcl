'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, FolderOpen, Download, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    categories: 0,
    printables: 0,
    downloads: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [categoriesRes, printablesRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/printables?limit=1000')
        ]);

        const categoriesData = await categoriesRes.json();
        const printablesData = await printablesRes.json();

        if (categoriesData.success && printablesData.success) {
          const totalDownloads = printablesData.data.reduce((sum, p) => sum + (p.downloads || 0), 0);
          
          setStats({
            categories: categoriesData.data.length,
            printables: printablesData.data.length,
            downloads: totalDownloads
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '-' : stats.categories}</div>
            <p className="text-xs text-muted-foreground">Active categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Printables</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '-' : stats.printables}</div>
            <p className="text-xs text-muted-foreground">Available for download</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '-' : stats.downloads}</div>
            <p className="text-xs text-muted-foreground">Lifetime downloads</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common admin tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <button
              onClick={() => router.push('/admin/categories')}
              className="w-full text-left px-4 py-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <div className="font-medium">Manage Categories</div>
              <div className="text-sm text-muted-foreground">Add or edit categories</div>
            </button>
            <button
              onClick={() => router.push('/admin/printables')}
              className="w-full text-left px-4 py-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <div className="font-medium">Manage Printables</div>
              <div className="text-sm text-muted-foreground">Upload new coloring pages</div>
            </button>
            <button
              onClick={() => router.push('/admin/pages')}
              className="w-full text-left px-4 py-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <div className="font-medium">Edit Pages</div>
              <div className="text-sm text-muted-foreground">Update static page content</div>
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Set up your site</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">1</span>
              </div>
              <div>
                <div className="font-medium">Create Categories</div>
                <div className="text-sm text-muted-foreground">Organize your coloring pages by theme</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">2</span>
              </div>
              <div>
                <div className="font-medium">Upload Printables</div>
                <div className="text-sm text-muted-foreground">Add coloring pages with images and PDFs</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">3</span>
              </div>
              <div>
                <div className="font-medium">Customize Pages</div>
                <div className="text-sm text-muted-foreground">Edit About, Privacy, and Terms pages</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}