// src/services/emailService.js
import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_0sb8qf5"; // From your EmailJS Services tab
const TEMPLATE_ID = "template_7juf8jp"; // From your EmailJS Templates tab
const PUBLIC_KEY = "EB8Uzf2e2waWAT_TJ";   // From your EmailJS Account tab

export function dispatchAdvisory({ toEmail, region, advisoryText }) {
  return emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    { 
      to_email: toEmail, 
      region: region.name, 
      message: advisoryText 
    },
    PUBLIC_KEY
  );
}