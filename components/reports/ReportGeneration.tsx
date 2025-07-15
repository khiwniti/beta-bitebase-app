"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  FileText,
  Download,
  Mail,
  Calendar,
  Filter,
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Package,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Trash2,
  RefreshCw,
  FileSpreadsheet,
  FileText as FilePdf
} from 'lucide-react';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: string;
  estimatedTime: string;
  features: string[];
}

interface GeneratedReport {
  id: string;
  name: string;
  type: string;
  generatedOn: string;
  size: string;
  status: 'generating' | 'completed' | 'failed' | 'scheduled';
  downloadUrl?: string;
}

interface ReportFilters {
  dateRange: {
    from: string;
    to: string;
    preset: string;
  };
  location: string;
  category: string;
  paymentMethod: string;
  includeCharts: boolean;
  includeDetails: boolean;
  includeSummary: boolean;
}

const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: 'sales',
    name: 'Sales Report',
    description: 'Comprehensive sales analysis with trends and insights',
    icon: DollarSign,
    category: 'Financial',
    estimatedTime: '2-3 minutes',
    features: ['Revenue Analysis', 'Sales Trends', 'Payment Methods', 'Peak Hours']
  },
  {
    id: 'customer',
    name: 'Customer Report',
    description: 'Customer behavior and demographics analysis',
    icon: Users,
    category: 'Customer',
    estimatedTime: '3-4 minutes',
    features: ['Customer Growth', 'Demographics', 'Loyalty Analysis', 'Feedback']
  },
  {
    id: 'inventory',
    name: 'Inventory Report',
    description: 'Stock levels, usage patterns, and optimization',
    icon: Package,
    category: 'Operations',
    estimatedTime: '2-3 minutes',
    features: ['Stock Levels', 'Usage Patterns', 'Waste Analysis', 'Reorder Points']
  },
  {
    id: 'performance',
    name: 'Performance Report',
    description: 'Overall business performance metrics and KPIs',
    icon: BarChart3,
    category: 'Analytics',
    estimatedTime: '4-5 minutes',
    features: ['KPI Dashboard', 'Growth Metrics', 'Efficiency Analysis', 'Benchmarking']
  },
  {
    id: 'market-analysis',
    name: 'Market Analysis Report',
    description: 'Market trends and competitive analysis',
    icon: TrendingUp,
    category: 'Market',
    estimatedTime: '5-6 minutes',
    features: ['Market Trends', 'Competitor Analysis', 'Opportunities', 'Threats']
  },
  {
    id: 'competitor',
    name: 'Competitor Report',
    description: 'Detailed competitor analysis and positioning',
    icon: Star,
    category: 'Market',
    estimatedTime: '3-4 minutes',
    features: ['Competitor Pricing', 'Market Share', 'SWOT Analysis', 'Positioning']
  }
];

const DATE_PRESETS = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'lastWeek', label: 'Last Week' },
  { value: 'lastMonth', label: 'Last Month' },
  { value: 'lastQuarter', label: 'Last Quarter' },
  { value: 'lastYear', label: 'Last Year' },
  { value: 'custom', label: 'Custom Range' }
];

export default function ReportGeneration() {
  const t = useTranslations('reports');
  const tCommon = useTranslations('common');
  
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  
  const [filters, setFilters] = useState<ReportFilters>({
    dateRange: {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      to: new Date().toISOString().split('T')[0],
      preset: 'lastMonth'
    },
    location: 'all',
    category: 'all',
    paymentMethod: 'all',
    includeCharts: true,
    includeDetails: true,
    includeSummary: true
  });

  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([
    {
      id: '1',
      name: 'Sales Report - January 2025',
      type: 'sales',
      generatedOn: '2025-01-15T10:30:00Z',
      size: '2.4 MB',
      status: 'completed',
      downloadUrl: '/reports/sales-jan-2025.pdf'
    },
    {
      id: '2',
      name: 'Customer Analysis - Q4 2024',
      type: 'customer',
      generatedOn: '2025-01-10T14:15:00Z',
      size: '1.8 MB',
      status: 'completed',
      downloadUrl: '/reports/customer-q4-2024.pdf'
    },
    {
      id: '3',
      name: 'Performance Report - December 2024',
      type: 'performance',
      generatedOn: '2025-01-08T09:45:00Z',
      size: '3.1 MB',
      status: 'completed',
      downloadUrl: '/reports/performance-dec-2024.pdf'
    }
  ]);

  const handleFilterChange = (key: string, value: any) => {
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      setFilters(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof ReportFilters] as object || {}),
          [child]: value
        }
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [key]: value
      }));
    }
  };

  const handleDatePresetChange = (preset: string) => {
    const now = new Date();
    let from = new Date();
    let to = new Date();

    switch (preset) {
      case 'today':
        from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        to = now;
        break;
      case 'yesterday':
        from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        to = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59);
        break;
      case 'lastWeek':
        from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'lastMonth':
        from = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case 'lastQuarter':
        from = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'lastYear':
        from = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      default:
        return;
    }

    setFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        preset,
        from: from.toISOString().split('T')[0],
        to: to.toISOString().split('T')[0]
      }
    }));
  };

  const handleGenerateReport = async () => {
    if (!selectedTemplate) return;

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Simulate report generation with progress
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      clearInterval(progressInterval);
      setGenerationProgress(100);

      // Add new report to the list
      const template = REPORT_TEMPLATES.find(t => t.id === selectedTemplate);
      const newReport: GeneratedReport = {
        id: Date.now().toString(),
        name: `${template?.name} - ${new Date().toLocaleDateString()}`,
        type: selectedTemplate,
        generatedOn: new Date().toISOString(),
        size: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
        status: 'completed',
        downloadUrl: `/reports/${selectedTemplate}-${Date.now()}.pdf`
      };

      setGeneratedReports(prev => [newReport, ...prev]);
      setSelectedTemplate('');
      
      setTimeout(() => {
        setGenerationProgress(0);
      }, 2000);
    } catch (error) {
      console.error('Report generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteReport = (reportId: string) => {
    setGeneratedReports(prev => prev.filter(report => report.id !== reportId));
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'generating': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
      case 'failed': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      case 'scheduled': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
            <FileText className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('description')}
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Generate Report
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {t('reportHistory')}
          </TabsTrigger>
        </TabsList>

        {/* Generate Report Tab */}
        <TabsContent value="generate">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Report Templates */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t('reportTypes')}</CardTitle>
                  <CardDescription>
                    Choose a report template to get started
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {REPORT_TEMPLATES.map((template) => (
                      <Card 
                        key={template.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedTemplate === template.id 
                            ? 'border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-900/20' 
                            : 'hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${
                              selectedTemplate === template.id
                                ? 'bg-primary-100 text-primary-600 dark:bg-primary-800 dark:text-primary-200'
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                            }`}>
                              <template.icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-sm mb-1">{template.name}</h3>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                {template.description}
                              </p>
                              <div className="flex items-center justify-between">
                                <Badge variant="outline" className="text-xs">
                                  {template.category}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {template.estimatedTime}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Generation */}
            <div className="space-y-6">
              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    {t('filters')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Date Range */}
                  <div className="space-y-2">
                    <Label>{t('dateRange')}</Label>
                    <Select
                      value={filters.dateRange.preset}
                      onValueChange={handleDatePresetChange}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DATE_PRESETS.map((preset) => (
                          <SelectItem key={preset.value} value={preset.value}>
                            {t(preset.label.toLowerCase().replace(' ', ''))}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {filters.dateRange.preset === 'custom' && (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">{t('from')}</Label>
                        <Input
                          type="date"
                          value={filters.dateRange.from}
                          onChange={(e) => handleFilterChange('dateRange.from', e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">{t('to')}</Label>
                        <Input
                          type="date"
                          value={filters.dateRange.to}
                          onChange={(e) => handleFilterChange('dateRange.to', e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Location Filter */}
                  <div className="space-y-2">
                    <Label>{t('location')}</Label>
                    <Select
                      value={filters.location}
                      onValueChange={(value) => handleFilterChange('location', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="main">Main Branch</SelectItem>
                        <SelectItem value="branch1">Branch 1</SelectItem>
                        <SelectItem value="branch2">Branch 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Category Filter */}
                  <div className="space-y-2">
                    <Label>{t('category')}</Label>
                    <Select
                      value={filters.category}
                      onValueChange={(value) => handleFilterChange('category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="food">Food</SelectItem>
                        <SelectItem value="beverages">Beverages</SelectItem>
                        <SelectItem value="desserts">Desserts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Report Options */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Report Options</Label>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includeCharts"
                        checked={filters.includeCharts}
                        onCheckedChange={(checked) => handleFilterChange('includeCharts', checked)}
                      />
                      <Label htmlFor="includeCharts" className="text-sm">
                        {t('includeCharts')}
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includeDetails"
                        checked={filters.includeDetails}
                        onCheckedChange={(checked) => handleFilterChange('includeDetails', checked)}
                      />
                      <Label htmlFor="includeDetails" className="text-sm">
                        {t('includeDetails')}
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includeSummary"
                        checked={filters.includeSummary}
                        onCheckedChange={(checked) => handleFilterChange('includeSummary', checked)}
                      />
                      <Label htmlFor="includeSummary" className="text-sm">
                        {t('includeSummary')}
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Generation */}
              <Card>
                <CardHeader>
                  <CardTitle>Generate Report</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedTemplate && (
                    <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        {React.createElement(
                          REPORT_TEMPLATES.find(t => t.id === selectedTemplate)?.icon || FileText,
                          { className: "h-4 w-4 text-primary-600 dark:text-primary-400" }
                        )}
                        <span className="text-sm font-medium">
                          {REPORT_TEMPLATES.find(t => t.id === selectedTemplate)?.name}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {REPORT_TEMPLATES.find(t => t.id === selectedTemplate)?.description}
                      </p>
                    </div>
                  )}

                  {isGenerating && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Generating report...</span>
                        <span>{Math.round(generationProgress)}%</span>
                      </div>
                      <Progress value={generationProgress} className="h-2" />
                    </div>
                  )}

                  <Button
                    className="w-full"
                    onClick={handleGenerateReport}
                    disabled={!selectedTemplate || isGenerating}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    {isGenerating ? t('generating') : t('generateReport')}
                  </Button>

                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" disabled={!selectedTemplate}>
                      <Mail className="h-4 w-4 mr-2" />
                      {t('emailReport')}
                    </Button>
                    <Button variant="outline" size="sm" disabled={!selectedTemplate}>
                      <Calendar className="h-4 w-4 mr-2" />
                      {t('scheduleReport')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Report History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>{t('reportHistory')}</CardTitle>
              <CardDescription>
                View and manage your previously generated reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {generatedReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-medium">{report.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>{t('generatedOn')}: {formatDate(report.generatedOn)}</span>
                          <span>{t('reportSize')}: {report.size}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(report.status)}>
                        {report.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {report.status === 'generating' && <RefreshCw className="h-3 w-3 mr-1 animate-spin" />}
                        {report.status === 'failed' && <AlertCircle className="h-3 w-3 mr-1" />}
                        {t(report.status)}
                      </Badge>
                      
                      {report.status === 'completed' && (
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            {t('view')}
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            {t('download')}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteReport(report.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}