export const track = {
  quoteClick: () => {
    if (window.gtag) {
      gtag('event', 'quote_click', { event_category: 'conversion' });
      gtag('event', 'conversion', { send_to: 'AW-18110791560' });
    }
    if (window.fbq) fbq('track', 'InitiateCheckout');
  },
  eligibilityClick: () => {
    if (window.gtag) gtag('event', 'eligibility_click', { event_category: 'conversion' });
    if (window.fbq) fbq('track', 'Lead');
  },
  formSubmit: (formName) => {
    if (window.gtag) {
      gtag('event', 'form_submit', { event_category: 'conversion', event_label: formName });
      gtag('event', 'conversion', { send_to: 'AW-18110791560' });
    }
    if (window.fbq) fbq('track', 'Lead');
  },
  whatsappClick: () => {
    if (window.gtag) gtag('event', 'whatsapp_click', { event_category: 'engagement' });
    if (window.fbq) fbq('track', 'Contact');
  },
  scroll50: () => {
    if (window.gtag) gtag('event', 'scroll_50', { event_category: 'engagement' });
  },
  scroll75: () => {
    if (window.gtag) gtag('event', 'scroll_75', { event_category: 'engagement' });
  },
  engaged30s: () => {
    if (window.gtag) gtag('event', 'engaged_30s', { event_category: 'engagement' });
  },
};
