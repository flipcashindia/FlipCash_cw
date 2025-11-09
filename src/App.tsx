import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom';
import { AlertTriangle, Home as HomeIcon } from 'lucide-react'; // Added icons and Link

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
// import SellProductSection from './components/sell-flow/SellProductSection';
import ChooseBrand from './components/sell-flow/ChooseBrand';
import SelectModel from './components/sell-flow/SelectModel';
import DeviceStepper from './components/sell-flow/DeviceStepper';
// import SelectAddress from './components/sell-flow/SelectAddress';
// import SlotBooking from './components/sell-flow/SlotBooking';
// import PreviewPage from './components/sell-flow/PreviewPage';
// import SuccessPage from './components/sell-flow/SuccessPage';

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

// (Other page imports remain commented)

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

// --- ✅ NEW NOT FOUND PAGE COMPONENT ---
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
// --- END OF NEW COMPONENT ---


function AppRoutes() {
  const navigate = useNavigate();

  // 1. Update the type to include all possible string values
  const handleNavClick = (tab: MenuTab | 'Passbook' | 'account' | 'kyc' | 'bank') => {
    
    // 2. Add logic to handle the new cases
    if (tab === 'Dashboard') {
      navigate('/my-account');
    } else if (tab === 'Passbook') {
      navigate('/my-account/passbook');
    } else if (tab === 'account') {
      // 'account' is used to go back to the main Account Details page
      navigate('/my-account/account-details');
    } else if (tab === 'kyc') {
      navigate('/my-account/kyc');
    } else if (tab === 'bank') {
      // This route in App.tsx pointed to MyAccountPage, 
      // but should probably point to a dedicated bank page.
      // For now, let's make it navigate to the bank page route.
      navigate('/my-account/bank'); 
    } else {
      // This handles all standard MenuTab strings like "My Orders"
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
      <ScrollToTop />
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
          <Route path="/my-account/bank" element={<MyAccountPage {...accountProps} />} />
          
          {/* --- ✅ ADDED NOT FOUND ROUTE --- */}
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
        <Router>
          <AppRoutes />
        </Router>
      </SellFlowProvider>
    </AuthProvider>
  );
}

export default App;