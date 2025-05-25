import "../styles/Home.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SupportModal from "../components/SupportModal"; // ✅ import modal
import { toast } from "react-toastify";

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="home-page">
      <h1>{t("home.title")}</h1>
      <p>{t("home.subtitle")}</p>
      {/* 💰 Payment Methods */}
      <div className="home-payment-methods">
        <h3>💳 {t("home.paymentMethods")}</h3>
        <div className="payment-grid">
          <div className="payment-card">
            <img src="/logos/Cash-App-Logo.png" alt="CashApp" />
            <p>{t("home.cashapp")}: $haitibox</p>

            <button
              onClick={() => {
                navigator.clipboard.writeText("$haitibox");
                toast.success("✅ Copied CashApp ID!");
              }}
              className="copy-btn"
            >
              📋 Copy
            </button>
          </div>

          <div className="payment-card">
            <img src="/logos/Zelle-logo.png" alt="Zelle" />
            <p>{t("home.zelle")}: bensleyrameau@gmail.com</p>
            <button
              onClick={() => {
                navigator.clipboard.writeText("bensleyrameau@gmail.com");
                toast.success("✅ Copied Zelle address!");
              }}
              className="copy-btn"
            >
              📋 Copy
            </button>
          </div>
          <div className="payment-card">
            <img src="/logos/Moncash-Logo.png" alt="MonCash" />
            <p>{t("home.moncash")}: +509 3245 6789</p>

            <button
              onClick={() => {
                navigator.clipboard.writeText("+509 3245 6789");
                toast.success("✅  Copied MonCash number!");
              }}
              className="copy-btn"
            >
              📋 Copy
            </button>
          </div>
        </div>
      </div>
      <Link to="/register" className="btn">
        {t("home.getStarted")}
      </Link>
      <SupportModal /> {/* ✅ floating support icon */}
    </div>
  );
};

export default Home;
