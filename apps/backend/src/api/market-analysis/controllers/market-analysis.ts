/**
 * market-analysis controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::market-analysis.market-analysis', ({ strapi }) => ({
  // Create and run a new market analysis
  async createAndRun(ctx) {
    const {
      title,
      description,
      targetLocation,
      latitude,
      longitude,
      radius = 5,
      analysisType,
      targetCuisine
    } = ctx.request.body;

    if (!title || !targetLocation || !latitude || !longitude || !analysisType) {
      return ctx.badRequest('Missing required fields');
    }

    try {
      // Create the analysis record
      const analysis = await strapi.entityService.create('api::market-analysis.market-analysis', {
        data: {
          title,
          description,
          targetLocation,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          radius: parseFloat(radius),
          analysisType,
          targetCuisine,
          status: 'in-progress',
          createdBy: ctx.state.user?.id || 'anonymous',
        },
      });

      // Run the analysis asynchronously
      setImmediate(async () => {
        try {
          const results = await strapi.service('api::market-analysis.market-analysis')
            .runAnalysis(analysis.id, {
              latitude: parseFloat(latitude),
              longitude: parseFloat(longitude),
              radius: parseFloat(radius),
              analysisType,
              targetCuisine,
            });

          await strapi.entityService.update('api::market-analysis.market-analysis', analysis.id, {
            data: {
              ...results,
              status: 'completed',
              completedAt: new Date(),
            },
          });
        } catch (error) {
          await strapi.entityService.update('api::market-analysis.market-analysis', analysis.id, {
            data: {
              status: 'failed',
              results: { error: error instanceof Error ? error.message : 'Unknown error' },
            },
          });
        }
      });

      return analysis;
    } catch (error) {
      ctx.throw(500, 'Error creating market analysis');
    }
  },

  // Get analysis results with detailed breakdown
  async getResults(ctx) {
    const { id } = ctx.params;

    try {
      const analysis = await strapi.entityService.findOne('api::market-analysis.market-analysis', id);

      if (!analysis) {
        return ctx.notFound('Analysis not found');
      }

      // If analysis is completed, enhance results with additional data
      if (analysis.status === 'completed' && analysis.results) {
        const enhancedResults = await strapi.service('api::market-analysis.market-analysis')
          .enhanceResults(analysis);

        return {
          ...analysis,
          results: enhancedResults,
        };
      }

      return analysis;
    } catch (error) {
      ctx.throw(500, 'Error fetching analysis results');
    }
  },

  // Get summary statistics for all analyses
  async getSummary(ctx) {
    try {
      const analyses = await strapi.entityService.findMany('api::market-analysis.market-analysis', {
        fields: ['status', 'analysisType', 'opportunityScore', 'competitionLevel'],
      });

      const summary = {
        total: analyses.length,
        byStatus: analyses.reduce((acc: Record<string, number>, analysis) => {
          if (analysis.status) {
            acc[analysis.status] = (acc[analysis.status] || 0) + 1;
          }
          return acc;
        }, {}),
        byType: analyses.reduce((acc: Record<string, number>, analysis) => {
          if (analysis.analysisType) {
            acc[analysis.analysisType] = (acc[analysis.analysisType] || 0) + 1;
          }
          return acc;
        }, {}),
        averageOpportunityScore: (() => {
          const validScores = analyses.filter(a => a.opportunityScore != null);
          return validScores.length > 0
            ? validScores.reduce((sum, a) => sum + (a.opportunityScore || 0), 0) / validScores.length
            : 0;
        })(),
        competitionDistribution: analyses.reduce((acc: Record<string, number>, analysis) => {
          if (analysis.competitionLevel) {
            acc[analysis.competitionLevel] = (acc[analysis.competitionLevel] || 0) + 1;
          }
          return acc;
        }, {}),
      };

      return summary;
    } catch (error) {
      ctx.throw(500, 'Error fetching analysis summary');
    }
  },
}));
