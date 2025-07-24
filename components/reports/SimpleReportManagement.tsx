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
  Activity,
  X,
  LineChart,
  Package,
  Wallet,
  Target,
  Zap,
  Star,
  Filter,
  SortDesc,
  Grid3X3,
  List,
  Settings,
  BookOpen,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Database,
  ChartBar,
  Layers,
  Globe,
  Shield,
  Award,
  Briefcase,
  Calculator,
  CreditCard,
  ShoppingCart,
  Truck,
  Factory,
  Store,
  MessageCircle,
  Bot,
  Send,
  Minimize2,
  Maximize2
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
    icon: <div className="relative">
      <DollarSign className="h-6 w-6" />
      <TrendingUp className="h-3 w-3 absolute -top-1 -right-1 bg-white rounded-full p-0.5" />
    </div>,
    color: 'bg-gradient-to-br from-green-500 to-emerald-600',
    fields: ['Revenue', 'Orders', 'Average Order Value', 'Top Products', 'Sales Trends'],
    charts: ['Revenue Chart', 'Product Performance', 'Sales by Time']
  },
  {
    id: 'customer',
    name: 'Customer Insights Report',
    description: 'Customer behavior analysis, demographics, and satisfaction metrics',
    icon: <div className="relative">
      <Users className="h-6 w-6" />
      <Star className="h-3 w-3 absolute -top-1 -right-1 bg-white rounded-full p-0.5" />
    </div>,
    color: 'bg-gradient-to-br from-blue-500 to-cyan-600',
    fields: ['Customer Count', 'Demographics', 'Satisfaction Score', 'Retention Rate', 'Feedback'],
    charts: ['Customer Growth', 'Demographics Chart', 'Satisfaction Trends']
  },
  {
    id: 'inventory',
    name: 'Inventory Management Report',
    description: 'Stock levels, product movement, and inventory optimization insights',
    icon: <div className="relative">
      <Package className="h-6 w-6" />
      <BarChart3 className="h-3 w-3 absolute -top-1 -right-1 bg-white rounded-full p-0.5" />
    </div>,
    color: 'bg-gradient-to-br from-orange-500 to-amber-600',
    fields: ['Stock Levels', 'Product Movement', 'Low Stock Alerts', 'Waste Analysis', 'Cost Analysis'],
    charts: ['Stock Level Chart', 'Movement Trends', 'Cost Analysis']
  },
  {
    id: 'financial',
    name: 'Financial Performance Report',
    description: 'Profit & loss analysis, expense tracking, and financial health metrics',
    icon: <div className="relative">
      <Wallet className="h-6 w-6" />
      <Calculator className="h-3 w-3 absolute -top-1 -right-1 bg-white rounded-full p-0.5" />
    </div>,
    color: 'bg-gradient-to-br from-purple-500 to-violet-600',
    fields: ['Revenue', 'Expenses', 'Profit Margin', 'Cash Flow', 'ROI Analysis'],
    charts: ['P&L Chart', 'Expense Breakdown', 'Cash Flow Trends']
  },
  {
    id: 'performance',
    name: 'Operational Performance Report',
    description: 'Service quality, efficiency metrics, and operational KPIs',
    icon: <div className="relative">
      <Target className="h-6 w-6" />
      <Zap className="h-3 w-3 absolute -top-1 -right-1 bg-white rounded-full p-0.5" />
    </div>,
    color: 'bg-gradient-to-br from-red-500 to-pink-600',
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
  const [showChatbot, setShowChatbot] = useState(false);

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
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl shadow-2xl p-8 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4">
              <BarChart3 className="h-16 w-16 text-white/20" />
            </div>
            <div className="absolute top-8 right-8">
              <PieChart className="h-12 w-12 text-white/20" />
            </div>
            <div className="absolute bottom-4 left-1/3">
              <TrendingUp className="h-8 w-8 text-white/20" />
            </div>
            <div className="absolute bottom-8 right-1/4">
              <Activity className="h-10 w-10 text-white/20" />
            </div>
          </div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                <div className="relative">
                  <FileText className="h-10 w-10 text-white" />
                  <div className="absolute -top-1 -right-1 bg-green-400 rounded-full p-1">
                    <Database className="h-3 w-3 text-white" />
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold">Report Management System</h1>
                  <Badge className="bg-green-500/20 text-green-100 border-green-400/30">
                    <Shield className="h-3 w-3 mr-1" />
                    Enterprise
                  </Badge>
                </div>
                <p className="text-blue-100 text-lg mb-3">Create, manage, and analyze comprehensive business reports with 5 different templates</p>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <Zap className="h-4 w-4 text-green-300" />
                    <span className="text-sm text-blue-100">System Active</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Database className="h-4 w-4 text-blue-200" />
                    <span className="text-sm text-blue-100">{reports.length} Total Reports</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-yellow-300" />
                    <span className="text-sm text-blue-100">5 Templates</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                <Settings className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button 
                onClick={() => setShowCreateTemplates(!showCreateTemplates)}
                data-testid="create-report-btn"
                className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg border-2 border-white/30"
              >
                <Plus className="h-4 w-4 mr-2" />
                <Briefcase className="h-4 w-4 mr-2" />
                Create Report
              </Button>
            </div>
          </div>
        </div>

        {/* Create Report Templates */}
        {showCreateTemplates && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Choose Report Template</h3>
                  <p className="text-gray-600 mt-1">Select a template to create your new report with pre-configured analytics</p>
                </div>
                <Button variant="outline" onClick={() => setShowCreateTemplates(false)} className="hover:bg-red-50 hover:border-red-200 hover:text-red-600">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reportTemplates.map((template, index) => (
                  <div 
                    key={template.id} 
                    className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    onClick={() => handleCreateReport(template.id)}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="bg-white rounded-xl border-2 border-gray-200 hover:border-blue-300 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                      {/* Template Header */}
                      <div className="relative p-6 pb-4">
                        <div className="flex items-start space-x-4">
                          <div className={`p-4 rounded-xl ${template.color} text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                            {template.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                              {template.name}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {template.description}
                            </p>
                          </div>
                        </div>
                        
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                      </div>

                      {/* Template Content */}
                      <div className="px-6 pb-6 space-y-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-3">
                            <TrendingUp className="h-4 w-4 text-blue-500" />
                            <p className="text-sm font-semibold text-gray-700">Key Metrics</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {template.fields.slice(0, 3).map((field, index) => (
                              <Badge key={index} variant="secondary" className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
                                {field}
                              </Badge>
                            ))}
                            {template.fields.length > 3 && (
                              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                                +{template.fields.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center space-x-2 mb-3">
                            <BarChart3 className="h-4 w-4 text-green-500" />
                            <p className="text-sm font-semibold text-gray-700">Charts & Analytics</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {template.charts.slice(0, 2).map((chart, index) => (
                              <Badge key={index} variant="outline" className="text-xs border-green-200 text-green-700 hover:bg-green-50 transition-colors">
                                <Activity className="h-3 w-3 mr-1" />
                                {chart}
                              </Badge>
                            ))}
                            {template.charts.length > 2 && (
                              <Badge variant="outline" className="text-xs border-gray-200 text-gray-600">
                                +{template.charts.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Create Button */}
                        <div className="pt-2 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Click to create</span>
                            <div className="flex items-center space-x-1 text-blue-600 group-hover:text-blue-700 transition-colors">
                              <Plus className="h-4 w-4" />
                              <span className="text-sm font-medium">Create Report</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Reports Overview</h3>
                  <p className="text-sm text-gray-600">
                    {filteredReports.length} of {reports.length} reports • 
                    {reports.filter(r => r.status === 'published').length} published • 
                    {reports.filter(r => r.status === 'draft').length} drafts • 
                    {reports.filter(r => r.status === 'scheduled').length} scheduled
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Activity className="h-4 w-4 text-green-500" />
                  <span>Live Updates</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search reports by title, description, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="relative">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40 h-12 border-gray-300 focus:border-blue-500 rounded-lg shadow-sm">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-gray-400" />
                        <SelectValue placeholder="Status" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <span>All Status</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="published">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Published</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="draft">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span>Draft</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="scheduled">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Scheduled</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="relative">
                  <Select value={filterTemplate} onValueChange={setFilterTemplate}>
                    <SelectTrigger className="w-52 h-12 border-gray-300 focus:border-blue-500 rounded-lg shadow-sm">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <SelectValue placeholder="Template" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span>All Templates</span>
                        </div>
                      </SelectItem>
                      {reportTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          <div className="flex items-center space-x-2">
                            <div className={`p-1 rounded ${template.color.replace('bg-gradient-to-br from-', 'bg-').replace(' to-', '').split('-')[0] + '-500'}`}>
                              <div className="w-3 h-3 text-white">
                                {template.icon}
                              </div>
                            </div>
                            <span>{template.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map((report, index) => {
                const template = getTemplateInfo(report.template);
                return (
                  <div 
                    key={report.id} 
                    className="group bg-white rounded-xl border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Report Header */}
                    <div className="p-6 pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          {template && (
                            <div className={`p-3 rounded-xl ${template.color} text-white shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                              {template.icon}
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1">
                              {report.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {report.description}
                            </p>
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(report.status)} flex items-center gap-1 shadow-sm`}>
                          {getStatusIcon(report.status)}
                          <span className="capitalize text-xs font-medium">{report.status}</span>
                        </Badge>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {report.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-gray-50 hover:bg-blue-50 hover:border-blue-200 transition-colors">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Report Details */}
                    <div className="px-6 pb-4">
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-3 w-3 text-blue-500" />
                            <div>
                              <p className="text-gray-500">Created</p>
                              <p className="font-medium text-gray-900">{new Date(report.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RefreshCw className="h-3 w-3 text-green-500" />
                            <div>
                              <p className="text-gray-500">Updated</p>
                              <p className="font-medium text-gray-900">{new Date(report.updatedAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 pt-2 border-t border-gray-200">
                          <Users className="h-3 w-3 text-purple-500" />
                          <div>
                            <p className="text-gray-500 text-xs">Author</p>
                            <p className="font-medium text-gray-900 text-xs">{report.author}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="px-6 pb-6">
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewReport(report)}
                            className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                          <Button variant="outline" size="sm" className="hover:bg-green-50 hover:border-green-200 hover:text-green-600 transition-colors">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-600 transition-colors">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:bg-green-50 hover:text-green-600 transition-colors">
                            <Share className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteReport(report.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredReports.length === 0 && (
              <div className="text-center py-16">
                <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <FileText className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">No reports found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchTerm || filterStatus !== 'all' || filterTemplate !== 'all'
                    ? 'Try adjusting your search filters or create a new report with different criteria'
                    : 'Get started by creating your first comprehensive business report'}
                </p>
                <div className="flex items-center justify-center space-x-3">
                  {(searchTerm || filterStatus !== 'all' || filterTemplate !== 'all') && (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchTerm('');
                        setFilterStatus('all');
                        setFilterTemplate('all');
                      }}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Clear Filters
                    </Button>
                  )}
                  <Button onClick={() => setShowCreateTemplates(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Report
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chatbot Toggle Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setShowChatbot(!showChatbot)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full w-14 h-14 shadow-2xl border-2 border-white/20 backdrop-blur-sm transform hover:scale-110 transition-all duration-300"
            size="lg"
          >
            {showChatbot ? (
              <X className="h-6 w-6" />
            ) : (
              <div className="relative">
                <Bot className="h-6 w-6" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            )}
          </Button>
        </div>

        {/* Chatbot Window */}
        {showChatbot && (
          <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-xl shadow-2xl border border-gray-200 z-40 overflow-hidden animate-in slide-in-from-bottom-4">
            {/* Chatbot Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 rounded-full p-2">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold">BiteBase AI Assistant</h3>
                  <p className="text-xs text-blue-100">Online • Ready to help with reports</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowChatbot(false)}
                className="text-white hover:bg-white/20"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 space-y-4 h-80 overflow-y-auto bg-gray-50">
              {/* Welcome Message */}
              <div className="flex justify-start">
                <div className="max-w-xs px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-800">
                  <div className="flex items-center space-x-2 mb-1">
                    <Bot className="h-3 w-3 text-blue-600" />
                    <span className="text-xs font-medium text-blue-600">BiteBase AI</span>
                  </div>
                  <p className="text-sm">👋 Hello! I'm your BiteBase AI assistant. I can help you with:</p>
                  <ul className="text-xs mt-2 space-y-1 text-gray-600">
                    <li>• Creating and managing reports</li>
                    <li>• Analyzing business data</li>
                    <li>• Understanding report templates</li>
                    <li>• Exporting and sharing reports</li>
                  </ul>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    // Scroll to create report button
                    document.querySelector('[data-testid="create-report-btn"]')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-xs bg-blue-100 hover:bg-blue-200 px-3 py-2 rounded-full text-blue-700 transition-colors"
                >
                  📊 Create New Report
                </button>
                <button
                  onClick={() => {
                    // Show template info
                    alert('We have 5 templates: Sales Analytics, Customer Insights, Inventory Management, Financial Performance, and Operational Performance.');
                  }}
                  className="text-xs bg-purple-100 hover:bg-purple-200 px-3 py-2 rounded-full text-purple-700 transition-colors"
                >
                  📋 View Templates
                </button>
                <button
                  onClick={() => {
                    // Show export info
                    alert('You can export any report to PDF by clicking the Export button on each report card.');
                  }}
                  className="text-xs bg-green-100 hover:bg-green-200 px-3 py-2 rounded-full text-green-700 transition-colors"
                >
                  📤 Export Help
                </button>
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Ask me about reports, analytics, or business insights..."
                  className="flex-1 border-gray-300 focus:border-blue-500"
                />
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-xs text-gray-500 mt-2 text-center">
                Powered by BiteBase AI • Enterprise Intelligence Platform
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}