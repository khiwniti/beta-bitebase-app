import React, { useState, useEffect } from 'react';
import { Box, Typography, Flex, Loader, Button, Table, Tr, Td, Th, Thead, Tbody } from '@strapi/design-system';
import { Check, Cross } from '@strapi/icons';
import pluginId from '../../pluginId';
import { request } from '@strapi/helper-plugin';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [health, setHealth] = useState(null);
  const [activities, setActivities] = useState([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const healthData = await request(`/${pluginId}/health`);
        setHealth(healthData);

        // Get recent activities
        const activityData = await request('/content-manager/collection-types/plugin::agent-integration.agent-activity', {
          method: 'GET',
          params: {
            sort: 'timestamp:DESC',
            'pagination[limit]': 10
          }
        });
        
        setActivities(activityData.results || []);
      } catch (error) {
        console.error('Error fetching agent data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refresh]);

  const handleRefresh = () => {
    setRefresh(prev => prev + 1);
  };

  return (
    <Box padding={8} background="neutral100">
      <Box paddingBottom={4}>
        <Typography variant="alpha">Agent Integration</Typography>
        <Typography variant="epsilon">Connect with the Bitebase agent system</Typography>
      </Box>

      {loading ? (
        <Flex justifyContent="center" padding={6}>
          <Loader>Loading agent status...</Loader>
        </Flex>
      ) : (
        <>
          <Box padding={4} background="neutral0" shadow="tableShadow" hasRadius>
            <Typography variant="delta">Agent System Health</Typography>
            <Flex gap={4} padding={4}>
              <Box padding={4} background={health?.fastapi?.status === 'healthy' ? 'success100' : 'danger100'} hasRadius>
                <Typography fontWeight="bold">FastAPI</Typography>
                <Flex alignItems="center" gap={2}>
                  {health?.fastapi?.status === 'healthy' ? <Check /> : <Cross />}
                  <Typography>{health?.fastapi?.status}</Typography>
                </Flex>
                <Typography variant="pi">{health?.fastapi?.url}</Typography>
              </Box>
              
              <Box padding={4} background={health?.gateway?.status === 'healthy' ? 'success100' : 'danger100'} hasRadius>
                <Typography fontWeight="bold">Gateway</Typography>
                <Flex alignItems="center" gap={2}>
                  {health?.gateway?.status === 'healthy' ? <Check /> : <Cross />}
                  <Typography>{health?.gateway?.status}</Typography>
                </Flex>
                <Typography variant="pi">{health?.gateway?.url}</Typography>
              </Box>
            </Flex>
            
            <Flex justifyContent="flex-end" padding={2}>
              <Button onClick={handleRefresh}>Refresh Status</Button>
            </Flex>
          </Box>

          <Box marginTop={6} padding={4} background="neutral0" shadow="tableShadow" hasRadius>
            <Typography variant="delta">Recent Activities</Typography>
            
            {activities.length > 0 ? (
              <Table colCount={5} rowCount={activities.length}>
                <Thead>
                  <Tr>
                    <Th><Typography variant="sigma">Action</Typography></Th>
                    <Th><Typography variant="sigma">Status</Typography></Th>
                    <Th><Typography variant="sigma">Timestamp</Typography></Th>
                    <Th><Typography variant="sigma">Data</Typography></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {activities.map((activity) => (
                    <Tr key={activity.id}>
                      <Td><Typography>{activity.action}</Typography></Td>
                      <Td>
                        <Flex alignItems="center" gap={2}>
                          {activity.success ? (
                            <Check width="16px" color="success500" />
                          ) : (
                            <Cross width="16px" color="danger500" />
                          )}
                          <Typography>{activity.success ? 'Success' : 'Failed'}</Typography>
                        </Flex>
                      </Td>
                      <Td><Typography>{new Date(activity.timestamp).toLocaleString()}</Typography></Td>
                      <Td><Typography>{activity.data ? `${activity.data.substring(0, 50)}...` : 'N/A'}</Typography></Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Flex justifyContent="center" padding={6}>
                <Typography variant="omega">No recent activity found</Typography>
              </Flex>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default App; 