import { Node } from '@prisma/client';
import {
  Card,
  Col,
  Divider,
  Flex,
  Grid,
  Icon,
  Metric,
  TabPanel,
  Text,
  Title,
} from '@tremor/react';
import { HelpCircle } from 'lucide-react';

type Props = {
  nodes: Node[];
};

export const General = ({ nodes }: Props) => {
  return (
    <TabPanel>
      <Grid numItemsLg={6} className="gap-6 mt-6">
        {/* Main section */}
        <Col numColSpanLg={4}>
          <Card className="h-full">
            <div className="h-60" />
          </Card>
        </Col>

        {/* KPI sidebar */}
        <Col numColSpanLg={2}>
          <div className="space-y-6">
            <Card>
              <Flex justifyContent="start" className="space-x-4">
                <Icon
                  icon={HelpCircle}
                  variant="light"
                  size="xl"
                  color="transparent"
                />
                <div className="truncate">
                  <Text>Question</Text>
                  <Metric className="truncate">{nodes.length}</Metric>
                </div>
              </Flex>
            </Card>
            <Card>
              <div className="h-24" />
            </Card>
            <Card>
              <div className="h-24" />
            </Card>
          </div>
        </Col>
      </Grid>
    </TabPanel>
  );
};
