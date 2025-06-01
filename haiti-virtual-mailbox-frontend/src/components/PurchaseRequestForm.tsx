import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "../styles/PurchaseRequestForm.css";
import { useTranslation } from "react-i18next"; // ✅

const PurchaseRequestForm = () => {
  const { user } = useAuth();
  const { t } = useTranslation(); // ✅

  const [form, setForm] = useState({
    itemUrl: "",
    estimatedPrice: "",
    quantity: "1",
    notes: "",
    screenshot: null,
    referenceNumber: "", // ✅ NEW
  });
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScreenshot(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error(t("purchaseForm.loginRequired"));
      return;
    }

    setIsSubmitting(true);
    setProgress(0);

    const data = new FormData();
    data.append("userId", user._id);
    data.append("itemUrl", form.itemUrl);
    data.append("estimatedPrice", form.estimatedPrice);
    data.append("quantity", form.quantity);
    data.append("notes", form.notes);

    if (form.referenceNumber) {
      data.append("referenceNumber", form.referenceNumber); // ✅ No parsing
    }

    if (screenshot) {
      data.append("screenshot", screenshot);
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 5;
        return next >= 90 ? 90 : next;
      });
    }, 150);

    try {
      await api.post("/purchase-requests", data);
      setProgress(100);
      toast.success(t("purchaseForm.success"));

      setTimeout(() => {
        setForm({
          itemUrl: "",
          estimatedPrice: "",
          quantity: "1",
          notes: "",
          screenshot: null,
          referenceNumber: "",
        });
        setScreenshot(null);
        setIsSubmitting(false);
        setProgress(0);
      }, 1000);
    } catch (err) {
      clearInterval(interval);
      console.error("Error submitting purchase request:", err);
      toast.error(t("purchaseForm.error"));
      setIsSubmitting(false);
      setProgress(0);
    } finally {
      clearInterval(interval);
    }
  };

  return (
    <div className="purchase-form-wrapper">
      <h2>🛒 {t("purchaseForm.title")}</h2>

      {isSubmitting && (
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
          <p style={{ textAlign: "center" }}>⏳ Uploading... {progress}%</p>
        </div>
      )}

      <form className="purchase-form" onSubmit={handleSubmit}>
        <label>
          🔢 Reference Number
          <input
            type="text" // ✅ allows characters like + and -
            name="referenceNumber"
            value={form.referenceNumber}
            onChange={(e) =>
              setForm({ ...form, referenceNumber: e.target.value })
            }
            placeholder="Enter your reference number"
            required
          />
        </label>

        <label>
          🔗 {t("purchaseForm.link")}
          <input
            type="url"
            name="itemUrl"
            value={form.itemUrl}
            onChange={handleChange}
            placeholder={t("purchaseForm.linkPlaceholder")}
            required
          />
        </label>

        <label>
          💵 {t("purchaseForm.price")}
          <input
            type="number"
            name="estimatedPrice"
            value={form.estimatedPrice}
            onChange={handleChange}
            placeholder={t("purchaseForm.pricePlaceholder")}
            required
          />
        </label>

        <label>
          📦 {t("purchaseForm.quantity")}
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            min={1}
            required
          />
        </label>

        <label>
          ✏️ {t("purchaseForm.notes")}
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder={t("purchaseForm.notesPlaceholder")}
          />
        </label>

        <label>
          📸 {t("purchaseForm.screenshot")}
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>

        <button type="submit" className="submit-btn">
          {t("purchaseForm.submit")}
        </button>
      </form>
    </div>
  );
};

export default PurchaseRequestForm;
