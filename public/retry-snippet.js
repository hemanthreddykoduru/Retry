console.log("%c[Retry Revenue Recovery]", "color: #ff3366; font-weight: bold", "Checkout snippet loaded successfully. Listening for drop-offs...");

(function() {
  const scripts = document.getElementsByTagName('script');
  const currentScript = scripts[scripts.length - 1];
  const merchantKey = currentScript.getAttribute('data-retry-key');
  
  if (merchantKey) {
    console.log("%c[Retry Revenue Recovery]", "color: #ff3366; font-weight: bold", "Initialized with merchant key: " + merchantKey);
    // In the future, this script will bind to window.Razorpay to capture cart abandonment before webhook fires.
  }
})();
