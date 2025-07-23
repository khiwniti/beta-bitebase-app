'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MainLayout } from '../../../../components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { 
  ArrowLeft,
  Download,
  Share2,
  Edit3,
  MoreHorizontal,
  Calendar,
  Clock,
  FileText,
  BarChart3,
  Users,
  TrendingUp,
  Target,
  Compass,
  Activity,
  RefreshCw
} from 'lucide-react';
import { apiClient } from '../../../../lib/api-client';

interface Report {
  id: string;
  type: string;
  title: string;
  generatedAt: string;
  data: any;
}

export default function ReportViewPage() {
  const params = useParams();
  const reportId = params.id as string;
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (reportId) {
      fetchReport();
    }
  }, [reportId]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getReport(reportId);
      if (response.data?.success) {
        setReport(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching report:', error);
      // Mock data for demo
      setReport({
        id: reportId,
        type: 'sales',
        title: 'Sales Performance Report - Q4 2024',
        generatedAt: new Date().toISOString(),
        data: {
          summary: {
            totalRevenue: 125000,
            totalOrders: 1250,
            averageOrderValue: 100,
            growthRate: 15.5
          },
          insights: [
            'Peak sales occur between 12:00-14:00 and 18:00-20:00',
            'Digital payments increased by 25% this month',
            'Pad Thai remains the top-selling item with consistent growth'
          ]
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async () => {
    try {
      const response = await fetch(`${apiClient.defaults.baseURL}/api/reports/${reportId}/download`);
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

  const getReportIcon = (type: string) => {
    const icons = {
      sales: <BarChart3 className="w-5 h-5" />,
      customer: <Users className="w-5 h-5" />,
      performance: <Activity className="w-5 h-5" />,
      market: <TrendingUp className="w-5 h-5" />,
      competitor: <Target className="w-5 h-5" />,
      discovery: <Compass className="w-5 h-5" />
    };
    return icons[type] || <FileText className="w-5 h-5" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Loading report...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!report) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Report not found</h2>
            <p className="text-gray-600 mb-6">The report you're looking for doesn't exist or has been deleted.</p>
            <Button onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between mb-4">
              <Button 
                variant="ghost" 
                onClick={() => window.history.back()}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Reports
              </Button>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={downloadReport}>
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                {getReportIcon(report.type)}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{report.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Generated {formatDate(report.generatedAt)}
                  </span>
                  <Badge variant="secondary" className="capitalize">
                    {report.type} Report
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="prose prose-gray max-w-none">
            {/* Executive Summary */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl">📋 Executive Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {report.type === 'sales' && report.data?.summary && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        ${report.data.summary.totalRevenue?.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Total Revenue</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {report.data.summary.totalOrders?.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Total Orders</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        ${report.data.summary.averageOrderValue}
                      </div>
                      <div className="text-sm text-gray-600">Avg Order Value</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {report.data.summary.growthRate}%
                      </div>
                      <div className="text-sm text-gray-600">Growth Rate</div>
                    </div>
                  </div>
                )}
                
                {report.type === 'customer' && (
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      This customer analytics report provides comprehensive insights into customer behavior, 
                      demographics, and segmentation for your restaurant location.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-lg font-semibold text-blue-900">2,500</div>
                        <div className="text-sm text-blue-700">Total Customers</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-lg font-semibold text-green-900">350</div>
                        <div className="text-sm text-green-700">New Customers</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-lg font-semibold text-purple-900">86%</div>
                        <div className="text-sm text-purple-700">Retention Rate</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Key Insights */}
            {report.data?.insights && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-xl">💡 Key Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {report.data.insights.map((insight: string, index: number) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Detailed Analysis */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl">📊 Detailed Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Performance Metrics</h3>
                    <p className="text-gray-700 mb-4">
                      Based on the analysis of your restaurant's performance data, we've identified several key trends and opportunities for growth.
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <strong>Note:</strong> This is a demo report. In the full version, this section would contain detailed charts, graphs, and comprehensive analysis based on your actual data.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommendations</h3>
                    <div className="space-y-3">
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-medium text-gray-900">Optimize Peak Hours</h4>
                        <p className="text-gray-600 text-sm">Focus marketing efforts during identified peak hours to maximize revenue.</p>
                      </div>
                      <div className="border-l-4 border-green-500 pl-4">
                        <h4 className="font-medium text-gray-900">Expand Digital Presence</h4>
                        <p className="text-gray-600 text-sm">Leverage the growing trend in digital payments and online ordering.</p>
                      </div>
                      <div className="border-l-4 border-orange-500 pl-4">
                        <h4 className="font-medium text-gray-900">Menu Optimization</h4>
                        <p className="text-gray-600 text-sm">Promote top-performing items and consider seasonal menu adjustments.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="text-center py-8 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Report generated on {formatDate(report.generatedAt)} • BiteBase Analytics Platform
              </p>
              <div className="mt-4">
                <Button onClick={downloadReport} className="bg-blue-600 hover:bg-blue-700">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}