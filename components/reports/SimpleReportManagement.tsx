"use client";

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useTranslations } from '@/hooks/useTranslations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  RefreshCw,
  Share,
  Clock,
  CheckCircle,
  AlertCircle,
  PieChart,
  Activity
} from 'lucide-react';

interface Report {
  id: string;
  title: string;
  description: string;
  template: 'sales' | 'customer' | 'inventory' | 'financial' | 'performance';
  status: 'draft' | 'published' | 'scheduled';
  createdAt: string;
  updatedAt: string;
  author: string;
  tags: string[];
  data?: any;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  fields: string[];
  charts: string[];
}

const reportTemplates: ReportTemplate[] = [
  {
    id: 'sales',
    name: 'Sales Analytics Report',
    description: 'Comprehensive sales performance analysis with revenue trends and product insights',
    icon: <DollarSign className="h-6 w-6" />,
    color: 'bg-green-500',
    fields: ['Revenue', 'Orders', 'Average Order Value', 'Top Products', 'Sales Trends'],
    charts: ['Revenue Chart', 'Product Performance', 'Sales by Time']
  },
  {
    id: 'customer',
    name: 'Customer Insights Report',
    description: 'Customer behavior analysis, demographics, and satisfaction metrics',
    icon: <Users className="h-6 w-6" />,
    color: 'bg-blue-500',
    fields: ['Customer Count', 'Demographics', 'Satisfaction Score', 'Retention Rate', 'Feedback'],
    charts: ['Customer Growth', 'Demographics Chart', 'Satisfaction Trends']
  },
  {
    id: 'inventory',
    name: 'Inventory Management Report',
    description: 'Stock levels, product movement, and inventory optimization insights',
    icon: <BarChart3 className="h-6 w-6" />,
    color: 'bg-orange-500',
    fields: ['Stock Levels', 'Product Movement', 'Low Stock Alerts', 'Waste Analysis', 'Cost Analysis'],
    charts: ['Stock Level Chart', 'Movement Trends', 'Cost Analysis']
  },
  {
    id: 'financial',
    name: 'Financial Performance Report',
    description: 'Profit & loss analysis, expense tracking, and financial health metrics',
    icon: <PieChart className="h-6 w-6" />,
    color: 'bg-purple-500',
    fields: ['Revenue', 'Expenses', 'Profit Margin', 'Cash Flow', 'ROI Analysis'],
    charts: ['P&L Chart', 'Expense Breakdown', 'Cash Flow Trends']
  },
  {
    id: 'performance',
    name: 'Operational Performance Report',
    description: 'Service quality, efficiency metrics, and operational KPIs',
    icon: <Activity className="h-6 w-6" />,
    color: 'bg-red-500',
    fields: ['Service Time', 'Order Accuracy', 'Staff Performance', 'Peak Hours', 'Efficiency Score'],
    charts: ['Performance Metrics', 'Service Time Trends', 'Efficiency Analysis']
  }
];

const sampleReports: Report[] = [
  {
    id: '1',
    title: 'Monthly Sales Report - December 2024',
    description: 'Comprehensive analysis of December sales performance with year-over-year comparison',
    template: 'sales',
    status: 'published',
    createdAt: '2024-12-28',
    updatedAt: '2024-12-30',
    author: 'Restaurant Manager',
    tags: ['monthly', 'sales', 'december'],
    data: {
      revenue: 125000,
      orders: 2450,
      avgOrderValue: 51.02,
      topProducts: ['Pad Thai', 'Green Curry', 'Tom Yum Soup']
    }
  },
  {
    id: '2',
    title: 'Customer Satisfaction Analysis Q4 2024',
    description: 'Quarterly customer feedback analysis and satisfaction metrics',
    template: 'customer',
    status: 'published',
    createdAt: '2024-12-25',
    updatedAt: '2024-12-27',
    author: 'Marketing Team',
    tags: ['quarterly', 'customer', 'satisfaction'],
    data: {
      customerCount: 1850,
      satisfactionScore: 4.6,
      retentionRate: 78,
      newCustomers: 320
    }
  },
  {
    id: '3',
    title: 'Inventory Status Report - Week 52',
    description: 'Weekly inventory levels and stock movement analysis',
    template: 'inventory',
    status: 'draft',
    createdAt: '2024-12-30',
    updatedAt: '2024-12-30',
    author: 'Kitchen Manager',
    tags: ['weekly', 'inventory', 'stock'],
    data: {
      lowStockItems: 12,
      totalItems: 156,
      wastePercentage: 3.2,
      costSavings: 2400
    }
  },
  {
    id: '4',
    title: 'Financial Performance Review 2024',
    description: 'Annual financial performance analysis and budget comparison',
    template: 'financial',
    status: 'scheduled',
    createdAt: '2024-12-20',
    updatedAt: '2024-12-28',
    author: 'Finance Team',
    tags: ['annual', 'financial', 'budget'],
    data: {
      totalRevenue: 1450000,
      totalExpenses: 1120000,
      profitMargin: 22.8,
      roi: 18.5
    }
  },
  {
    id: '5',
    title: 'Operational Efficiency Report - December',
    description: 'Monthly operational performance and efficiency metrics',
    template: 'performance',
    status: 'published',
    createdAt: '2024-12-15',
    updatedAt: '2024-12-29',
    author: 'Operations Manager',
    tags: ['monthly', 'operations', 'efficiency'],
    data: {
      avgServiceTime: 12.5,
      orderAccuracy: 96.8,
      efficiencyScore: 88,
      peakHours: ['12:00-14:00', '18:00-21:00']
    }
  }
];

export default function SimpleReportManagement() {
  const t = useTranslations('reports');
  const tCommon = useTranslations('common');
  
  const [reports, setReports] = useState<Report[]>(sampleReports);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterTemplate, setFilterTemplate] = useState<string>('all');
  const [showCreateTemplates, setShowCreateTemplates] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showReportPreview, setShowReportPreview] = useState(false);

  // Filter reports based on search and filters
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    const matchesTemplate = filterTemplate === 'all' || report.template === filterTemplate;
    
    return matchesSearch && matchesStatus && matchesTemplate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return <CheckCircle className="h-4 w-4" />;
      case 'draft': return <Edit className="h-4 w-4" />;
      case 'scheduled': return <Clock className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getTemplateInfo = (templateId: string) => {
    return reportTemplates.find(t => t.id === templateId);
  };

  const handleCreateReport = (templateId: string) => {
    const template = reportTemplates.find(t => t.id === templateId);
    if (!template) return;

    const newReport: Report = {
      id: Date.now().toString(),
      title: `New ${template.name}`,
      description: `Generated ${template.name.toLowerCase()} for analysis`,
      template: templateId as any,
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      author: 'Current User',
      tags: [templateId, 'new'],
      data: {}
    };

    setReports([newReport, ...reports]);
    setShowCreateTemplates(false);
  };

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setShowReportPreview(true);
  };

  const handleDeleteReport = (reportId: string) => {
    setReports(reports.filter(r => r.id !== reportId));
  };

  const renderReportPreview = (report: Report) => {
    const template = getTemplateInfo(report.template);
    if (!template || !report.data) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{report.title}</h2>
            <p className="text-gray-600 mt-1">{report.description}</p>
          </div>
          <Badge className={`${getStatusColor(report.status)} flex items-center gap-1`}>
            {getStatusIcon(report.status)}
            <span className="capitalize">{report.status}</span>
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(report.data).map(([key, value]) => (
            <div key={key} className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-600 capitalize mb-1">
                {key.replace(/([A-Z])/g, ' $1')}
              </p>
              <p className="text-xl font-bold text-gray-900">
                {typeof value === 'number' ? value.toLocaleString() : 
                 Array.isArray(value) ? value.join(', ') : value}
              </p>
            </div>
          ))}
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Available Charts & Analytics</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {template.charts.map((chart, index) => (
              <div key={index} className="bg-white p-3 rounded border flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">{chart}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Report Details</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Created</p>
              <p className="font-medium">{new Date(report.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-gray-600">Updated</p>
              <p className="font-medium">{new Date(report.updatedAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-gray-600">Author</p>
              <p className="font-medium">{report.author}</p>
            </div>
            <div>
              <p className="text-gray-600">Template</p>
              <p className="font-medium capitalize">{report.template}</p>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-gray-600 text-sm mb-2">Tags</p>
            <div className="flex flex-wrap gap-2">
              {report.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={() => setShowReportPreview(false)}>
            Back to Reports
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline">
            <Share className="h-4 w-4 mr-2" />
            Share Report
          </Button>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Report
          </Button>
        </div>
      </div>
    );
  };

  if (showReportPreview && selectedReport) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto space-y-6">
          {renderReportPreview(selectedReport)}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Report Management System</h1>
                <p className="text-gray-600">Create, manage, and analyze comprehensive business reports with 5 different templates</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={() => setShowCreateTemplates(!showCreateTemplates)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Report
              </Button>
            </div>
          </div>
        </div>

        {/* Create Report Templates */}
        {showCreateTemplates && (
          <Card>
            <CardHeader>
              <CardTitle>Choose Report Template</CardTitle>
              <CardDescription>Select a template to create your new report</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reportTemplates.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-200"
                        onClick={() => handleCreateReport(template.id)}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`p-3 rounded-lg ${template.color} text-white`}>
                          {template.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <CardDescription className="text-sm">{template.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Key Metrics:</p>
                          <div className="flex flex-wrap gap-1">
                            {template.fields.slice(0, 3).map((field, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {field}
                              </Badge>
                            ))}
                            {template.fields.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{template.fields.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Charts Included:</p>
                          <div className="flex flex-wrap gap-1">
                            {template.charts.slice(0, 2).map((chart, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                <BarChart3 className="h-3 w-3 mr-1" />
                                {chart}
                              </Badge>
                            ))}
                            {template.charts.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{template.charts.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <Button variant="outline" onClick={() => setShowCreateTemplates(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Reports Overview ({filteredReports.length} reports)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search reports by title, description, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterTemplate} onValueChange={setFilterTemplate}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Templates</SelectItem>
                  {reportTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map((report) => {
                const template = getTemplateInfo(report.template);
                return (
                  <Card key={report.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          {template && (
                            <div className={`p-2 rounded-lg ${template.color} text-white`}>
                              {template.icon}
                            </div>
                          )}
                          <div className="flex-1">
                            <CardTitle className="text-base line-clamp-1">{report.title}</CardTitle>
                            <CardDescription className="text-sm line-clamp-2">
                              {report.description}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(report.status)} flex items-center gap-1`}>
                          {getStatusIcon(report.status)}
                          <span className="capitalize text-xs">{report.status}</span>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-1">
                          {report.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="text-xs text-gray-500 space-y-1">
                          <p>Created: {new Date(report.createdAt).toLocaleDateString()}</p>
                          <p>Updated: {new Date(report.updatedAt).toLocaleDateString()}</p>
                          <p>Author: {report.author}</p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewReport(report)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Preview
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Share className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteReport(report.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredReports.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || filterStatus !== 'all' || filterTemplate !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Create your first report to get started'}
                </p>
                <Button onClick={() => setShowCreateTemplates(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Report
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}