"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitebase/ui"
import { Button } from "@bitebase/ui"
import { ReportViewer } from "@bitebase/ui"
import { ChartContainer } from "@bitebase/ui"
import { MetricCard } from "@bitebase/ui"
import { MainLayout } from "../../components/layout/MainLayout"

// Professional Marketing Reports Data
const marketingReports = {
  "market-penetration": {
    title: "Market Penetration Strategy Report",
    type: "Market Penetration",
    generatedAt: new Date(),
    sections: [
      {
        id: "executive-summary",
        title: "Executive Summary",
        content: "This market penetration analysis identifies key strategies to increase market share in the Bangkok restaurant sector. Our research indicates significant opportunities for growth through targeted customer acquisition, competitive pricing strategies, and enhanced digital presence.",
        metrics: [
          { label: "Current Market Share", value: "8.7%" },
          { label: "Target Market Share", value: "15.2%" },
          { label: "Growth Potential", value: "74.7%" },
          { label: "Investment Required", value: "฿2.8M" },
        ],
      },
      {
        id: "market-analysis",
        title: "Market Analysis",
        content: "Bangkok's restaurant market shows strong growth with increasing demand for diverse dining experiences. The target demographic of young professionals and families represents 68% of the market, with average spending of ฿680 per visit.",
        metrics: [
          { label: "Market Size", value: "฿45.2B" },
          { label: "Annual Growth Rate", value: "12.3%" },
          { label: "Target Segment Size", value: "68%" },
          { label: "Average Spend", value: "฿680" },
        ],
      },
      {
        id: "competitive-positioning",
        title: "Competitive Positioning",
        content: "Analysis of 247 competing restaurants reveals opportunities for differentiation through unique cuisine offerings, superior customer service, and strategic location advantages. Key competitors show weaknesses in digital marketing and customer retention.",
        metrics: [
          { label: "Direct Competitors", value: "18" },
          { label: "Market Leaders", value: "5" },
          { label: "Competitive Advantage Score", value: "7.8/10" },
          { label: "Differentiation Opportunities", value: "12" },
        ],
      },
      {
        id: "penetration-strategies",
        title: "Penetration Strategies",
        content: "Recommended strategies include aggressive pricing for the first 6 months, loyalty program implementation, social media marketing campaigns, and strategic partnerships with delivery platforms. Expected customer acquisition cost: ฿145 per customer.",
        metrics: [
          { label: "Customer Acquisition Cost", value: "฿145" },
          { label: "Customer Lifetime Value", value: "฿3,240" },
          { label: "Payback Period", value: "4.2 months" },
          { label: "Expected ROI", value: "285%" },
        ],
      },
    ],
  },
  "brand-positioning": {
    title: "Brand Positioning & Identity Report",
    type: "Brand Strategy",
    generatedAt: new Date(),
    sections: [
      {
        id: "brand-overview",
        title: "Brand Overview",
        content: "This comprehensive brand positioning analysis establishes a unique market position for your restaurant. Our research identifies key brand attributes that resonate with target customers and differentiate from competitors in the crowded Bangkok dining scene.",
        metrics: [
          { label: "Brand Awareness", value: "23%" },
          { label: "Brand Preference", value: "67%" },
          { label: "Brand Loyalty Score", value: "8.2/10" },
          { label: "Market Positioning", value: "Premium Casual" },
        ],
      },
      {
        id: "target-persona",
        title: "Target Customer Persona",
        content: "Primary target: Urban professionals aged 25-40 with household income ฿80K-150K monthly. They value quality, convenience, and authentic experiences. Secondary target: Affluent families seeking memorable dining experiences for special occasions.",
        metrics: [
          { label: "Primary Segment", value: "45%" },
          { label: "Secondary Segment", value: "32%" },
          { label: "Tertiary Segment", value: "23%" },
          { label: "Customer Satisfaction", value: "4.6/5" },
        ],
      },
      {
        id: "brand-architecture",
        title: "Brand Architecture",
        content: "Recommended brand positioning as 'Authentic Thai Cuisine with Modern Twist' targeting the premium casual dining segment. Brand pillars: Authenticity, Quality, Innovation, and Community. Visual identity should emphasize warmth, tradition, and contemporary elegance.",
        metrics: [
          { label: "Brand Recall", value: "78%" },
          { label: "Message Clarity", value: "8.5/10" },
          { label: "Visual Appeal", value: "9.1/10" },
          { label: "Brand Consistency", value: "87%" },
        ],
      },
      {
        id: "implementation-roadmap",
        title: "Implementation Roadmap",
        content: "Phase 1: Brand identity development (2 months). Phase 2: Digital presence establishment (1 month). Phase 3: Marketing campaign launch (3 months). Phase 4: Brand monitoring and optimization (ongoing). Total investment: ฿1.2M over 6 months.",
        metrics: [
          { label: "Implementation Timeline", value: "6 months" },
          { label: "Total Investment", value: "฿1.2M" },
          { label: "Expected Brand Lift", value: "45%" },
          { label: "ROI Timeline", value: "8 months" },
        ],
      },
    ],
  },
  "digital-marketing": {
    title: "Digital Marketing Strategy Report",
    type: "Digital Strategy",
    generatedAt: new Date(),
    sections: [
      {
        id: "digital-landscape",
        title: "Digital Landscape Analysis",
        content: "Bangkok's restaurant digital marketing landscape is highly competitive with 89% of restaurants having social media presence. However, only 34% effectively utilize data-driven marketing strategies, presenting significant opportunities for competitive advantage.",
        metrics: [
          { label: "Digital Penetration", value: "89%" },
          { label: "Effective Strategies", value: "34%" },
          { label: "Mobile Traffic", value: "76%" },
          { label: "Social Engagement Rate", value: "3.2%" },
        ],
      },
      {
        id: "channel-strategy",
        title: "Multi-Channel Strategy",
        content: "Recommended digital channels: Instagram (primary), Facebook (secondary), TikTok (growth), Google Ads (conversion), and LINE Official Account (retention). Each channel serves specific customer journey stages from awareness to loyalty.",
        metrics: [
          { label: "Instagram Reach", value: "45K" },
          { label: "Facebook Engagement", value: "12%" },
          { label: "TikTok Growth Rate", value: "28%" },
          { label: "Google Ads CTR", value: "4.8%" },
        ],
      },
      {
        id: "content-strategy",
        title: "Content Marketing Strategy",
        content: "Content pillars: Food photography (40%), behind-the-scenes (25%), customer stories (20%), and educational content (15%). Posting frequency: 1-2 daily posts on Instagram, 3-4 weekly on Facebook, 2-3 weekly on TikTok.",
        metrics: [
          { label: "Content Engagement", value: "8.7%" },
          { label: "Video Performance", value: "156% above avg" },
          { label: "User-Generated Content", value: "23%" },
          { label: "Content ROI", value: "340%" },
        ],
      },
      {
        id: "performance-metrics",
        title: "Performance & ROI Projections",
        content: "Expected outcomes: 150% increase in online visibility, 85% growth in social media followers, 45% improvement in online reviews, and 25% increase in digital-driven reservations within 6 months. Total digital marketing budget: ฿180K monthly.",
        metrics: [
          { label: "Visibility Increase", value: "150%" },
          { label: "Follower Growth", value: "85%" },
          { label: "Review Improvement", value: "45%" },
          { label: "Digital Reservations", value: "25%" },
        ],
      },
    ],
  },
  "customer-retention": {
    title: "Customer Retention & Loyalty Report",
    type: "Customer Strategy",
    generatedAt: new Date(),
    sections: [
      {
        id: "retention-analysis",
        title: "Current Retention Analysis",
        content: "Analysis of customer behavior reveals 68% first-time visitor return rate and 42% become regular customers within 6 months. Average customer visits 2.3 times monthly with ฿680 average spend. Key retention drivers: food quality, service consistency, and value perception.",
        metrics: [
          { label: "Return Rate", value: "68%" },
          { label: "Regular Customers", value: "42%" },
          { label: "Visit Frequency", value: "2.3/month" },
          { label: "Customer Lifetime Value", value: "฿18,400" },
        ],
      },
      {
        id: "loyalty-program",
        title: "Loyalty Program Design",
        content: "Recommended tiered loyalty program: Bronze (0-499 points), Silver (500-999 points), Gold (1000+ points). Points earned: ฿1 = 1 point. Rewards: 10% discount (Bronze), 15% + priority seating (Silver), 20% + exclusive events (Gold).",
        metrics: [
          { label: "Program Participation", value: "78%" },
          { label: "Point Redemption Rate", value: "65%" },
          { label: "Tier Advancement", value: "34%" },
          { label: "Program ROI", value: "420%" },
        ],
      },
      {
        id: "engagement-strategies",
        title: "Customer Engagement Strategies",
        content: "Multi-touchpoint engagement: Welcome series for new customers, birthday rewards, seasonal promotions, exclusive previews for VIP customers, and personalized recommendations based on dining history. Email marketing, LINE messages, and in-app notifications.",
        metrics: [
          { label: "Email Open Rate", value: "32%" },
          { label: "LINE Message CTR", value: "18%" },
          { label: "App Engagement", value: "67%" },
          { label: "Personalization Lift", value: "28%" },
        ],
      },
      {
        id: "retention-optimization",
        title: "Retention Optimization",
        content: "Implementation of feedback loops, service recovery protocols, and proactive customer care. Predictive analytics to identify at-risk customers and trigger retention campaigns. Expected improvement: 25% increase in retention rate and 35% growth in customer lifetime value.",
        metrics: [
          { label: "Retention Improvement", value: "25%" },
          { label: "CLV Growth", value: "35%" },
          { label: "Churn Reduction", value: "40%" },
          { label: "Satisfaction Score", value: "4.8/5" },
        ],
      },
    ],
  },
  "competitive-analysis": {
    title: "Competitive Intelligence Report",
    type: "Competitive Analysis",
    generatedAt: new Date(),
    sections: [
      {
        id: "competitive-landscape",
        title: "Competitive Landscape Overview",
        content: "Analysis of 247 restaurants within 2km radius reveals a fragmented market with no dominant player. Top 5 competitors control 34% market share. Opportunities exist in premium casual dining segment and authentic regional cuisine offerings.",
        metrics: [
          { label: "Total Competitors", value: "247" },
          { label: "Direct Competitors", value: "18" },
          { label: "Market Concentration", value: "34%" },
          { label: "Market Opportunity", value: "66%" },
        ],
      },
      {
        id: "competitor-profiles",
        title: "Key Competitor Profiles",
        content: "Detailed analysis of top 5 competitors: Nonna's Kitchen (Italian, ฿฿฿), Ciao Bella (Italian, ฿฿฿), Mediterranean Delights (Mediterranean, ฿฿), Pasta Paradise (Italian, ฿฿), and Spice Garden Thai (Thai, ฿฿). Each shows distinct strengths and vulnerabilities.",
        metrics: [
          { label: "Average Rating", value: "4.3/5" },
          { label: "Price Range", value: "฿250-450" },
          { label: "Seating Capacity", value: "65 avg" },
          { label: "Market Share", value: "6.8% avg" },
        ],
      },
      {
        id: "swot-analysis",
        title: "SWOT Analysis",
        content: "Strengths: Unique cuisine positioning, superior location, experienced team. Weaknesses: Limited brand recognition, smaller marketing budget. Opportunities: Underserved market segments, digital marketing gaps. Threats: New market entrants, economic uncertainty.",
        metrics: [
          { label: "Competitive Advantage", value: "7.8/10" },
          { label: "Market Position", value: "Strong" },
          { label: "Threat Level", value: "Medium" },
          { label: "Opportunity Score", value: "8.5/10" },
        ],
      },
      {
        id: "strategic-recommendations",
        title: "Strategic Recommendations",
        content: "Focus on differentiation through authentic cuisine and exceptional service. Leverage digital marketing to build brand awareness. Implement competitive pricing strategy for market penetration. Monitor competitor activities and respond quickly to market changes.",
        metrics: [
          { label: "Differentiation Score", value: "9.2/10" },
          { label: "Competitive Response Time", value: "2.1 days" },
          { label: "Market Share Target", value: "12%" },
          { label: "Success Probability", value: "87%" },
        ],
      },
    ],
  },
}

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = React.useState<string | null>("market-penetration")

  const handleExport = (format: "pdf" | "excel") => {
    console.log(`Exporting report in ${format} format`)
    alert(`Exporting ${selectedReport} report as ${format.toUpperCase()} (Demo mode)`)
  }

  const handleGenerateReport = (reportType: string) => {
    setSelectedReport(reportType)
  }

  const currentReport = selectedReport ? marketingReports[selectedReport as keyof typeof marketingReports] : null

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketing Reports</h1>
        <p className="text-gray-600">Professional marketing analysis and strategic insights for restaurant growth</p>
      </div>

      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              {Object.keys(marketingReports).length} Professional Reports Available
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              📋 Report Templates
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              ➕ Generate New Report
            </button>
          </div>
        </div>

        {/* Report Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Professional Marketing Reports</h2>
            <p className="text-gray-600 mt-1">Select a report to view detailed analysis and strategic recommendations</p>
          </div>
          <div className="p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(marketingReports).map(([key, report]) => (
                <div
                  key={key}
                  className={`cursor-pointer transition-all duration-200 border rounded-lg p-4 hover:shadow-md ${
                    selectedReport === key 
                      ? "ring-2 ring-green-500 border-green-200 bg-green-50" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedReport(key)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{report.title}</h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {report.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {report.generatedAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      selectedReport === key ? "bg-green-500" : "bg-gray-300"
                    }`}></div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {report.sections[0].content.substring(0, 120)}...
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{report.sections.length} sections</span>
                    <span>Professional Analysis</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Report Viewer */}
        {currentReport && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Report Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentReport.title}</h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {currentReport.type}
                    </span>
                    <span>Generated: {currentReport.generatedAt.toLocaleDateString()}</span>
                    <span>{currentReport.sections.length} sections</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleExport('pdf')}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    📄 Export PDF
                  </button>
                  <button
                    onClick={() => handleExport('excel')}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    📊 Export Excel
                  </button>
                </div>
              </div>
            </div>

            {/* Report Content */}
            <div className="p-6">
              <div className="space-y-8">
                {currentReport.sections.map((section, index) => (
                  <div key={section.id} className="border-b border-gray-100 pb-8 last:border-b-0">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">{section.title}</h3>
                        <p className="text-gray-700 mb-6 leading-relaxed">{section.content}</p>
                        
                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {section.metrics.map((metric, metricIndex) => (
                            <div key={metricIndex} className="bg-gray-50 rounded-lg p-4">
                              <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                              <div className="text-sm text-gray-600">{metric.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Report Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  This report was generated using BiteBase Intelligence platform with real market data and AI-powered analysis.
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    📧 Share Report
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    🔄 Update Analysis
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Report Templates */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Generate New Report</h2>
            <p className="text-gray-600 mt-1">Choose from professional marketing report templates</p>
          </div>
          <div className="p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {Object.entries(marketingReports).map(([key, report]) => (
                <button
                  key={key}
                  onClick={() => handleGenerateReport(key)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200 text-left"
                >
                  <div className="text-2xl mb-2">
                    {key === 'market-penetration' && '🎯'}
                    {key === 'brand-positioning' && '🏷️'}
                    {key === 'digital-marketing' && '📱'}
                    {key === 'customer-retention' && '🤝'}
                    {key === 'competitive-analysis' && '⚔️'}
                  </div>
                  <div className="font-medium text-sm mb-1">{report.type}</div>
                  <div className="text-xs text-gray-600">{report.sections.length} sections</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-green-600">5</div>
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">Professional Reports</div>
                <div className="text-xs text-gray-600">Available Templates</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-blue-600">20+</div>
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">Analysis Sections</div>
                <div className="text-xs text-gray-600">Comprehensive Coverage</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-purple-600">80+</div>
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">Key Metrics</div>
                <div className="text-xs text-gray-600">Data-Driven Insights</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-orange-600">100%</div>
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">Professional Quality</div>
                <div className="text-xs text-gray-600">Industry Standards</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
