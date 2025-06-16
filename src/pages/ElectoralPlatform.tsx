
import React, { useState } from 'react';
import ElectoralDashboard from '@/components/electoral/ElectoralDashboard';
import DemoViewer from '@/components/electoral/DemoViewer';
import VisitorsFunnel from '@/components/electoral/VisitorsFunnel';

const ElectoralPlatform = () => {
  const [showDemo, setShowDemo] = useState(false);
  const [showVisitorsFunnel, setShowVisitorsFunnel] = useState(false);

  return (
    <div className="min-h-screen">
      <ElectoralDashboard
        onDemoClick={() => setShowDemo(true)}
        onVisitorsClick={() => setShowVisitorsFunnel(true)}
      />

      {showDemo && (
        <DemoViewer onClose={() => setShowDemo(false)} />
      )}

      {showVisitorsFunnel && (
        <VisitorsFunnel onClose={() => setShowVisitorsFunnel(false)} />
      )}
    </div>
  );
};

export default ElectoralPlatform;
