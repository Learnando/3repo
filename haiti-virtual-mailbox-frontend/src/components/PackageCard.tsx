import { useState } from "react";
import "../styles/PackageCard.css";
import { useTranslation } from "react-i18next";

interface PackageProps {
  _id: string;
  trackingNumber: string;
  status: string;
  sender?: string;
  description?: string;
  createdAt?: string;
  screenshotUrl?: string;
  receiptUrl?: string;
  finalFee?: number;
  onDelete?: (id: string) => void;
  onCancel?: (id: string) => void;
}

const PackageCard = ({
  _id,
  trackingNumber,
  status,
  sender,
  description,
  createdAt,
  screenshotUrl,
  receiptUrl,
  finalFee,
  onDelete,
  onCancel,
}: PackageProps) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [receiptUploaded, setReceiptUploaded] = useState(receiptUrl || "");
  const { t } = useTranslation();

  const handleCopy = () => {
    navigator.clipboard.writeText(trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const toggleDescription = () => {
    setExpanded((prev) => !prev);
  };

  const handleReceiptUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("receipt", file);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/packages/${_id}/upload-receipt`,
        {
          method: "PATCH",
          body: formData,
        }
      );
      const updated = await res.json();
      setReceiptUploaded(updated.receiptUrl);
    } catch (err) {
      console.error("❌ Receipt upload failed", err);
    }
  };

  return (
    <div className="package-card horizontal">
      {screenshotUrl && (
        <div className="left-section">
          <img
            src={screenshotUrl}
            alt="Screenshot"
            className="screenshot-image"
            onClick={() => setShowPreview(true)}
          />
        </div>
      )}

      <div className="right-section">
        <div className="card-header">
          <h3>
            📦 {t("card.tracking")}: {trackingNumber}
          </h3>
          <div className="action-buttons">
            <button onClick={handleCopy} className="copy-btn">
              {copied ? t("card.copied") : t("card.copy")}
            </button>
            {onDelete && (
              <button className="delete-btn" onClick={() => onDelete(_id)}>
                🗑️
              </button>
            )}
          </div>
        </div>

        <p>
          <strong>{t("card.status")}:</strong>{" "}
          <span
            className={`badge badge-${status
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
          >
            {t(`statuses.${status.toLowerCase().replace(/\s+/g, "")}`)}
          </span>
        </p>

        {sender && (
          <p>
            <strong>{t("card.sender")}:</strong> {sender}
          </p>
        )}

        {description && (
          <p className={expanded ? "description expanded" : "description"}>
            <strong>{t("card.description")}:</strong>{" "}
            {expanded || description.length <= 100
              ? description
              : `${description.slice(0, 100)}... `}
            {description.length > 100 && (
              <button onClick={toggleDescription} className="read-more-btn">
                {expanded ? t("card.readLess") : t("card.readMore")}
              </button>
            )}
          </p>
        )}

        {createdAt && (
          <p>
            <strong>{t("card.submitted")}:</strong>{" "}
            {new Date(createdAt).toLocaleDateString()}
          </p>
        )}

        {status === "Delivered" && (
          <div className="delivery-message">
            <div className="icon">✔️</div>
            <div className="message-text">
              <strong>{t("card.ready")}</strong>
              <p>{t("card.pickupNote")}</p>
            </div>
          </div>
        )}

        {status === "Awaiting Payment" && (
          <div className="payment-box">
            <p>
              💵 <strong>Your package has arrived in the U.S.</strong>
            </p>

            {/* ✅ Add this line to show the fee */}
            <p>
              Shipping Fee: <strong>${finalFee?.toFixed(2)}</strong>
            </p>

            <p>Please send payment to:</p>
            <ul style={{ paddingLeft: "1.2rem", marginBottom: "0.5rem" }}>
              <li>
                <strong>CashApp:</strong> <code>$haitipackage</code>
              </li>
              <li>
                <strong>Zelle:</strong> <code>bensleyrameau@gmail.com</code>
              </li>
              <li>
                <strong>MonCash:</strong> <code>+509 3245 6789</code>
              </li>
            </ul>
            <p>After payment, upload your receipt below.</p>

            {receiptUploaded ? (
              <p style={{ color: "green", fontWeight: "bold" }}>
                ✅ Receipt uploaded
              </p>
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={handleReceiptUpload}
              />
            )}
          </div>
        )}

        {onCancel &&
          (status === "Pending" || status === "Awaiting Payment") && (
            <button className="cancel-btn" onClick={() => onCancel(_id)}>
              ❌ {t("card.cancel")}
            </button>
          )}
      </div>

      {showPreview && (
        <div className="modal-overlay" onClick={() => setShowPreview(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowPreview(false)}>
              ❌
            </button>
            <img
              src={screenshotUrl}
              alt="Large Screenshot"
              className="modal-image"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageCard;
