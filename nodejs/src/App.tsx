import React from 'react';
import VersionPage from './widgets/VersionPage';
import { pageHeight, pageWidth, gnbHeight } from 'src/common/Constants';

function App() {
  return (
    <div className="App" style={{height: pageHeight - 104 - gnbHeight}}>
      <VersionPage />
    </div>
  );
}

export default App;
