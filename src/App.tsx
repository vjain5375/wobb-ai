import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { SearchPage } from "@/pages/SearchPage";
import { ProfileDetailPage } from "@/pages/ProfileDetailPage";
import { CampaignBriefPage } from "@/pages/CampaignBriefPage";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/profile/:username" element={<ProfileDetailPage />} />
          <Route path="/campaign" element={<CampaignBriefPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
