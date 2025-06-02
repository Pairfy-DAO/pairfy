<template>
    <div class="country-selector">
      <h2> Choose your country or region</h2>
      <p>Select your country or region to continue. DAO governance will eventually be enabled in more countries.</p>
      <div class="button-group">
        <button class="country-button" @click="selectCountry('us')" >
          <span class="flag">🇺🇸</span>
          <div class="country-info">
            <div class="country-name">United States</div>
            <div class="language">English</div>
          </div>
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  const selectCountry = (code) => {
    if (code === 'us') {
      window.location.href = 'https://example.com/us';
    } else if (code === 'es') {
      window.location.href = 'https://example.com/es';
    }
  };
  </script>
  
  <style scoped>
  .country-selector {
    max-width: 500px;
    padding: 1.5rem;
    margin: auto;
  }
  
  .country-selector h2 {
    font-size: 20px;
    margin-bottom: 8px;
  }
  
  .country-selector p {
    color: #555;
    margin-bottom: 16px;
  }
  
  .button-group {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }
  
  .country-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background: #fff;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  .country-button:hover {
    background: #f5f5f5;
  }
  
  .flag {
    font-size: 24px;
  }
  
  .country-info {
    text-align: left;
  }
  
  .country-name {
    font-weight: bold;
  }
  
  .language {
    font-size: 12px;
    color: #666;
  }
  </style>
  