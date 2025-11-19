// src/App.tsx
import React from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import { AlertTriangle, Home as HomeIcon } from 'lucide-react';
import { InstallPWAPrompt } from './components/InstallPWAPrompt';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { SellFlowProvider } from './context/SellFlowContext';

// Layout
import MainNavbar from './components/layout/MainNavbar';
import Footer from './components/layout/Footer';

// Home
import HeroBanner from './components/home/HeroBanner2';
import CustomerReviews from './components/home/CustomerReviews';
// import TopBrands from './components/home/TopBrands';
import BlogSlider from './components/home/BlogSlider';
import BlogSection from './components/home/BlogSection';
// import FAQSection from './components/home/FAQSection';
import DownloadAppBanner from './components/home/DownloadAppBanner';
import AboutSection from './components/home/AboutSection';
import CategorySlider from './components/home/CategorySlider';
import SellOldDevice from './components/home/SellOldDevice';

// Sell Flow
import ChooseBrand from './components/sell-flow/ChooseBrand';
import SelectModel from './components/sell-flow/SelectModel';
import DeviceStepper from './components/sell-flow/DeviceStepper';

// Account
import MyAccountPage from './components/account/MyAccountPage';
import type { MenuTab } from './components/account/MyAccountPage';
import MyOrderPage from './components/account/MyOrderPage';
import MyAddressesPage from './components/account/MyAddressesPage';
import MyWalletPage from './components/account/MyWalletPage';
import PassbookPage from './components/account/PassbookPage';
import AccountDetailsPage from './components/account/AccountDetailsPage';
import HelpdeskPage from './components/account/HelpdeskPage';
import RaiseDisputePage from './components/account/RaiseDisputePage';
import FeedbackPage from './components/account/FeedbackPage';
import KYCPage from './components/account/KYCPage';
import LeadDetailPage from './components/pages/LeadDetailPage';
import ScrollToTop from './api/utils/ScrollToTop';
import ContactUsPage from './components/pages/ContactUsPage';
import TermsAndConditions from './components/pages/TermsAndConditions';
import PrivacyPolicy from './components/pages/PrivacyPolicy';
import RefundPolicy from './components/pages/RefundPolicy';
import FAQ from './components/home/FAQSection';
import TermsOfUse from './components/pages/TermsOfUse';
import CookiePolicy from './components/pages/CookiePolicy';
import Career from './components/pages/Career';
import DisputesList from './components/lead/DisputesList';
import DisputeDetail from './components/lead/DisputeDetail';
import BankAccountsPage from './components/account/BankAccountPage';

function Home() {
  return (
    <main className="flex-grow">
      <HeroBanner />
      <CategorySlider />
      <SellOldDevice />
      <DownloadAppBanner />
      <CustomerReviews />
      {/* <TopBrands /> */}
      <BlogSlider />
      <FAQ />
    </main>
  );
}

// Not Found Page Component
function NotFoundPage() {
  return (
    <main className="flex-grow flex items-center justify-center py-24 bg-gray-50">
      <div className="text-center p-10 bg-white shadow-xl rounded-2xl max-w-lg mx-auto border-2 border-gray-100">
        <AlertTriangle size={64} className="text-yellow-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-[#1C1C1B] mb-4">404 - Page Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">
          Oops! The page you are looking for does not exist.
        </p>
        <p className="text-md text-gray-600 mb-6">
          Let's go to the home page to sell your devices!
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-[#FEC925] to-[#1B8A05] text-[#1C1C1B] font-bold rounded-xl hover:shadow-lg transition-all"
        >
          <HomeIcon size={20} />
          Go to Home
        </Link>
      </div>
    </main>
  );
}

function AppRoutes() {
  const navigate = useNavigate();

  const handleNavClick = (tab: MenuTab | 'Passbook' | 'account' | 'kyc' | 'bank') => {
    if (tab === 'Dashboard') {
      navigate('/my-account');
    } else if (tab === 'Passbook') {
      navigate('/my-account/passbook');
    } else if (tab === 'account') {
      navigate('/my-account/account-details');
    } else if (tab === 'kyc') {
      navigate('/my-account/kyc');
    } else if (tab === 'bank') {
      navigate('/my-account/bank');
    } else {
      navigate(`/my-account/${tab.replace(/\s+/g, '-').toLowerCase()}`);
    }
  };

  const handleBreadcrumbClick = (path: string) => {
    if (path === 'home') navigate('/');
    if (path === 'account') navigate('/my-account');
    if (path === 'wallet') navigate('/my-account/my-wallet');
  };

  const handleLogout = () => {
    // console.log('User logged out');
    navigate('/');
  };

  const accountProps = {
    username: 'User',
    onLogout: handleLogout,
    onNavClick: handleNavClick,
    onBreadcrumbClick: handleBreadcrumbClick,
  };

  return (
    <>
      {/* PWA Install Prompt */}
      <InstallPWAPrompt />
      <ScrollToTop />
      <MainNavbar isLoggedIn={false} onAccountClick={() => navigate('/my-account')} />
      
      <div className="pt-[0px]">
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<BlogSection />} />
          {/* <Route path="/blog/:id" element={<BlogDetailPage />} /> */}
          <Route path="/faq" element={<FAQ />} />
          <Route path="/about" element={<AboutSection />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/career" element={<Career />} />
          <Route path="/sell-old-product" element={<SellOldDevice />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          <Route path="/select-brand" element={<ChooseBrand />} />
          <Route path="/select-model" element={<SelectModel />} />
          
          {/* (Other page routes remain commented) */}

          <Route path="/device-stepper" element={<DeviceStepper />} />
          
          {/* (Sell flow routes remain commented) */}

          <Route path="/lead/:leadId" element={<LeadDetailPage />} />
          
          <Route path="/my-account" element={<MyAccountPage {...accountProps} />} />
          <Route path="/my-account/my-orders" element={<MyOrderPage {...accountProps} />} />
          <Route path="/my-account/my-wallet" element={<MyWalletPage {...accountProps} />} />
          <Route path="/my-account/passbook" element={<PassbookPage {...accountProps} />} />
          <Route path="/my-account/addresses" element={<MyAddressesPage {...accountProps} />} />
          <Route path="/my-account/account-details" element={<AccountDetailsPage {...accountProps} />} />
          <Route path="/my-account/helpdesk" element={<HelpdeskPage {...accountProps} />} />
          <Route path="/my-account/raise-dispute" element={<RaiseDisputePage {...accountProps} />} />
          <Route path="/my-account/feedback" element={<FeedbackPage {...accountProps} />} />
          <Route path="/my-account/kyc" element={<KYCPage {... accountProps } />} />
          <Route path="/my-account/bank" element={<BankAccountsPage {...accountProps} />} />
          <Route path="/disputes" element={<DisputesList />} />
          <Route path="/disputes/:disputeId" element={<DisputeDetail />} />
          <Route path="/contact" element={<ContactUsPage />} />
          {/* This must be the LAST route in the list */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <SellFlowProvider>
        <AppRoutes />
      </SellFlowProvider>
    </AuthProvider>
  );
}

export default App;