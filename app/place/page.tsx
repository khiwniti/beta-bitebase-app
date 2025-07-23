'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { MetricCard } from "../../components/ui/metric-card";
import { DataTable } from "../../components/ui/data-table";
import { ChartContainer, SimpleLineChart, SimpleBarChart } from "../../components/ui/chart-container";
import {
  MapPin,
  Users,
  TrendingUp,
  Building,
  Eye,
  Target,
  Star,
  Navigation,
  Clock,
  BarChart3
} from 'lucide-react';

export default function PlacePage() {
  const { t } = useLanguage();

  return (
    <div>
      <div className="flex flex-col space-y-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('locationIntelligence.title')}</h1>
          <p className="text-gray-600">{t('locationIntelligence.description')}</p>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <Link
            href="/place/new-location"
            className="btn-primary px-4 py-2 rounded-md"
          >
            {t('locationIntelligence.analyzeNewLocation')}
          </Link>
        </div>

        {/* Enhanced Location Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title={t('locationIntelligence.metrics.dailyFootTraffic')}
            value="1,240"
            change={12.7}
            period={t('locationIntelligence.metrics.vsLastWeek')}
            icon={<Eye className="h-5 w-5" />}
          />

          <MetricCard
            title={t('locationIntelligence.metrics.marketPotential')}
            value="87/100"
            change={8.2}
            period={t('locationIntelligence.metrics.vsLastMonth')}
            icon={<Target className="h-5 w-5" />}
          />

          <MetricCard
            title={t('locationIntelligence.metrics.competitorDensity')}
            value="12"
            change={-3.4}
            period={t('locationIntelligence.metrics.vsLastQuarter')}
            icon={<Building className="h-5 w-5" />}
          />

          <MetricCard
            title={t('locationIntelligence.metrics.locationScore')}
            value="8.5/10"
            change={0.5}
            period={t('locationIntelligence.metrics.vsLastAssessment')}
            icon={<Star className="h-5 w-5" />}
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Location Map */}
          <Link
            href="/place/map"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all border border-gray-200 hover:border-primary"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
                  <line x1="8" y1="2" x2="8" y2="18"></line>
                  <line x1="16" y1="6" x2="16" y2="22"></line>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium">{t('locationIntelligence.sections.locationMap.title')}</h3>
                <p className="text-sm text-gray-500">{t('locationIntelligence.sections.locationMap.description')}</p>
              </div>
            </div>
          </Link>

          {/* Demographic Analysis */}
          <Link
            href="/place/demographics"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all border border-gray-200 hover:border-primary"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium">{t('locationIntelligence.sections.demographicAnalysis.title')}</h3>
                <p className="text-sm text-gray-500">{t('locationIntelligence.sections.demographicAnalysis.description')}</p>
              </div>
            </div>
          </Link>

          {/* Foot Traffic Analysis */}
          <Link
            href="/place/foot-traffic"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all border border-gray-200 hover:border-primary"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34"></path>
                  <path d="M14 3v4a2 2 0 0 0 2 2h4"></path>
                  <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2"></path>
                  <path d="M21 14H11"></path>
                  <path d="m15 10-4 4 4 4"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium">{t('locationIntelligence.sections.footTrafficAnalysis.title')}</h3>
                <p className="text-sm text-gray-500">{t('locationIntelligence.sections.footTrafficAnalysis.description')}</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Sub-categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Competitor Locations */}
          <Link
            href="/place/competitors"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all border border-gray-200 hover:border-primary"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <line x1="19" x2="19" y1="8" y2="14"></line>
                  <line x1="22" x2="16" y1="11" y2="11"></line>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium">{t('locationIntelligence.sections.competitorLocations.title')}</h3>
                <p className="text-sm text-gray-500">{t('locationIntelligence.sections.competitorLocations.description')}</p>
              </div>
            </div>
          </Link>

          {/* Site Selection */}
          <Link
            href="/place/site-selection"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all border border-gray-200 hover:border-primary"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium">{t('locationIntelligence.sections.siteSelection.title')}</h3>
                <p className="text-sm text-gray-500">{t('locationIntelligence.sections.siteSelection.description')}</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Location Insights */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-medium mb-4">{t('locationIntelligence.insights.title')}</h3>
          <div className="space-y-4">
            <div className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-all">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3 text-primary">
                💡
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h4 className="font-medium">{t('locationIntelligence.insights.highGrowthArea.title')}</h4>
                  <span className="text-xs text-gray-500">{t('locationIntelligence.insights.highGrowthArea.impact')}</span>
                </div>
                <p className="text-sm text-gray-500">{t('locationIntelligence.insights.highGrowthArea.description')}</p>
              </div>
            </div>

            <div className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-all">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3 text-primary">
                💡
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h4 className="font-medium">{t('locationIntelligence.insights.peakHoursShift.title')}</h4>
                  <span className="text-xs text-gray-500">{t('locationIntelligence.insights.peakHoursShift.impact')}</span>
                </div>
                <p className="text-sm text-gray-500">{t('locationIntelligence.insights.peakHoursShift.description')}</p>
              </div>
            </div>

            <div className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-all">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3 text-amber-600">
                ⚠️
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h4 className="font-medium">{t('locationIntelligence.insights.competitorAlert.title')}</h4>
                  <span className="text-xs text-gray-500">{t('locationIntelligence.insights.competitorAlert.impact')}</span>
                </div>
                <p className="text-sm text-gray-500">{t('locationIntelligence.insights.competitorAlert.description')}</p>
              </div>
            </div>
          </div>
        </div>
    </div>
    </div>
  );
}
