import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { SellFlowProvider } from './context/SellFlowContext';

// Layout
import HeaderRibbon from './components/layout/HeaderRibbon';
import MainNavbar from './components/layout/MainNavbar';
import Footer from './components/layout/Footer';

// Home
import HeroBanner from './components/home/HeroBanner';
import CustomerReviews from './components/home/CustomerReviews';
import TopBrands from './components/home/TopBrands';
import BlogSlider from './components/home/BlogSlider';
import BlogSection from './components/home/BlogSection';
// import BlogDetailPage from './components/home/BlogDetailPage';
import FAQSection from './components/home/FAQSection';
import DownloadAppBanner from './components/home/DownloadAppBanner';
import AboutSection from './components/home/AboutSection';
import CategorySlider from './components/home/CategorySlider';
import SellOldDevice from './components/home/SellOldDevice';

// Sell Flow
import SellProductSection from './components/sell-flow/SellProductSection';
import ChooseBrand from './components/sell-flow/ChooseBrand';
import SelectModel from './components/sell-flow/SelectModel';
import DeviceStepper from './components/sell-flow/DeviceStepper';
import SelectAddress from './components/sell-flow/SelectAddress';
import SlotBooking from './components/sell-flow/SlotBooking';
import PreviewPage from './components/sell-flow/PreviewPage';
import SuccessPage from './components/sell-flow/SuccessPage';

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

// Pages
// import ContactUsPage from './components/pages/ContactUsPage';
// import RefundPolicyPage from './components/pages/RefundPolicyPage';
// import TermsAndConditionsPage from './components/pages/TermsAndConditionsPage';
// import PrivacyPolicyPage from './components/pages/PrivacyPolicyPage';
// import TermsOfUsePage from './components/pages/TermsOfUsePage';
// import CookiesPolicyPage from './components/pages/CookiesPolicyPage';
// import BecomePartnerPage from './components/pages/BecomePartnerPage';
// import CareerPage from './components/pages/CareerPage';

function Home() {
  return (
    <main className="flex-grow">
      <HeroBanner />
      <CategorySlider />
      <SellOldDevice />
      <DownloadAppBanner />
      <CustomerReviews />
      <TopBrands />
      <BlogSlider />
      <FAQSection />
    </main>
  );
}

function AppRoutes() {
  const navigate = useNavigate();

  const handleNavClick = (tab: MenuTab | 'Passbook') => {
    if (tab === 'Dashboard') {
      navigate('/my-account');
    } else if (tab === 'Passbook') {
      navigate('/my-account/passbook');
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
    console.log('User logged out');
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
      <HeaderRibbon />
      <MainNavbar isLoggedIn={false} onAccountClick={() => navigate('/my-account')} />
      
      <div className="pt-[0px]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<BlogSection />} />
          {/* <Route path="/blog/:id" element={<BlogDetailPage />} /> */}
          <Route path="/faq" element={<FAQSection />} />
          <Route path="/about" element={<AboutSection />} />
          <Route path="/sell-old-product" element={<SellOldDevice />} />
          <Route path="/select-brand" element={<ChooseBrand />} />
          <Route path="/select-model" element={<SelectModel />} />
          {/* <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/refund-policy" element={<RefundPolicyPage />} />
          <Route path="/terms" element={<TermsAndConditionsPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-use" element={<TermsOfUsePage />} />
          <Route path="/cookies-policy" element={<CookiesPolicyPage />} />
          <Route path="/partner" element={<BecomePartnerPage />} />
          <Route path="/career" element={<CareerPage />} /> */}
          <Route path="/device-stepper" element={<DeviceStepper onSellNow={() => navigate('/select-address')} />} />
          <Route path="/select-address" element={<SelectAddress onNext={() => navigate('/slot-booking')} />} />
          <Route path="/slot-booking" element={<SlotBooking onNext={() => navigate('/confirmation')} />} />
          <Route path="/confirmation" element={<PreviewPage onBack={() => navigate(-1)} onConfirm={() => navigate('/success')} />} />
          <Route path="/success" element={<SuccessPage onGoHome={() => navigate('/')} onViewLeads={() => navigate('/my-account/my-orders')} />} />
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
          <Route path="/my-account/bank" element={<MyAccountPage {...accountProps} />} />
          
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
        <Router>
          <AppRoutes />
        </Router>
      </SellFlowProvider>
    </AuthProvider>
  );
}

export default App;