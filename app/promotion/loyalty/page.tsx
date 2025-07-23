'use client';

import React, { useState } from 'react';
import { MainLayout } from '../../../components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { 
  Plus, 
  Users, 
  Gift,
  Star,
  TrendingUp,
  Award,
  CreditCard,
  Calendar,
  BarChart3,
  Settings
} from 'lucide-react';

interface LoyaltyProgram {
  id: string;
  name: string;
  type: 'points' | 'visits' | 'spending';
  status: 'active' | 'paused' | 'draft';
  members: number;
  rewardsRedeemed: number;
  totalValue: number;
  description: string;
  rules: {
    earnRate: string;
    redeemRate: string;
    minSpend?: number;
  };
}

interface LoyaltyMember {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  points: number;
  visits: number;
  totalSpent: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  lastVisit: string;
}

const mockPrograms: LoyaltyProgram[] = [
  {
    id: '1',
    name: 'Bella Rewards',
    type: 'points',
    status: 'active',
    members: 1250,
    rewardsRedeemed: 340,
    totalValue: 85000,
    description: 'Earn 1 point for every ฿10 spent. Redeem 100 points for ฿50 discount.',
    rules: {
      earnRate: '1 point per ฿10',
      redeemRate: '100 points = ฿50'
    }
  },
  {
    id: '2',
    name: 'VIP Dining Club',
    type: 'spending',
    status: 'active',
    members: 180,
    rewardsRedeemed: 45,
    totalValue: 125000,
    description: 'Exclusive program for high-value customers with special perks.',
    rules: {
      earnRate: '5% cashback',
      redeemRate: 'Instant rewards',
      minSpend: 5000
    }
  }
];

const mockMembers: LoyaltyMember[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@email.com',
    joinDate: '2025-03-15',
    points: 850,
    visits: 12,
    totalSpent: 8500,
    tier: 'gold',
    lastVisit: '2025-07-20'
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike@email.com',
    joinDate: '2025-04-02',
    points: 420,
    visits: 8,
    totalSpent: 4200,
    tier: 'silver',
    lastVisit: '2025-07-18'
  },
  {
    id: '3',
    name: 'Emma Wilson',
    email: 'emma@email.com',
    joinDate: '2025-02-10',
    points: 1250,
    visits: 18,
    totalSpent: 12500,
    tier: 'platinum',
    lastVisit: '2025-07-22'
  }
];

export default function LoyaltyProgramPage() {
  const [programs, setPrograms] = useState<LoyaltyProgram[]>(mockPrograms);
  const [members, setMembers] = useState<LoyaltyMember[]>(mockMembers);
  const [activeTab, setActiveTab] = useState<'programs' | 'members'>('programs');

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'bg-orange-100 text-orange-800';
      case 'silver': return 'bg-gray-100 text-gray-800';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'platinum': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalStats = {
    totalMembers: programs.reduce((sum, p) => sum + p.members, 0),
    totalRewards: programs.reduce((sum, p) => sum + p.rewardsRedeemed, 0),
    totalValue: programs.reduce((sum, p) => sum + p.totalValue, 0),
    activePrograms: programs.filter(p => p.status === 'active').length
  };

  return (
    <MainLayout pageTitle="Loyalty Programs" pageDescription="Manage customer loyalty programs">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Loyalty Programs</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage customer loyalty programs
            </p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Program
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Members</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalStats.totalMembers.toLocaleString()}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rewards Redeemed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalStats.totalRewards}
                  </p>
                </div>
                <Gift className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ฿{(totalStats.totalValue / 1000).toFixed(0)}K
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Programs</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalStats.activePrograms}
                  </p>
                </div>
                <Award className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('programs')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'programs'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Programs
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'members'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Members
            </button>
          </nav>
        </div>

        {/* Programs Tab */}
        {activeTab === 'programs' && (
          <div className="space-y-4">
            {programs.map((program) => (
              <Card key={program.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Program Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {program.name}
                        </h3>
                        <Badge className={getStatusColor(program.status)}>
                          {program.status}
                        </Badge>
                        <Badge variant="outline">
                          {program.type}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {program.description}
                      </p>
                      
                      <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
                        <div>Earn: {program.rules.earnRate}</div>
                        <div>Redeem: {program.rules.redeemRate}</div>
                        {program.rules.minSpend && (
                          <div>Min Spend: ฿{program.rules.minSpend}</div>
                        )}
                      </div>
                    </div>

                    {/* Program Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {program.members.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Members</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">
                          {program.rewardsRedeemed}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Redeemed</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                          ฿{(program.totalValue / 1000).toFixed(0)}K
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Value</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="space-y-4">
            {members.map((member) => (
              <Card key={member.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Member Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {member.name}
                        </h3>
                        <Badge className={getTierColor(member.tier)}>
                          {member.tier}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {member.email}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Joined {new Date(member.joinDate).toLocaleDateString()}
                        </div>
                        <div>
                          Last visit: {new Date(member.lastVisit).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Member Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                          {member.points}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Points</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {member.visits}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Visits</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">
                          ฿{member.totalSpent.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Total Spent</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}