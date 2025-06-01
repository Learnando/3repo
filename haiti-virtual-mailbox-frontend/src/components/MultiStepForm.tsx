import { useState } from "react";
import Step1ContactInfo from "./Step1ContactInfo";
import Step2PackageDetails from "./Step2PackageDetails";
import Step3ShippingDelivery from "./Step3ShippingDelivery";
import Step4ConfirmSubmit from "./Step4ConfirmSubmit";
import ProgressBar from "./ProgressBar";
import "../styles/MultiStepForm.css";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const MultiStepForm = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  const [formData, setFormData] = useState({
    customerName: user?.name || "",
    whatsapp: "",
    sender: "",
    description: "",
    price: "",
    shipping: "air",
    delivery: "pickup",
    note: "",
    screenshot: null as File | null,
    creditsToUse: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "price") {
      const numericValue = value.replace(/,/g, "").replace(/[^\d.]/g, "");
      if (numericValue === "") {
        setFormData((prev) => ({ ...prev, [name]: "" }));
        return;
      }

      const parts = numericValue.split(".");
      const integerPart = parts[0];
      const decimalPart = parts[1] || "";
      const formattedInteger = parseInt(integerPart, 10).toLocaleString(
        "en-US"
      );
      const formatted =
        decimalPart.length > 0
          ? `${formattedInteger}.${decimalPart.slice(0, 2)}`
          : formattedInteger;

      setFormData((prev) => ({ ...prev, [name]: formatted }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, screenshot: file }));
  };

  const handleNext = () => {
    if (step === 1 && !formData.whatsapp.trim()) {
      toast.error("📞 " + t("error.phoneRequired"));
      return;
    }

    if (step === 2) {
      if (!formData.description.trim()) {
        toast.error("🛍️ " + t("error.descriptionRequired"));
        return;
      }

      const rawPrice = formData.price.replace(/,/g, "");
      if (!rawPrice || isNaN(Number(rawPrice))) {
        toast.error("💵 " + t("error.priceRequired"));
        return;
      }

      if (
        formData.creditsToUse &&
        (isNaN(Number(formData.creditsToUse)) ||
          Number(formData.creditsToUse) < 0)
      ) {
        toast.error("💳 Invalid referral credits value.");
        return;
      }
    }

    if (step < 4) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.screenshot) {
      toast.error("📸 " + t("error.screenshotRequired"));
      return;
    }

    const data = new FormData();
    for (const key in formData) {
      let value = formData[key as keyof typeof formData];
      if (value !== null) {
        if (key === "price" && typeof value === "string") {
          value = value.replace(/,/g, "");
        }
        if (key === "creditsToUse" && value === "") {
          value = "0";
        }
        data.append(key, value as any);
      }
    }

    if (user?._id) {
      data.append("userId", user._id);
    }

    setIsSubmitting(true);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 5;
        return next >= 90 ? 90 : next;
      });
    }, 150);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/packages`, {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      console.log("📦 Package submitted:", result);
      setProgress(100);
      toast.success("✅ " + t("submit.success"));

      setTimeout(() => {
        setFormData({
          customerName: user?.name || "",
          whatsapp: "",
          sender: "",
          description: "",
          price: "",
          shipping: "air",
          delivery: "pickup",
          note: "",
          screenshot: null,
          creditsToUse: "",
        });
        setStep(1);
        setIsSubmitting(false);
        setProgress(0);
      }, 1000);
    } catch (err) {
      clearInterval(progressInterval);
      console.error("❌ Failed to submit package:", err);
      toast.error(t("submit.failed"));
      setIsSubmitting(false);
      setProgress(0);
    } finally {
      clearInterval(progressInterval);
    }
  };

  return (
    <div className="multi-step-form">
      <ProgressBar currentStep={step} />

      {step === 1 && (
        <Step1ContactInfo formData={formData} onChange={handleChange} />
      )}
      {step === 2 && (
        <Step2PackageDetails
          formData={formData}
          onChange={handleChange}
          availableCredits={user?.credits ?? 0}
        />
      )}
      {step === 3 && (
        <Step3ShippingDelivery formData={formData} onChange={handleChange} />
      )}

      {step === 4 && (
        <form onSubmit={handleSubmit}>
          {isSubmitting && (
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${progress}%` }} />
              <p style={{ textAlign: "center" }}>⏳ Uploading... {progress}%</p>
            </div>
          )}
          <Step4ConfirmSubmit
            formData={formData}
            onFileChange={handleFileChange}
          />
          <div className="navigation-buttons">
            <button type="button" onClick={handleBack}>
              ⬅️ {t("back")}
            </button>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "⏳ Submitting..." : t("submit.finalize")}
            </button>
          </div>
        </form>
      )}

      {step < 4 && (
        <div className="navigation-buttons">
          {step > 1 && (
            <button type="button" onClick={handleBack}>
              ⬅️ {t("back")}
            </button>
          )}
          <button type="button" onClick={handleNext}>
            {t("next")} ➡️
          </button>
        </div>
      )}
    </div>
  );
};

export default MultiStepForm;
