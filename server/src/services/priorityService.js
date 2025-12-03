export const calculatePriority = (data) => {
  let score = 0;
  let reason = [];

  // 1. KYC Verified → +20
  if (data.kycVerified) {
    score += 20;
    reason.push("KYC verified");
  }

  // 2. Amount requested logic
  if (data.amountRequested <= 100) {
    score += 10;
    reason.push("Small request (+10)");
  } else if (data.amountRequested <= 500) {
    score += 5;
  }

  // 3. Title keywords
  const text = `${data.title} ${data.description}`.toLowerCase();

  if (text.includes("hospital") || text.includes("surgery") || text.includes("emergency")) {
    score += 25;
    reason.push("Medical emergency (+25)");
  }

  if (text.includes("rent") || text.includes("eviction")) {
    score += 15;
    reason.push("Housing issue (+15)");
  }

  if (text.includes("court") || text.includes("legal")) {
    score += 10;
    reason.push("Legal issue (+10)");
  }

  if (text.includes("child") || text.includes("kids")) {
    score += 15;
    reason.push("Children involved (+15)");
  }

  // 4. Attachment count
  if (data.attachments?.length >= 2) {
    score += 10;
    reason.push("Supporting documents provided (+10)");
  }

  return {
    score,
    reason: reason.join(", "),
  };
};
