'use client';

import React, { useState, useEffect } from 'react';
// import { MainLayout } from '../layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter,
  Download,
  Eye,
  Trash2,
  Calendar,
  BarChart3,
  Users,
  TrendingUp,
  Target,
  Compass,
  Zap,
  RefreshCw,
  Clock,
  FileBarChart,
  PieChart,
  Activity,
  Edit3,
  Share2,
  Copy,
  MoreHorizontal
} from 'lucide-react';
import { apiClient } from '../../lib/api-client';

interface Report {
  id: string;
  type: string;
  title: string;
  generatedAt: string;
  fileSize: number;
  lastModified: string;
  data?: any;
}

interface ReportTemplate {
  type: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  estimatedTime: string;
  features: string[];
}

const reportTemplates: ReportTemplate[] = [
  {
    type: 'sales',
    title: 'Sales Report',
    description: 'Revenue analysis with trends and insights',
    icon: <BarChart3 className="w-5 h-5" />,
    color: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
    estimatedTime: '2-3 minutes',
    features: ['Revenue tracking', 'Sales trends', 'Product performance', 'Growth metrics']
  },
  {
    type: 'customer',
    title: 'Customer Analytics',
    description: 'Customer behavior and demographic insights',
    icon: <Users className="w-5 h-5" />,
    color: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100',
    estimatedTime: '3-5 minutes',
    features: ['Demographics', 'Behavior patterns', 'Segmentation', 'Lifetime value']
  },
  {
    type: 'performance',
    title: 'Performance Report',
    description: 'Operational metrics and KPIs',
    icon: <Activity className="w-5 h-5" />,
    color: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100',
    estimatedTime: '1-2 minutes',
    features: ['KPI tracking', 'Efficiency metrics', 'Quality scores', 'Benchmarking']
  },
  {
    type: 'market',
    title: 'Market Analysis',
    description: 'Market trends and competitive landscape',
    icon: <TrendingUp className="w-5 h-5" />,
    color: 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100',
    estimatedTime: '5-8 minutes',
    features: ['Market size', 'Growth trends', 'Opportunities', 'Competitive analysis']
  },
  {
    type: 'competitor',
    title: 'Competitor Intelligence',
    description: 'Competitive positioning and analysis',
    icon: <Target className="w-5 h-5" />,
    color: 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100',
    estimatedTime: '4-6 minutes',
    features: ['Competitor mapping', 'SWOT analysis', 'Pricing comparison', 'Market share']
  },
  {
    type: 'discovery',
    title: 'Market Discovery',
    description: 'Opportunities and strategic recommendations',
    icon: <Compass className="w-5 h-5" />,
    color: 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100',
    estimatedTime: '3-4 minutes',
    features: ['Opportunity mapping', 'Risk assessment', 'Strategic insights', 'Action plans']
  }
];

export default function NotionLikeReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showTemplates, setShowTemplates] = useState(false);
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getReports();
      if (response.data.success) {
        setReports(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      // Fallback to demo data
      setReports([
        {
          id: 'demo_sales_1',
          type: 'sales',
          title: 'Q4 Sales Performance Analysis',
          generatedAt: new Date().toISOString(),
          fileSize: 2400000,
          lastModified: new Date().toISOString()
        },
        {
          id: 'demo_customer_1',
          type: 'customer',
          title: 'Customer Demographics Study - Bangkok',
          generatedAt: new Date(Date.now() - 86400000).toISOString(),
          fileSize: 1800000,
          lastModified: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 'demo_market_1',
          type: 'market',
          title: 'Thai Restaurant Market Analysis 2024',
          generatedAt: new Date(Date.now() - 172800000).toISOString(),
          fileSize: 3200000,
          lastModified: new Date(Date.now() - 172800000).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (type: string) => {
    try {
      setGeneratingReport(type);
      
      const params = {
        sales: {
          dateRange: {
            start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            end: new Date().toISOString()
          },
          location: { lat: 13.7563, lng: 100.5018 },
          filters: {}
        },
        customer: {
          location: { lat: 13.7563, lng: 100.5018 },
          radius: 5000,
          analysisType: 'comprehensive'
        },
        performance: {
          dateRange: {
            start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            end: new Date().toISOString()
          },
          metrics: ['kpis', 'operational', 'financial']
        },
        market: {
          location: { lat: 13.7563, lng: 100.5018 },
          competitorAnalysis: true,
          marketSize: 'local'
        },
        competitor: {
          location: { lat: 13.7563, lng: 100.5018 },
          radius: 5000,
          analysisDepth: 'detailed'
        },
        discovery: {
          location: { lat: 13.7563, lng: 100.5018 },
          objectives: ['market_entry', 'growth_opportunities'],
          timeline: '6_months'
        }
      };

      const response = await apiClient.generateReport(type, params[type]);
      
      if (response.data.success) {
        await fetchReports();
        setShowTemplates(false);
      }
    } catch (error) {
      console.error('Error generating report:', error);
      // Create demo report
      const template = reportTemplates.find(t => t.type === type);
      const demoReport: Report = {
        id: `demo_${type}_${Date.now()}`,
        type,
        title: `${template?.title} - ${new Date().toLocaleDateString()}`,
        generatedAt: new Date().toISOString(),
        fileSize: Math.floor(Math.random() * 3000000) + 1000000,
        lastModified: new Date().toISOString()
      };
      setReports(prev => [demoReport, ...prev]);
      setShowTemplates(false);
    } finally {
      setGeneratingReport(null);
    }
  };

  const downloadReport = async (reportId: string) => {
    try {
      const response = await fetch(`http://localhost:56222/api/reports/${reportId}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reportId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('PDF download available in full version');
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('PDF download available in full version');
    }
  };

  const deleteReport = async (reportId: string) => {
    if (!confirm('Are you sure you want to delete this report?')) return;
    
    try {
      await apiClient.deleteReport(reportId);
      await fetchReports();
    } catch (error) {
      console.error('Error deleting report:', error);
      setReports(prev => prev.filter(r => r.id !== reportId));
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const getReportIcon = (type: string) => {
    const template = reportTemplates.find(t => t.type === type);
    return template?.icon || <FileText className="w-4 h-4" />;
  };

  const getReportColor = (type: string) => {
    const template = reportTemplates.find(t => t.type === type);
    return template?.color?.split(' ')[0] + ' ' + template?.color?.split(' ')[1] || 'bg-gray-50 border-gray-200';
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || report.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-white">
        {/* Notion-like Header */}
        <div className="border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 Reports</h1>
                <p className="text-gray-600">Key insights and performance analytics</p>
              </div>
              <Button 
                onClick={() => setShowTemplates(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Report
              </Button>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All types</option>
                {reportTemplates.map(template => (
                  <option key={template.type} value={template.type}>
                    {template.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Report Templates Modal */}
          {showTemplates && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-8 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Create New Report</h2>
                      <p className="mt-2 text-gray-600">Choose a template to get started</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      onClick={() => setShowTemplates(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </Button>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reportTemplates.map((template) => (
                      <Card 
                        key={template.type}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${template.color}`}
                        onClick={() => generateReport(template.type)}
                      >
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="p-3 rounded-lg bg-white bg-opacity-70">
                                {template.icon}
                              </div>
                              <div>
                                <CardTitle className="text-lg font-semibold">{template.title}</CardTitle>
                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {template.estimatedTime}
                                </div>
                              </div>
                            </div>
                            {generatingReport === template.type && (
                              <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                          <div className="space-y-2">
                            {template.features.map((feature, index) => (
                              <div key={index} className="flex items-center text-xs text-gray-500">
                                <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                                {feature}
                              </div>
                            ))}
                          </div>
                          {generatingReport === template.type && (
                            <div className="mt-4 flex items-center text-sm text-blue-600">
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              Generating report...
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reports List */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <RefreshCw className="w-6 h-6 animate-spin text-gray-400 mr-3" />
              <span className="text-gray-600">Loading reports...</span>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || selectedFilter !== 'all' ? 'No reports found' : 'No reports yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Create your first report to get started with analytics'
                }
              </p>
              {!searchTerm && selectedFilter === 'all' && (
                <Button onClick={() => setShowTemplates(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Report
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredReports.map((report) => (
                <Card key={report.id} className="hover:shadow-sm transition-all duration-200 border border-gray-100 hover:border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        <div className={`p-3 rounded-lg ${getReportColor(report.type)}`}>
                          {getReportIcon(report.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
                            {report.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{formatDate(report.generatedAt)}</span>
                            <span>•</span>
                            <span>{formatFileSize(report.fileSize)}</span>
                            <span>•</span>
                            <Badge variant="secondary" className="capitalize text-xs">
                              {report.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`/reports/view/${report.id}`, '_blank')}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadReport(report.id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteReport(report.id)}
                          className="text-gray-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
  );
}